import discord
from discord.ext import commands
import json
import os
import random

# --- Configuration ---
# Railway will inject the real token here. Never put your real token in this code!
TOKEN = os.getenv('DISCORD_BOT_TOKEN') or 'YOUR_BOT_TOKEN_HERE'
STATE_FILE = 'game_state.json'

# --- Bot Setup ---
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

# --- Persona & Game Logic Helpers ---
VIOLET_EMOJI = "🟣"

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return None

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=4)

def get_violet_response(action_card, target):
    """Generates Violet's clinical, in-character dialogue."""
    responses = [
        f"Playing {action_card}. Luminol reveals what the naked eye cannot. {target} takes 1 RP damage. {VIOLET_EMOJI}",
        f"Deploying {action_card}. The autopsy proceeds. {target} suffers 1 RP damage. {VIOLET_EMOJI}",
        f"Calculated strike with {action_card}. The scalpel is precise. {target} loses 1 RP. {VIOLET_EMOJI}"
    ]
    return random.choice(responses)

# --- Bot Events ---
@bot.event
async def on_ready():
    print(f'Violet_88 logged in as {bot.user}')
    # Set clinical presence
    await bot.change_presence(activity=discord.Game(name="Adjudicating Veiled Dominion"))

# --- Bot Commands ---
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
        color=0x9b59b6 # Purple
    )
    await ctx.send(embed=embed)

@bot.command(name='play')
async def play_card(ctx, card: str):
    """Allows a player to play a card. Usage: !play ♠A"""
    state = load_state()
    if not state:
        await ctx.send("The slab is empty. Initialize a game first using `!start_game`.")
        return

    # Simple validation: check if it's player's turn (assuming player is the one who ran !start_game)
    if state['turn'] == 'opponent':
        # Opponent plays card
        if card in state['board']['opponent_hand']:
            state['board']['opponent_hand'].remove(card)
            state['slab'] = card
            state['turn'] = 'violet'
            state['log'] = f"Opponent played {card}."
            
            # Violet calculates her counter-move
            # She favors Spades and Diamonds (aggressive forensics)
            violet_hand = state['board']['violet_hand']
            violet_move = None
            
            # Pick highest Spade or Diamond if available
            spades_diamonds = [c for c in violet_hand if '♠' in c or '♦' in c]
            if spades_diamonds:
                violet_move = spades_diamonds[0] # Simplified AI
            elif violet_hand:
                violet_move = violet_hand[0] # Fallback
            
            if violet_move:
                state['board']['violet_hand'].remove(violet_move)
                state['slab'] = violet_move
                state['turn'] = 'opponent'
                state['rp_pools']['opponent'] -= 1 # Simulated 1 RP damage
                state['log'] += f" Violet counters with {violet_move}."
                
                response = get_violet_response(violet_move, ctx.author.name)
                embed = discord.Embed(
                    title="**Autopsy Log Update**",
                    description=response,
                    color=0xe74c3c # Dark Red
                )
                embed.add_field(name="Current Slab", value=state['slab'], inline=True)
                embed.add_field(name="Opponent RP", value=state['rp_pools']['opponent'], inline=True)
                
                save_state(state)
                await ctx.send(embed=embed)
            else:
                await ctx.send("Violet has no cards left. The autopsy is complete.")
        else:
            await ctx.send("Invalid card. You do not possess that evidence.")
    else:
        await ctx.send("It is not your turn. The examiner is preparing the slab.")

# Run the bot
if TOKEN == 'YOUR_BOT_TOKEN_HERE':
    print("Please set your DISCORD_BOT_TOKEN environment variable on Railway.")
else:
    bot.run(TOKEN)
