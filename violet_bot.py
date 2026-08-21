import discord
from discord.ext import commands
import asyncio
import json
import logging
import os
import random
import shutil
import tempfile
import time

# --- Configuration ---
TOKEN = os.getenv('DISCORD_BOT_TOKEN') or 'YOUR_BOT_TOKEN_HERE'
STATE_FILE = 'game_state.json'
TURN_OPPONENT = 'opponent'
TURN_VIOLET = 'violet'

# Channels where Violet listens and reacts on her own, no ! command required
AUTONOMOUS_CHANNELS = ["pennywise-vs-violet", "violets-card-table"]

# --- Bot Setup ---
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

VIOLET_EMOJI = "🟣"
STATE_LOCK = asyncio.Lock()

# --- Persistence Helpers ---
def load_state(filepath=None):
    """Load game state from file with corruption tolerance.
    
    Args:
        filepath: Path to state file. Defaults to STATE_FILE global.
    
    Returns:
        Parsed state dict, or None if file missing/corrupted.
    """
    if filepath is None:
        filepath = STATE_FILE
    
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
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
    """Save state atomically using tempfile + os.replace.
    
    Args:
        state: Dict to serialize.
        filepath: Path to state file. Defaults to STATE_FILE global.
    """
    if filepath is None:
        filepath = STATE_FILE
    
    state_dir = os.path.dirname(filepath) or "."
    with tempfile.NamedTemporaryFile('w', dir=state_dir, delete=False, encoding='utf-8') as tmp:
        json.dump(state, tmp, indent=4)
        tmp_path = tmp.name
    os.replace(tmp_path, filepath)

def get_violet_response(action_card, target):
    responses = [
        f"Playing {action_card}. Luminol reveals what the naked eye cannot. {target} takes 1 RP damage. {VIOLET_EMOJI}",
        f"Deploying {action_card}. The autopsy proceeds. {target} suffers 1 RP damage. {VIOLET_EMOJI}",
        f"Calculated strike with {action_card}. The scalpel is precise. {target} loses 1 RP. {VIOLET_EMOJI}"
    ]
    return random.choice(responses)

# In-character lines Violet uses when nobody's given her a command,
# just to keep her presence feeling alive in her channels
IDLE_LINES = [
    "The slab is cold. I'm waiting.",
    "Tick. Tock. The examiner doesn't like to be kept waiting.",
    "Every second of silence is evidence of something.",
]

# Simple keyword triggers so Violet can respond in character without `!play`
CARD_WORDS = ["spade", "heart", "diamond", "club", "♠", "♥", "♦", "♣"]


def looks_like_a_move(content: str) -> bool:
    lowered = content.lower()
    return any(word in lowered for word in CARD_WORDS)


# --- Bot Events ---
@bot.event
async def on_ready():
    print(f'Violet_88 logged in as {bot.user}')
    await bot.change_presence(activity=discord.Game(name="Adjudicating Veiled Dominion"))


@bot.event
async def on_message(message):
    # Never react to herself
    if message.author == bot.user:
        return

    # Let normal ! commands (!start_game, !play) keep working everywhere
    if message.content.startswith(bot.command_prefix):
        await bot.process_commands(message)
        return

    channel_name = getattr(message.channel, "name", "")
    if channel_name not in AUTONOMOUS_CHANNELS:
        return

    response_payload = None
    async with STATE_LOCK:
        state = load_state()

        # No game running yet — Violet nudges without needing a command
        if not state:
            response_payload = "idle"
        elif looks_like_a_move(message.content):
            # A game is running — if the message reads like a move, Violet reacts
            # in character automatically instead of waiting for `!play`
            if state.get('turn') != TURN_VIOLET:
                response_payload = "ignore"
            else:
                violet_hand = state['board']['violet_hand']
                spades_diamonds = [c for c in violet_hand if '♠' in c or '♦' in c]
                violet_move = spades_diamonds[0] if spades_diamonds else (violet_hand[0] if violet_hand else None)

                if not violet_move:
                    response_payload = "no_cards"
                else:
                    state['board']['violet_hand'].remove(violet_move)
                    state['slab'] = violet_move
                    state['turn'] = TURN_OPPONENT
                    state['rp_pools']['opponent'] -= 1
                    save_state(state)
                    response_payload = {
                        "response": get_violet_response(violet_move, message.author.name),
                        "slab": state['slab'],
                        "opponent_rp": state['rp_pools']['opponent'],
                    }
        else:
            return

    if response_payload == "idle":
        if random.random() < 0.15:  # don't spam every message
            await message.channel.send(random.choice(IDLE_LINES))
        return

    if response_payload == "no_cards":
        await message.channel.send("Violet has no cards left. The autopsy is complete.")
        return

    if response_payload == "ignore":
        return

    embed = discord.Embed(
        title="**Autopsy Log Update**",
        description=response_payload["response"],
        color=0xe74c3c
    )
    embed.add_field(name="Current Slab", value=response_payload["slab"], inline=True)
    embed.add_field(name="Opponent RP", value=response_payload["opponent_rp"], inline=True)
    await message.channel.send(embed=embed)


# --- Bot Commands (unchanged, still work as fallback) ---
@bot.command(name='start_game')
async def start_game(ctx, opponent: str):
    """Initializes a new game of Veiled Dominion. Usage: !start_game @opponent"""
    async with STATE_LOCK:
        state = {
            "game": "Veiled Dominion",
            "opponent": opponent,
            "turn": TURN_OPPONENT,
            "board": {
                "violet_hand": ["♠8", "♦6", "♣10", "♥7"],
                "opponent_hand": ["♣2", "♥9", "♠A", "♦4"]
            },
            "rp_pools": {"violet": 10, "opponent": 10},
            "slab": None,
            "log": "The morgue is cold. The nightingale is singing."
        }
        save_state(state)

    embed = discord.Embed(
        title="**SUBJECT: ACTIVE PURGE**",
        description=f"The morgue is open. {opponent}, step into Room 88 if you're ready to be judged. {VIOLET_EMOJI}\n\n"
                    f"**RP Pools:** Violet: 10 | {opponent}: 10\n"
                    f"**Status:** Awaiting {opponent}'s first move.",
        color=0x9b59b6
    )
    await ctx.send(embed=embed)


@bot.command(name='play')
async def play_card(ctx, card: str):
    """Allows a player to play a card. Usage: !play ♠A"""
    async with STATE_LOCK:
        state = load_state()
        if not state:
            result_message = "The slab is empty. Initialize a game first using `!start_game`."
        elif state['turn'] != TURN_OPPONENT:
            result_message = "It is not your turn. The examiner is preparing the slab."
        elif card not in state['board']['opponent_hand']:
            result_message = "Invalid card. You do not possess that evidence."
        else:
            state['board']['opponent_hand'].remove(card)
            state['slab'] = card
            state['turn'] = TURN_VIOLET
            state['log'] = f"Opponent played {card}."
            save_state(state)
            result_message = f"Move recorded: {card}. Awaiting Violet's response."

    await ctx.send(result_message)


# Run the bot
if TOKEN == 'YOUR_BOT_TOKEN_HERE':
    print("Please set your DISCORD_BOT_TOKEN environment variable on Railway.")
else:
    bot.run(TOKEN)
