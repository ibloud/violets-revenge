import discord
from discord.ext import commands
import json
import os
import random

# --- Configuration ---
TOKEN = os.getenv('DISCORD_BOT_TOKEN') or 'YOUR_BOT_TOKEN_HERE'
STATE_FILE = 'game_state.json'

# Channels where Violet listens and reacts on her own, no ! command required
AUTONOMOUS_CHANNELS = ["pennywise-vs-violet", "violets-card-table"]

# --- Bot Setup ---
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

VIOLET_EMOJI = "🟣"

# --- Persistence Helpers (unchanged from original) ---
def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return None

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=4)

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

    state = load_state()

    # No game running yet — Violet nudges without needing a command
    if not state:
        if random.random() < 0.15:  # don't spam every message
            await message.channel.send(random.choice(IDLE_LINES))
        return

    # A game is running — if the message reads like a move, Violet reacts
    # in character automatically instead of waiting for `!play`
    if looks_like_a_move(message.content) and state.get('turn') == 'opponent':
        violet_hand = state['board']['violet_hand']
        spades_diamonds = [c for c in violet_hand if '♠' in c or '♦' in c]
        violet_move = spades_diamonds[0] if spades_diamonds else (violet_hand[0] if violet_hand else None)

        if violet_move:
            state['board']['violet_hand'].remove(violet_move)
            state['slab'] = violet_move
            state['turn'] = 'opponent'
            state['rp_pools']['opponent'] -= 1
            save_state(state)

            response = get_violet_response(violet_move, message.author.name)
            embed = discord.Embed(
                title="**Autopsy Log Update**",
                description=response,
                color=0xe74c3c
            )
            embed.add_field(name="Current Slab", value=state['slab'], inline=True)
            embed.add_field(name="Opponent RP", value=state['rp_pools']['opponent'], inline=True)
            await message.channel.send(embed=embed)
        else:
            await message.channel.send("Violet has no cards left. The autopsy is complete.")


# --- Bot Commands (unchanged, still work as fallback) ---
@bot.command(name='start_game')
async def start_game(ctx, opponent: str):
    """Initializes a new game of Veiled Dominion. Usage: !start_game @opponent"""
    state = {
        "game": "Veiled Dominion",
        "turn": opponent,
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
    state = load_state()
    if not state:
        await ctx.send("The slab is empty. Initialize a game first using `!start_game`.")
        return

    if state['turn'] == 'opponent':
        if card in state['board']['opponent_hand']:
            state['board']['opponent_hand'].remove(card)
            state['slab'] = card
            state['turn'] = 'violet'
            state['log'] = f"Opponent played {card}."
            save_state(state)
            await ctx.send(f"Move recorded: {card}. Awaiting Violet's response.")
        else:
            await ctx.send("Invalid card. You do not possess that evidence.")
    else:
        await ctx.send("It is not your turn. The examiner is preparing the slab.")


# Run the bot
if TOKEN == 'YOUR_BOT_TOKEN_HERE':
    print("Please set your DISCORD_BOT_TOKEN environment variable on Railway.")
else:
    bot.run(TOKEN)
