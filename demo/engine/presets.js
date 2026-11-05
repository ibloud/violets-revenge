/**
 * Proposal rule presets for reproducible Violet's Revenge bot simulations.
 * These settings are test fixtures, not canon or a claim of human-tested balance.
 */
export const RULE_PRESETS = Object.freeze({
  "handoff-defaults": Object.freeze({
    id: "handoff-defaults",
    label: "Handoff Defaults",
    strikesToCapture: 3,
    catchTarget: 4,
    searchTarget: 4,
    status: "Proposal",
  }),
  tuned: Object.freeze({
    id: "tuned",
    label: "Tuned",
    strikesToCapture: 2,
    catchTarget: 2,
    searchTarget: 5,
    status: "Proposal",
  }),
});

export function resolveRulePreset(preset = "tuned") {
  const settings = RULE_PRESETS[preset];
  if (!settings) {
    throw new RangeError(
      `Unknown rule preset "${preset}". Choose: ${Object.keys(RULE_PRESETS).join(", ")}.`,
    );
  }
  return { ...settings };
}
