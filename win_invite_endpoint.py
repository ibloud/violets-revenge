"""Retired Discord invite endpoint.

Returns HTTP 410 with the Loptr Lab Roomy invitation to old game clients.
Legacy helpers are retained for reference; the route never calls Discord.
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
    """Retired endpoint: never mint Discord invitations."""
    return jsonify({
        "error": "Discord invitations are discontinued",
        "community_url": "https://roomy.space/join?space=did%3Aplc%3Af62tthd7cmjpfvtlet2crpsq&invite=631116db109c5a7f4c38f03edd57269d",
    }), 410


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
