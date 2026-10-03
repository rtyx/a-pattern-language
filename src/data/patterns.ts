import { PATTERN_NAMES } from './names';
import { LINKS } from './links';

export type Scale = 'towns' | 'buildings' | 'construction';

export interface Pattern {
  id: number;
  name: string;
  scale: Scale;
}

export interface Link {
  from: number;
  to: number;
}

export const SCALE_LABELS: Record<Scale, string> = {
  towns: 'Towns',
  buildings: 'Buildings',
  construction: 'Construction',
};

export const SCALE_COLORS: Record<Scale, string> = {
  towns: '#d9822b',
  buildings: '#3b82a0',
  construction: '#6a994e',
};

function scaleOf(id: number): Scale {
  if (id <= 94) return 'towns';
  if (id <= 204) return 'buildings';
  return 'construction';
}

export const PATTERNS: Pattern[] = PATTERN_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  scale: scaleOf(i + 1),
}));

export const PATTERN_LINKS: Link[] = LINKS.map(([from, to]) => ({ from, to }));
