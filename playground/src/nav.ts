export const nav = [
  {
    id: 'overview',
    label: 'Overview',
    number: '00',
    hint: 'How the SDK fits together',
  },
  {
    id: 'api',
    label: 'API',
    number: '01',
    hint: 'HTTP client · domain functions',
  },
  {
    id: 'style',
    label: 'Style guide',
    number: '02',
    hint: 'Tokens · components',
  },
  {
    id: 'logic',
    label: 'Special logic',
    number: '03',
    hint: 'Helpers · adapters',
  },
] as const;

export type PillarId = (typeof nav)[number]['id'];

export function resolvePillar(hash: string): PillarId {
  const raw = hash.replace(/^#/, '').split('/')[0] as PillarId;
  return nav.some((item) => item.id === raw) ? raw : 'overview';
}
