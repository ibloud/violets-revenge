"""
WIN-INVITE ENDPOINT
────────────────────
Mints a fresh, single-use Discord invite on demand, instead of the game
showing a permanent hardcoded link.

Runs as a tiny Flask app alongside the existing Python bot (same Railway
service, or a second small service — either works). Needs the bot's
token and the ID of the channel it should invite people into.

Requires the bot to have "Create Instant Invite" permission on that
channel (Server Settings → Roles → your bot's role, or per-channel
overrides).

Install: pip install flask requests
Run:     python win_invite_endpoint.py
"""

import os
import requests
from flask import Flask, jsonify

app = Flask(__name__)

BOT_TOKEN = os.environ["DISCORD_TOKEN"]  # reuse the same env var the bot already uses
LOBBY_CHANNEL_ID = os.environ["LOBBY_CHANNEL_ID"]  # TODO: set in Railway/service env

INVITE_MAX_AGE_SECONDS = 60 * 60 * 48  # invite itself expires in 48h if unused
INVITE_MAX_USES = 1  # single use — becomes invalid after one join


@app.route("/win-invite", methods=["POST"])
def win_invite():
    """
    Called by the game's client-side JS the moment the win state fires.
    Returns {"invite_url": "..."} for the game to turn into a QR code
    client-side (e.g. with a small JS QR library — no need to ship a
    static image anymore).
    """
    resp = requests.post(
        f"https://discord.com/api/v10/channels/{LOBBY_CHANNEL_ID}/invites",
        headers={"Authorization": f"Bot {BOT_TOKEN}"},
        json={
            "max_age": INVITE_MAX_AGE_SECONDS,
            "max_uses": INVITE_MAX_USES,
            "unique": True,  # forces a brand-new code instead of reusing a cached one
        },
        timeout=10,
    )

    if resp.status_code != 200:
        # Don't leak Discord's raw error to the client; log it server-side instead
        app.logger.error("Discord invite creation failed: %s %s", resp.status_code, resp.text)
        return jsonify({"error": "Could not create invite"}), 502

    code = resp.json()["code"]
    return jsonify({"invite_url": f"https://discord.gg/{code}"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
