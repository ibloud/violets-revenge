import os
import discord

# --- CONFIGURATION ---
# Load from environment instead of hardcoding — keeps the token out of
# git history if this file ever ends up committed.
TOKEN = os.environ['MTUyODQ2MzA4MzA5MjA1MDEyMQ.G3wo9w.xnUCjI9MszjqHJlNPb-t3reyweUIdJKkdwFX28']
GUILD_ID = int(os.environ['1520905961332539413D'])  # Right click server -> Copy ID


class SetupClient(discord.Client):
    async def on_ready(self):
        print(f'Logged in as {self.user}')
        guild = self.get_guild(GUILD_ID)
        if not guild:
            print("ERROR: Server not found. Check your GUILD_ID.")
            return

        print(f"Starting setup for {guild.name}...")

        # 1. CREATE ROLES (checking if they exist first)
        poi_role = discord.utils.get(guild.roles, name="Person of Interest")
        if not poi_role:
            poi_role = await guild.create_role(name="Person of Interest", reason="Setup script")
            print("Created 'Person of Interest' role")

        playtester_role = discord.utils.get(guild.roles, name="Playtester")
        if not playtester_role:
            playtester_role = await guild.create_role(name="Playtester", reason="Setup script")
            print("Created 'Playtester' role")

        detective_role = discord.utils.get(guild.roles, name="Detective Liaison")
        if not detective_role:
            detective_role = await guild.create_role(name="Detective Liaison", hoist=True, reason="Setup script")
            print("Created 'Detective Liaison' role")
            print("  NOTE: drag this role above Person of Interest / Playtester "
                  "in Server Settings -> Roles — new roles land at the bottom by default.")

        # 2. SET VERIFICATION LEVEL TO MEDIUM
        # (This is server-wide but only affects how new accounts are treated
        # on join — it doesn't touch channel visibility, so it's safe on its own.)
        print("Setting verification level to Medium...")
        await guild.edit(verification_level=discord.VerificationLevel.medium)

        # 3. CREATE NEW CHANNELS — ONLY these get locked down.
        # We do NOT touch guild.default_role's server-wide view_channel
        # permission. Every existing public channel stays exactly as
        # visible as it already was. Only the brand-new sensitive
        # channels below get an explicit @everyone deny.

        # #the-lobby — deliberately left visible to @everyone (read-only),
        # since it's meant to be where new joiners land, not a restricted space.
        lobby_overwrites = {
            guild.default_role: discord.PermissionOverwrite(view_channel=True, send_messages=False),
            detective_role: discord.PermissionOverwrite(view_channel=True, send_messages=True, manage_messages=True, read_message_history=True),
        }

        # Mods only — explicit deny for @everyone, scoped to just this channel
        mod_only_overwrites = {
            guild.default_role: discord.PermissionOverwrite(view_channel=False),
            detective_role: discord.PermissionOverwrite(view_channel=True, send_messages=True, manage_messages=True, read_message_history=True),
        }

        lobby = discord.utils.get(guild.text_channels, name="the-lobby")
        if not lobby:
            lobby = await guild.create_text_channel("the-lobby", overwrites=lobby_overwrites)
            print("Created #the-lobby")

        intake = discord.utils.get(guild.text_channels, name="the-intake-file")
        if not intake:
            intake = await guild.create_text_channel("the-intake-file", overwrites=mod_only_overwrites)
            print("Created #the-intake-file")

        log = discord.utils.get(guild.text_channels, name="claim-attempts-log")
        if not log:
            log = await guild.create_text_channel("claim-attempts-log", overwrites=mod_only_overwrites)
            print("Created #claim-attempts-log")

        # 4. GRANT Person of Interest ACCESS TO THE EXISTING BUG REPORT CHANNEL
        # (Everything else that already existed is left completely untouched.)
        bug_report = discord.utils.get(guild.text_channels, name="bug-report-ticket")
        if bug_report:
            await bug_report.set_permissions(poi_role, view_channel=True, send_messages=True)
            print("Granted Person of Interest access to #bug-report-ticket")

        # 5. PRINT IDs FOR RAILWAY
        print("\n=== SETUP COMPLETE ===")
        print("Copy these IDs into your Railway Environment Variables:\n")
        print(f"LOBBY_CHANNEL_ID = {lobby.id}")
        print(f"REVIEW_CHANNEL_ID = {intake.id}")
        print(f"MOD_LOG_CHANNEL_ID = {log.id}")
        print(f"POI_ROLE_ID = {poi_role.id}")
        print(f"GRANTED_ROLE_ID = {playtester_role.id}")
        print(f"GUILD_ID = {guild.id}")

        await self.close()


intents = discord.Intents.default()
intents.guilds = True
client = SetupClient(intents=intents)
client.run(TOKEN)
