import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, legalDestinations, publicState } from '../engine/rules.js';
import { createRng } from '../engine/rng.js';
import { RULE_PRESETS } from '../engine/presets.js';

const graph = {
  'main-hall': ['exit-vestibule', 'forensics-office', 'records-lockers', 'morgue-freezers', 'evidence-storage'],
  'exit-vestibule': ['main-hall'],
  'forensics-office': ['main-hall', 'records-lockers'],
  'records-lockers': ['main-hall', 'forensics-office'],
  'evidence-storage': ['main-hall', 'incinerator'],
  'morgue-freezers': ['main-hall', 'autopsy-room'],
  'autopsy-room': ['morgue-freezers'],
  incinerator: ['evidence-storage'],
};

function path(from, to) {
  const queue = [[from]];
  const seen = new Set([from]);
  while (queue.length) {
    const current = queue.shift();
    const last = current.at(-1);
    if (last === to) return current.slice(1);
    for (const next of graph[last] || []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push([...current, next]);
      }
    }
  }
  return [];
}

function assailantBot(state) {
  const here = state.positions.assailant;
  if (here === 'incinerator' && state.foundFiles.length === 3 && !state.burned) return { type: 'burn' };
  if (here === 'exit-vestibule' && state.exitUnlocked) return { type: 'exit' };

  if (!state.burned && state.foundFiles.length === 3) {
    const route = path(here, 'incinerator');
    if (route.length) return { type: 'move', to: route[0] };
  }

  if (!state.burned && state.foundFiles.length < 3) {
    const target = Object.entries(state.files)
      .filter(([id]) => !state.foundFiles.includes(id))
      .map(([id, room]) => ({ room, path: path(here, room) }))
      .sort((a, b) => a.path.length - b.path.length)[0];
    if (target?.room === here) return { type: 'search' };
    if (target?.path.length) return { type: 'move', to: target.path[0] };
  }

  if (state.burned && here !== 'exit-vestibule') {
    const route = path(here, 'exit-vestibule');
    if (route.length) return { type: 'move', to: route[0] };
  }
  const destinations = legalDestinations(state, 'assailant');
  return destinations.length ? { type: 'move', to: destinations[0] } : { type: 'end_turn' };
}

function violetBot(state, rng) {
  const view = publicState(state, 'violet');
  const here = view.positions.violet;
  const target = view.positions.assailant;

  if (state.positions.assailant === here && state.round > state.invulnerableThroughVioletTurn) {
    const steady = state.hands.violet.find(id => id === 'V-10' || id === 'V-11');
    if (steady && state.actionsLeft === 2) return { type: 'play', cardId: steady };
    return { type: 'catch' };
  }
  if (target && state.hands.violet.includes('V-07')) return { type: 'play', cardId: 'V-07' };
  if (!target && state.hands.violet.some(id => id === 'V-05' || id === 'V-06')) {
    return { type: 'play', cardId: state.hands.violet.find(id => id === 'V-05' || id === 'V-06') };
  }
  if (target) {
    const route = path(here, target);
    if (route.length && legalDestinations(state, 'violet').includes(route[0])) {
      const patrol = state.hands.violet.find(id => id === 'V-08' || id === 'V-09');
      if (patrol && state.actionsLeft === 2) return { type: 'play', cardId: patrol, target: route[0] };
      return { type: 'move', to: route[0] };
    }
    return { type: 'scan' };
  }
  if (here !== 'main-hall') {
    const route = path(here, 'main-hall');
    if (route.length) return { type: 'move', to: route[0] };
  }
  if (state.sigils.length < 3 && !state.sigils.some(sigil => sigil.room === here)) return { type: 'sigil' };
  return { type: 'scan' };
}

function play(seed, preset) {
  const state = createGame({ seed, preset });
  const rng = createRng(seed ^ 0x9e3779b9);
  let guard = 0;

  while (!state.terminal && guard++ < 500) {
    const side = state.activeSide;
    const action = side === 'assailant' ? assailantBot(state) : violetBot(state, rng);
    const result = act(state, side, action);
    if (!result.ok && result.reason !== 'not_your_turn') {
      throw new Error(`${side} ${action.type}: ${result.reason}`);
    }
  }
  if (!state.terminal) state.terminal = { result: 'conceded', reason: 'simulation_guard' };
  return { result: state.terminal.result, rounds: state.round };
}

function simulate(preset) {
  let escaped = 0;
  let captured = 0;
  let other = 0;
  let rounds = 0;
  for (let seed = 1; seed <= 2000; seed++) {
    const result = play(seed, preset);
    if (result.result === 'escaped') escaped++;
    else if (result.result === 'captured') captured++;
    else other++;
    rounds += result.rounds;
  }
  return {
    preset,
    games: 2000,
    escaped,
    captured,
    other,
    winRate: Number((escaped / 2000 * 100).toFixed(1)),
    meanRounds: Number((rounds / 2000).toFixed(2)),
  };
}

test('both named presets expose the intended proposal rules', () => {
  assert.deepEqual(
    {
      strikesToCapture: RULE_PRESETS['handoff-defaults'].strikesToCapture,
      catchTarget: RULE_PRESETS['handoff-defaults'].catchTarget,
      searchTarget: RULE_PRESETS['handoff-defaults'].searchTarget,
    },
    { strikesToCapture: 3, catchTarget: 4, searchTarget: 4 },
  );
  assert.deepEqual(
    {
      strikesToCapture: RULE_PRESETS.tuned.strikesToCapture,
      catchTarget: RULE_PRESETS.tuned.catchTarget,
      searchTarget: RULE_PRESETS.tuned.searchTarget,
    },
    { strikesToCapture: 2, catchTarget: 2, searchTarget: 5 },
  );
});

for (const preset of ['handoff-defaults', 'tuned']) {
  test(`2,000 seeded bot games are reproducible for the ${preset} preset`, t => {
    const result = simulate(preset);
    assert.equal(result.games, 2000);
    assert.equal(result.escaped + result.captured + result.other, 2000);
    assert.equal(result.other, 0, 'all simulated games should reach a defined terminal result');
    t.diagnostic(
      `Proposal simulation [${preset}]: ${result.escaped}/${result.games} Assailant escapes (${result.winRate}%); ${result.captured} captured; mean ${result.meanRounds} rounds.`,
    );
  });
}
