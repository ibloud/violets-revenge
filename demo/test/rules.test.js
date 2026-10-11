import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, publicState, cloneGameState } from '../engine/rules.js';

function rig(rolls = [], ints = []) {
  const rollQueue = [...rolls];
  const intQueue = [...ints];
  return {
    d6: () => rollQueue.length ? rollQueue.shift() : 6,
    int: max => intQueue.length ? intQueue.shift() % max : 0,
    getState: () => 1,
  };
}

function run(state, side, type, extra = {}) {
  const result = act(state, side, { type, ...extra });
  assert.equal(result.ok, true, `${type}: ${result.reason}`);
  return result;
}

test('preset values are applied to search rolls', () => {
  const handoff = createGame({ preset: 'handoff-defaults', rng: rig([4]) });
  handoff.positions.assailant = 'forensics-office';
  run(handoff, 'assailant', 'search');
  assert.equal(handoff.events.findLast(event => event.type === 'search_roll').target, 4);
  assert.equal(handoff.foundFiles.includes('case-file-1'), true);

  const tuned = createGame({ preset: 'tuned', rng: rig([4]) });
  tuned.positions.assailant = 'forensics-office';
  run(tuned, 'assailant', 'search');
  assert.equal(tuned.events.findLast(event => event.type === 'search_roll').target, 5);
  assert.equal(tuned.foundFiles.includes('case-file-1'), false);
});

test('preset values are applied to catch rolls and capture thresholds', () => {
  const handoff = createGame({ preset: 'handoff-defaults', rng: rig([3, 6, 6]) });
  handoff.positions.assailant = handoff.positions.violet;
  handoff.activeSide = 'violet';
  handoff.actionsLeft = 2;
  run(handoff, 'violet', 'catch');
  assert.equal(handoff.events.findLast(event => event.type === 'catch_roll').target, 4);
  assert.equal(handoff.strikes, 0);

  handoff.strikes = 2;
  handoff.positions.assailant = handoff.positions.violet;
  handoff.activeSide = 'violet';
  handoff.actionsLeft = 2;
  run(handoff, 'violet', 'catch');
  assert.equal(handoff.strikes, 3);
  assert.equal(handoff.terminal.result, 'captured');

  const tuned = createGame({ preset: 'tuned', rng: rig([3, 6, 6]) });
  tuned.positions.assailant = tuned.positions.violet;
  tuned.activeSide = 'violet';
  tuned.actionsLeft = 2;
  run(tuned, 'violet', 'catch');
  assert.equal(tuned.events.findLast(event => event.type === 'catch_roll').target, 2);
  assert.equal(tuned.strikes, 1);
  assert.equal(tuned.terminal, null);

  tuned.positions.assailant = tuned.positions.violet;
  tuned.activeSide = 'violet';
  tuned.actionsLeft = 2;
  tuned.invulnerableThroughVioletTurn = 0;
  run(tuned, 'violet', 'catch');
  assert.equal(tuned.terminal.result, 'captured');
});

test('unknown preset names fail clearly', () => {
  assert.throws(() => createGame({ preset: 'not-a-preset' }), /Unknown rule preset/);
});

test('illegal movement leaves gameplay state unchanged and logs rejection', () => {
  const state = createGame();
  const before = cloneGameState(state);
  const result = act(state, 'assailant', { type: 'move', to: 'incinerator' });
  assert.equal(result.reason, 'room_not_connected');
  const after = cloneGameState(state);
  after.events = before.events;
  assert.deepEqual(after, before);
  assert.equal(state.events.at(-1).type, 'action_rejected');
});

test('burn unlocks exit; escape is terminal', () => {
  const state = createGame();
  state.positions.assailant = 'incinerator';
  state.foundFiles = ['case-file-1', 'case-file-2', 'case-file-3'];
  run(state, 'assailant', 'burn');
  assert.equal(state.exitUnlocked, true);
  state.positions.assailant = 'exit-vestibule';
  state.activeSide = 'assailant';
  state.actionsLeft = 2;
  run(state, 'assailant', 'exit');
  assert.equal(state.terminal.result, 'escaped');
  assert.equal(act(state, 'assailant', { type: 'move', to: 'main-hall' }).reason, 'game_is_terminal');
});

test('concede and restart terminal states', () => {
  const state = createGame();
  run(state, 'assailant', 'concede');
  assert.equal(state.terminal.result, 'conceded');
  const fresh = createGame({ seed: 4 });
  assert.equal(fresh.terminal, null);
  assert.equal(fresh.strikes, 0);
  assert.deepEqual(fresh.foundFiles, []);
});

test('empty deck reshuffles and end-turn hand limit is enforced', () => {
  const state = createGame();
  state.activeSide = 'assailant';
  state.actionsLeft = 2;
  state.decks.violet = [];
  state.discards.violet = ['V-01', 'V-02'];
  state.hands.assailant = ['A-03', 'A-04', 'A-05', 'A-06'];
  run(state, 'assailant', 'end_turn');
  assert.equal(state.hands.assailant.length, 3);
  assert.ok(state.events.some(event => event.type === 'deck_reshuffled'));
});

test('scan reports nearby status without revealing exact room; sigil reveals exact room', () => {
  const state = createGame();
  state.positions.assailant = 'main-hall';
  state.positions.violet = 'morgue-freezers';
  state.activeSide = 'violet';
  state.actionsLeft = 2;
  const scan = act(state, 'violet', { type: 'scan' });
  assert.equal(scan.outcome.result, 'nearby');
  assert.equal(state.revealedRoom, null);

  state.activeSide = 'assailant';
  state.actionsLeft = 2;
  state.positions.assailant = 'morgue-freezers';
  state.sigils = [{ id: 1, room: 'main-hall' }];
  act(state, 'assailant', { type: 'move', to: 'main-hall' });
  assert.equal(state.revealedRoom, 'main-hall');
});

test('Violet public view conceals unknown position and Assailant hand/movement', () => {
  const state = createGame();
  assert.equal(publicState(state, 'violet').positions.assailant, null);
  assert.equal(publicState(state, 'violet').hands.assailant.length, 0);
  state.events.push({ seq: 999, type: 'moved', side: 'assailant', from: 'morgue-freezers', to: 'main-hall' });
  assert.equal(publicState(state, 'violet').events.some(event => event.seq === 999), false);
});

test('each placeholder card has a working effect', () => {
  const state = createGame();
  const play = (side, id, target) => {
    state.activeSide = side;
    state.actionsLeft = 2;
    if (!state.hands[side].includes(id)) state.hands[side].push(id);
    run(state, side, 'play', { cardId: id, target });
  };

  play('assailant', 'A-01');
  assert.ok(state.quietStepsUntilAssailantTurn);
  play('assailant', 'A-03');
  assert.equal(state.lockPick, 1);
  state.positions.assailant = 'morgue-freezers';
  play('assailant', 'A-05', 'main-hall');
  assert.equal(state.positions.assailant, 'main-hall');
  play('assailant', 'A-07');
  assert.equal(state.smokeCharges, 1);
  play('assailant', 'A-09');
  assert.equal(state.scanHidden, true);
  state.strikes = 1;
  play('assailant', 'A-11');
  assert.equal(state.strikes, 0);

  state.positions.violet = 'autopsy-room';
  play('violet', 'V-01');
  assert.ok(state.sigils.some(sigil => sigil.room === 'autopsy-room'));
  play('violet', 'V-03');
  assert.equal(state.graveDirt, 1);
  state.roomHistory = ['morgue-freezers', 'main-hall'];
  play('violet', 'V-05');
  assert.equal(state.revealedRoom, 'main-hall');
  state.positions.assailant = 'evidence-storage';
  play('violet', 'V-07');
  assert.equal(state.revealedRoom, 'evidence-storage');
  state.positions.violet = 'autopsy-room';
  play('violet', 'V-08', 'morgue-freezers');
  assert.equal(state.positions.violet, 'morgue-freezers');
  play('violet', 'V-10');
  assert.equal(state.steadyHand, 1);
  play('violet', 'V-12', 'main-hall|exit-vestibule');
  assert.ok(state.lockedDoors['exit-vestibule|main-hall']);
});

test('Lock-Pick and Quiet Steps affect the next checks', () => {
  const state = createGame({ rng: rig([5, 6]) });
  state.activeSide = 'assailant';
  state.actionsLeft = 2;
  state.positions.assailant = 'forensics-office';
  state.hands.assailant.push('A-03');
  run(state, 'assailant', 'play', { cardId: 'A-03' });
  run(state, 'assailant', 'search');
  assert.equal(state.events.findLast(event => event.type === 'search_roll').modifier, 1);

  state.activeSide = 'assailant';
  state.actionsLeft = 2;
  state.hands.assailant.push('A-01');
  run(state, 'assailant', 'play', { cardId: 'A-01' });
  state.positions.violet = state.positions.assailant;
  state.activeSide = 'violet';
  state.actionsLeft = 2;
  run(state, 'violet', 'catch');
  assert.equal(state.events.findLast(event => event.type === 'catch_roll').target, 6);
});

test('fixed seed gives repeatable event history', () => {
  function playThrough() {
    const state = createGame({ seed: 42 });
    for (let index = 0; index < 8 && !state.terminal; index++) {
      const side = state.activeSide;
      act(
        state,
        side,
        side === 'assailant'
          ? { type: 'move', to: state.positions.assailant === 'morgue-freezers' ? 'main-hall' : 'morgue-freezers' }
          : { type: 'scan' },
      );
    }
    return state.events;
  }
  assert.deepEqual(playThrough(), playThrough());
});
