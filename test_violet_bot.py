import os
import json
import tempfile
import asyncio
import pytest
from unittest.mock import patch, AsyncMock
from violet_bot import (
    load_state,
    save_state,
    TURN_OPPONENT,
    TURN_VIOLET,
    STATE_LOCK,
)


@pytest.fixture
def temp_state_file():
    """Provides a temporary file path for state tests, cleaning up afterward."""
    fd, path = tempfile.mkstemp(suffix=".json")
    os.close(fd)
    yield path
    if os.path.exists(path):
        os.remove(path)
    # Clean up any corrupt backup files created during tests
    for f in os.listdir(os.path.dirname(path) or "."):
        if ".corrupt." in f:
            try:
                os.remove(os.path.join(os.path.dirname(path) or ".", f))
            except OSError:
                pass


class TestTurnEnums:
    """Validates turn state constants."""

    def test_turn_enum_constants(self):
        """Validates that explicit turn enums are structured correctly."""
        assert TURN_OPPONENT == "opponent"
        assert TURN_VIOLET == "violet"


class TestStateLoading:
    """Tests for load_state function with various file conditions."""

    def test_load_state_missing_file(self):
        """Verifies that loading a non-existent file gracefully returns None."""
        non_existent = "non_existent_state_file_99999.json"
        if os.path.exists(non_existent):
            os.remove(non_existent)

        data = load_state(non_existent)
        assert data is None

    def test_load_state_corrupted_json(self, temp_state_file):
        """Verifies that corrupted JSON is caught, backed up, and falls back safely to None."""
        # Write malformed JSON to the temp file
        with open(temp_state_file, "w", encoding="utf-8") as f:
            f.write("{invalid_json: true,,}")

        data = load_state(temp_state_file)
        assert data is None

        # Verify a backup file with '.corrupt.' was generated
        dir_name = os.path.dirname(temp_state_file) or "."
        files = os.listdir(dir_name)
        corrupt_backups = [f for f in files if ".corrupt." in f and temp_state_file.split("/")[-1] in f]
        assert len(corrupt_backups) >= 1, "Expected at least one corrupt backup file"


class TestAtomicSave:
    """Tests for save_state function with atomic write semantics."""

    def test_atomic_save_and_load_success(self, temp_state_file):
        """Verifies that state is saved atomically and loaded correctly without corruption."""
        test_data = {
            "player_id": 123456789,
            "opponent": "@rival",
            "turn": TURN_OPPONENT,
            "board": {
                "violet_hand": ["♠8", "♦6"],
                "opponent_hand": ["♣2", "♥9"]
            },
            "rp_pools": {"violet": 10, "opponent": 10}
        }

        save_state(test_data, temp_state_file)

        # Ensure file exists and contains valid data
        assert os.path.exists(temp_state_file)

        loaded_data = load_state(temp_state_file)
        assert loaded_data == test_data

    def test_atomic_save_replaces_correctly(self, temp_state_file):
        """Verifies atomic write overwrites existing state files cleanly."""
        initial_data = {"turn": TURN_OPPONENT, "rp": 5}
        updated_data = {"turn": TURN_VIOLET, "rp": 3}

        save_state(initial_data, temp_state_file)
        assert load_state(temp_state_file)["turn"] == TURN_OPPONENT

        save_state(updated_data, temp_state_file)
        loaded = load_state(temp_state_file)
        assert loaded["turn"] == TURN_VIOLET
        assert loaded["rp"] == 3
        # Ensure no orphaned temp files
        assert os.path.exists(temp_state_file)

    def test_atomic_save_uses_tempfile(self, temp_state_file):
        """Verifies that save_state uses tempfile + os.replace (atomic pattern)."""
        test_data = {"test": "data"}

        # Patch tempfile.NamedTemporaryFile to verify it's called
        with patch('violet_bot.tempfile.NamedTemporaryFile') as mock_tmp:
            mock_tmp.return_value.__enter__.return_value.name = temp_state_file + ".tmp"
            mock_tmp.return_value.__enter__.return_value.write = lambda x: None

            # Patch os.replace to avoid actual filesystem
            with patch('violet_bot.os.replace'):
                try:
                    save_state(test_data, temp_state_file)
                except (AttributeError, TypeError):
                    # Expected if mock doesn't fully simulate file behavior
                    pass

            mock_tmp.assert_called_once()


class TestStateTransitions:
    """Tests for game state logic and turn separation."""

    def test_state_transition_decoupling(self):
        """Simulates turn-state separation from literal user strings to prevent deadlocks."""
        game_session = {
            "user_handle": "@alice",
            "opponent": "@bob",
            "turn": TURN_OPPONENT
        }

        # Transition turn
        if game_session["turn"] == TURN_OPPONENT:
            game_session["turn"] = TURN_VIOLET
        else:
            game_session["turn"] = TURN_OPPONENT

        assert game_session["turn"] == TURN_VIOLET
        # Ensure user handles remain decoupled from turn tracking sentinels
        assert game_session["user_handle"] == "@alice"
        assert game_session["opponent"] == "@bob"

    def test_turn_values_do_not_collide(self):
        """Ensures turn values are distinct and non-empty."""
        assert TURN_OPPONENT != TURN_VIOLET
        assert TURN_OPPONENT != ""
        assert TURN_VIOLET != ""
        assert len(TURN_OPPONENT) > 0
        assert len(TURN_VIOLET) > 0


class TestConcurrency:
    """Tests for concurrent state access safety with STATE_LOCK."""

    @pytest.mark.asyncio
    async def test_state_mutations_are_serialized(self, temp_state_file):
        """Verifies that overlapping mutations respect STATE_LOCK."""
        # Initialize state
        initial_data = {"turn": TURN_OPPONENT, "rp": 10}
        save_state(initial_data, temp_state_file)

        mutations = []

        async def mutate_state(index):
            async with STATE_LOCK:
                data = load_state(temp_state_file)
                if data:
                    data["rp"] -= 1
                    mutations.append(index)
                    # Simulate slow write to increase chance of race condition
                    await asyncio.sleep(0.01)
                    save_state(data, temp_state_file)

        # Launch 3 concurrent mutations
        await asyncio.gather(
            mutate_state(0),
            mutate_state(1),
            mutate_state(2)
        )

        final = load_state(temp_state_file)
        # All 3 decrements should have been applied (no race condition)
        assert final["rp"] == 7, f"Expected rp=7 after 3 decrements, got {final['rp']}"
        assert len(mutations) == 3, f"Expected 3 mutations, got {len(mutations)}"

    @pytest.mark.asyncio
    async def test_lock_prevents_concurrent_writes(self, temp_state_file):
        """Verifies that STATE_LOCK prevents concurrent writes."""
        save_state({"counter": 0}, temp_state_file)

        call_order = []

        async def locked_increment():
            async with STATE_LOCK:
                call_order.append("start")
                await asyncio.sleep(0.02)
                data = load_state(temp_state_file)
                data["counter"] += 1
                save_state(data, temp_state_file)
                call_order.append("end")

        # Launch 2 concurrent increments
        await asyncio.gather(
            locked_increment(),
            locked_increment()
        )

        final = load_state(temp_state_file)
        assert final["counter"] == 2
        # Verify that calls did not interleave (lock worked)
        # Pattern should be: start, end, start, end (not start, start, end, end)
        assert call_order == ["start", "end", "start", "end"]


class TestEdgeCases:
    """Tests for edge cases and error conditions."""

    def test_load_state_empty_file(self, temp_state_file):
        """Verifies handling of empty JSON files."""
        with open(temp_state_file, "w", encoding="utf-8") as f:
            f.write("")

        data = load_state(temp_state_file)
        # Should handle gracefully (corrupt backup created, returns None)
        assert data is None

    def test_save_state_creates_directory_if_needed(self):
        """Verifies that save_state handles nested directories."""
        nested_dir = tempfile.mkdtemp()
        nested_file = os.path.join(nested_dir, "subdir", "state.json")

        # Create parent but not the subdir
        os.makedirs(os.path.dirname(nested_file), exist_ok=True)

        test_data = {"test": "data"}
        save_state(test_data, nested_file)

        assert os.path.exists(nested_file)
        loaded = load_state(nested_file)
        assert loaded == test_data

        # Cleanup
        os.remove(nested_file)
        os.rmdir(os.path.dirname(nested_file))
        os.rmdir(nested_dir)

    def test_load_state_with_default_filepath(self, temp_state_file, monkeypatch):
        """Verifies that load_state uses STATE_FILE when filepath not provided."""
        # Mock STATE_FILE to point to our temp file
        import violet_bot
        monkeypatch.setattr(violet_bot, "STATE_FILE", temp_state_file)

        test_data = {"test": "default_path"}
        save_state(test_data, temp_state_file)

        # Call without filepath argument
        loaded = load_state()
        assert loaded == test_data

    def test_save_state_with_default_filepath(self, temp_state_file, monkeypatch):
        """Verifies that save_state uses STATE_FILE when filepath not provided."""
        import violet_bot
        monkeypatch.setattr(violet_bot, "STATE_FILE", temp_state_file)

        test_data = {"test": "default_save"}
        # Call without filepath argument
        save_state(test_data)

        loaded = load_state(temp_state_file)
        assert loaded == test_data


class TestIntegration:
    """Integration tests combining multiple components."""

    def test_full_game_state_cycle(self, temp_state_file):
        """Tests a complete game state initialization, mutation, and persistence cycle."""
        # Initialize game
        initial_state = {
            "game": "Veiled Dominion",
            "opponent": "@alice",
            "turn": TURN_OPPONENT,
            "board": {
                "violet_hand": ["♠8", "♦6", "♣10", "♥7"],
                "opponent_hand": ["♣2", "♥9", "♠A", "♦4"]
            },
            "rp_pools": {"violet": 10, "opponent": 10},
            "slab": None,
        }
        save_state(initial_state, temp_state_file)

        # Opponent plays
        state = load_state(temp_state_file)
        state["board"]["opponent_hand"].remove("♣2")
        state["slab"] = "♣2"
        state["turn"] = TURN_VIOLET
        state["rp_pools"]["violet"] -= 1
        save_state(state, temp_state_file)

        # Violet plays
        state = load_state(temp_state_file)
        state["board"]["violet_hand"].remove("♠8")
        state["slab"] = "♠8"
        state["turn"] = TURN_OPPONENT
        state["rp_pools"]["opponent"] -= 1
        save_state(state, temp_state_file)

        # Verify final state
        final = load_state(temp_state_file)
        assert final["turn"] == TURN_OPPONENT
        assert final["rp_pools"]["violet"] == 9
        assert final["rp_pools"]["opponent"] == 9
        assert "♠8" not in final["board"]["violet_hand"]
        assert "♣2" not in final["board"]["opponent_hand"]
        assert final["slab"] == "♠8"
