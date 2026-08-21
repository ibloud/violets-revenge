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

# --- Persistence Helpers (unchanged from original) ---
def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as exc:
            logging.error("Failed to load state from %s: %s", STATE_FILE, exc)
            backup_file = f"{STATE_FILE}.corrupt.{int(time.time())}"
            try:
                shutil.copy(STATE_FILE, backup_file)
            except OSError:
                pass
            return None
    return None

def save_state(state):
    state_dir = os.path.dirname(STATE_FILE) or "."
    with tempfile.NamedTemporaryFile('w', dir=state_dir, delete=False, encoding='utf-8') as tmp:
        json.dump(state, tmp, indent=4)
        tmp_path = tmp.name
    os.replace(tmp_path, STATE_FILE)

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

    async with STATE_LOCK:
        state = load_state()

    # No game running yet — Violet nudges without needing a command
    if not state:
        if random.random() < 0.15:  # don't spam every message
            await message.channel.send(random.choice(IDLE_LINES))
        return

    # A game is running — if the message reads like a move, Violet reacts
    # in character automatically instead of waiting for `!play`
    if looks_like_a_move(message.content):
        async with STATE_LOCK:
            state = load_state()
            if not state or state.get('turn') != TURN_VIOLET:
                return

            violet_hand = state['board']['violet_hand']
            spades_diamonds = [c for c in violet_hand if '♠' in c or '♦' in c]
            violet_move = spades_diamonds[0] if spades_diamonds else (violet_hand[0] if violet_hand else None)

            if not violet_move:
                no_cards = True
            else:
                no_cards = False
                state['board']['violet_hand'].remove(violet_move)
                state['slab'] = violet_move
                state['turn'] = TURN_OPPONENT
                state['rp_pools']['opponent'] -= 1
                save_state(state)
                response = get_violet_response(violet_move, message.author.name)
                slab = state['slab']
                opponent_rp = state['rp_pools']['opponent']

        if no_cards:
            await message.channel.send("Violet has no cards left. The autopsy is complete.")
            return

        embed = discord.Embed(
            title="**Autopsy Log Update**",
            description=response,
            color=0xe74c3c
        )
        embed.add_field(name="Current Slab", value=slab, inline=True)
        embed.add_field(name="Opponent RP", value=opponent_rp, inline=True)
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
        await ctx.send("The slab is empty. Initialize a game first using `!start_game`.")
        return

    if state['turn'] != TURN_OPPONENT:
        await ctx.send("It is not your turn. The examiner is preparing the slab.")
        return
    if card not in state['board']['opponent_hand']:
        await ctx.send("Invalid card. You do not possess that evidence.")
        return

    async with STATE_LOCK:
        latest_state = load_state()
        if not latest_state:
            result_message = "Game state was reset. Please start a new game with `!start_game`."
        elif latest_state['turn'] != TURN_OPPONENT:
            result_message = "It is not your turn. The examiner is preparing the slab."
        elif card not in latest_state['board']['opponent_hand']:
            result_message = "Invalid card. You do not possess that evidence."
        else:
            latest_state['board']['opponent_hand'].remove(card)
            latest_state['slab'] = card
            latest_state['turn'] = TURN_VIOLET
            latest_state['log'] = f"Opponent played {card}."
            save_state(latest_state)
            result_message = f"Move recorded: {card}. Awaiting Violet's response."

    await ctx.send(result_message)


# Run the bot
if TOKEN == 'YOUR_BOT_TOKEN_HERE':
    print("Please set your DISCORD_BOT_TOKEN environment variable on Railway.")
else:
    bot.run(TOKEN)
