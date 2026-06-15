import { Circle, PlayCircle, CheckCircle2 } from 'lucide-react';

export const COLORS = {
  bg: '#FBF7F0',
  card: '#F5EDE0',
  border: '#E2D5C3',
  ink: '#1C1A17',
  inkSoft: '#6B6258',
  gold: '#B8935A',
  red: '#C9472B',
  green: '#8A9B7E',
  sidebar: '#1C1A17',
  sidebarBorder: '#2E2A24',
  sidebarMuted: '#A39A8C',
};

export const STATUS_META = {
  'standing-by': { label: 'Standing by', color: '#6B6258', icon: Circle },
  'in-progress': { label: 'In progress', color: '#B8935A', icon: PlayCircle },
  done: { label: 'Done', color: '#8A9B7E', icon: CheckCircle2 },
};

export const STATUS_OPTIONS = ['standing-by', 'in-progress', 'done'];
