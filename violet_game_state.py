"""Transport-independent persistence helpers for the retired Violet card bot.

This module deliberately has no Discord, Flask, or network dependency. It preserves
legacy state-file behavior for offline tests and future browser-port extraction.
It does not implement or certify the complete Veiled Dominion rules.
"""
import asyncio
import json
import logging
import os
import shutil
import tempfile
import time

STATE_FILE = "game_state.json"
TURN_OPPONENT = "opponent"
TURN_VIOLET = "violet"
STATE_LOCK = asyncio.Lock()


def load_state(filepath=None):
    """Load JSON state; preserve a timestamped backup if the file is corrupt."""
    if filepath is None:
        filepath = STATE_FILE

    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as exc:
            logging.error("Failed to load state from %s: %s", filepath, exc)
            backup_file = f"{filepath}.corrupt.{int(time.time())}"
            try:
                shutil.copy(filepath, backup_file)
            except OSError:
                pass
            return None
    return None


def save_state(state, filepath=None):
    """Write JSON state atomically using a temporary file and os.replace."""
    if filepath is None:
        filepath = STATE_FILE

    state_dir = os.path.dirname(filepath) or "."
    with tempfile.NamedTemporaryFile(
        "w", dir=state_dir, delete=False, encoding="utf-8"
    ) as tmp:
        json.dump(state, tmp, indent=4)
        tmp_path = tmp.name
    os.replace(tmp_path, filepath)
