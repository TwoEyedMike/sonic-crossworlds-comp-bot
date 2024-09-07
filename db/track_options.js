module.exports.trackOptions = [
  {
    key: 'random',
    name: 'Full RNG Tracks',
    description: 'Generates tracks completely at random.',
    emote: null,
    default: false,
    rankedEnabled: true,
    hasDefinitionFile: true,
  },
  {
    key: 'pools',
    name: 'Track Pools',
    description: 'Generates tracks from balanced track pools.',
    emote: null,
    default: true,
    rankedEnabled: true,
    hasDefinitionFile: true,
  },
  {
    key: 'draft',
    name: 'Track Drafting',
    description: 'Initializes a draft as soon as the lobby starts.',
    emote: null,
    default: false,
    rankedEnabled: true,
    hasDefinitionFile: false,
  },
];
