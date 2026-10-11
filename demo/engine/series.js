import episodesData from '../data/episodes.json' with { type: 'json' };

export const REVEAL_LEVEL = 0;
export function filterEpisodes(episodes=episodesData.episodes, revealLevel=REVEAL_LEVEL) {
  return structuredClone(episodes.filter(entry=>Number.isInteger(entry.spoiler_level)&&entry.spoiler_level<=revealLevel));
}
export function publicEpisodeBundle(revealLevel=REVEAL_LEVEL) {
  return {status:'Proposal',revealLevel,episodes:filterEpisodes(episodesData.episodes,revealLevel)};
}
