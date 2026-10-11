/** Proposal: deterministic injectable RNG for Violet's Revenge review prototype. */
export function createRng(seed = 1) {
  let state = (Number(seed) >>> 0) || 1;
  return {
    next() { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 0x100000000; },
    d6() { return 1 + Math.floor(this.next() * 6); },
    int(max) { if (!Number.isInteger(max) || max < 1) throw new RangeError('max must be a positive integer'); return Math.floor(this.next() * max); },
    getState() { return state; }
  };
}
export function fixedRolls(values, fallback = 1) {
  const queue = [...values];
  return { d6() { return queue.length ? queue.shift() : fallback; }, int(max) { return Math.min(max - 1, this.d6() - 1); }, remaining() { return queue.length; } };
}
