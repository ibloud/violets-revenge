/** Proposal: append-only, serializable event log. */
export function appendEvent(state, type, details = {}) {
  const event = {
    seq: state.events.length + 1,
    round: state.round,
    turn: state.activeSide,
    type,
    ...structuredClone(details),
  };

  state.events.push(event);
  return event;
}

export function reject(state, action, reason) {
  appendEvent(state, 'action_rejected', { action, reason });
  return { ok: false, reason, state };
}
