"""
WIN-INVITE ENDPOINT
────────────────────
Mints a fresh, single-use Discord invite on demand, instead of the game
showing a permanent hardcoded link.

Runs as a tiny Flask app alongside the existing Python bot (same Railway
service, or a second small service — either works). Needs the bot's
token, channel ID, and a shared API secret.

Requires the bot to have "Create Instant Invite" permission on that
channel (Server Settings → Roles → your bot's role, or per-channel
overrides).

Install: pip install flask requests
Run:     python win_invite_endpoint.py
"""

import os
import hmac
import time
import logging
from threading import Lock
import requests
from requests.exceptions import RequestException
from flask import Flask, jsonify, request

app = Flask(__name__)

REQUIRED_ENV_VARS = ["DISCORD_BOT_TOKEN", "LOBBY_CHANNEL_ID", "INVITE_API_SECRET"]


def load_config():
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")
    return {var: os.getenv(var) for var in REQUIRED_ENV_VARS}


try:
    CONFIG = load_config()
except RuntimeError as exc:
    app.logger.error("Configuration error: %s", exc)
    CONFIG = {}

INVITE_MAX_AGE_SECONDS = 60 * 60 * 48  # invite itself expires in 48h if unused
INVITE_MAX_USES = 1  # single use — becomes invalid after one join
RATE_LIMIT_WINDOW_SECONDS = 60 * 60
RATE_LIMIT_MAX_REQUESTS = 5
REQUEST_ATTEMPTS = {}
REQUEST_ATTEMPTS_LOCK = Lock()


def client_ip():
    return request.remote_addr or "unknown"


def within_rate_limit(ip_address):
    now = int(time.time())
    with REQUEST_ATTEMPTS_LOCK:
        for known_ip in list(REQUEST_ATTEMPTS.keys()):
            recent = [ts for ts in REQUEST_ATTEMPTS[known_ip] if now - ts <= RATE_LIMIT_WINDOW_SECONDS]
            if recent:
                REQUEST_ATTEMPTS[known_ip] = recent
            else:
                del REQUEST_ATTEMPTS[known_ip]

        timestamps = REQUEST_ATTEMPTS.get(ip_address, [])
        if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
            REQUEST_ATTEMPTS[ip_address] = timestamps
            return False
        timestamps.append(now)
        REQUEST_ATTEMPTS[ip_address] = timestamps
        return True


def is_authorized():
    provided = request.headers.get("X-API-Token", "")
    expected = CONFIG.get("INVITE_API_SECRET", "")
    if not provided or not expected:
        return False
    return hmac.compare_digest(provided, expected)


def create_discord_invite():
    bot_token = CONFIG["DISCORD_BOT_TOKEN"]
    lobby_channel_id = CONFIG["LOBBY_CHANNEL_ID"]
    url = f"https://discord.com/api/v10/channels/{lobby_channel_id}/invites"

    try:
        resp = requests.post(
            url,
            headers={"Authorization": f"Bot {bot_token}", "Content-Type": "application/json"},
            json={
                "max_age": INVITE_MAX_AGE_SECONDS,
                "max_uses": INVITE_MAX_USES,
                "unique": True,
            },
            timeout=5.0,
        )
        resp.raise_for_status()
        data = resp.json()
        code = data.get("code")
        if not isinstance(code, str) or not code:
            raise ValueError(f"Unexpected Discord invite response schema: {data}")
        return f"https://discord.gg/{code}"
    except (RequestException, ValueError) as exc:
        logging.error("Discord invite creation failed: %s", exc)
        return None


@app.route("/win-invite", methods=["POST"])
def win_invite():
    """
    Called by the game's client-side JS the moment the win state fires.
    Returns {"invite_url": "..."} for the game to turn into a QR code
    client-side (e.g. with a small JS QR library — no need to ship a
    static image anymore).
    """
    if not CONFIG:
        return jsonify({"error": "Service is not configured"}), 503
    if not is_authorized():
        return jsonify({"error": "Unauthorized"}), 401

    ip_address = client_ip()
    if not within_rate_limit(ip_address):
        return jsonify({"error": "Rate limit exceeded"}), 429

    invite_url = create_discord_invite()
    if not invite_url:
        return jsonify({"error": "Could not create invite"}), 502
    return jsonify({"invite_url": invite_url})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
