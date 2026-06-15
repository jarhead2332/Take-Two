// Seed data — used only on first run, when a localStorage key doesn't exist yet.
// After that, the live data in localStorage is the source of truth.

export const SEED_EPISODES = [
  {
    num: 1,
    title: 'The Vision',
    focus: 'Origin story — how an idea became a vision',
    status: 'standing-by',
    order: 4,
    notes: '',
    subjects: [
      { name: 'Marcia', done: false },
      { name: 'Mama Rhoads', done: false },
      { name: 'James', done: false },
    ],
  },
  {
    num: 2,
    title: 'Building the World',
    focus: 'Set construction — foam, paint, design',
    status: 'in-progress',
    order: 1,
    notes: '',
    subjects: [
      { name: 'Jay', done: false },
      { name: 'Phil', done: false },
    ],
  },
  {
    num: 3,
    title: 'Making It Move',
    focus: 'Choreography for 27 acts, one practice a week',
    status: 'standing-by',
    order: 2,
    notes: '',
    subjects: [
      { name: 'Joe', done: false },
      { name: 'Justina', done: false },
    ],
  },
  {
    num: 4,
    title: 'Making It Real',
    focus: 'Costumes (65 total) and advertising',
    status: 'standing-by',
    order: 4,
    notes: '',
    subjects: [
      { name: 'Marcia', done: false },
      { name: 'Andrea', done: false },
      { name: 'Susie Dean', done: false },
    ],
  },
  {
    num: 5,
    title: 'Behind the Booth',
    focus: 'AV — six months of live troubleshooting',
    status: 'standing-by',
    order: 3,
    notes: '',
    subjects: [
      { name: 'Phil', done: false },
      { name: 'Connor', done: false },
      { name: 'Mama Rhoads', done: false },
    ],
  },
  {
    num: 6,
    title: 'Show Week',
    focus: 'Culmination — reflective interviews with everyone',
    status: 'standing-by',
    order: 4,
    notes: '',
    subjects: [{ name: 'All 10 people', done: false }],
  },
];

export const SEED_FOOTAGE = [
  { id: 1, label: 'Set build time-lapse', episode: 2, category: 'Set construction', status: 'captured' },
  { id: 2, label: 'Set construction photos', episode: 2, category: 'Set construction', status: 'captured' },
  { id: 3, label: 'Choreography rehearsal footage', episode: 3, category: 'Choreography', status: 'captured' },
  { id: 4, label: 'Costume B-roll', episode: 4, category: 'Costumes', status: 'captured' },
  { id: 5, label: 'AV booth in action', episode: 5, category: 'AV / Booth', status: 'needed' },
  { id: 6, label: 'Costume check day', episode: 4, category: 'Costumes', status: 'needed' },
];

export const SEED_SCHEDULE = [
  { id: 1, week: 'Jul 6–7', day: 'mon', people: 'Jay + Phil', tag: 'Sets', episode: 2, done: false },
  { id: 2, week: 'Jul 6–7', day: 'tue', people: 'Phil + Connor', tag: 'AV', episode: 5, done: false },
  { id: 3, week: 'Jul 13–14', day: 'mon', people: 'Joe + Justina', tag: 'Choreography', episode: 3, done: false },
  { id: 4, week: 'Jul 20–21', day: 'mon', people: 'Mama Rhoads', tag: 'Solo', episode: 1, done: false },
  { id: 5, week: 'Jul 20–21', day: 'tue', people: 'James', tag: 'Solo', episode: 1, done: false },
  { id: 6, week: 'Jul 27–28', day: 'mon', people: 'Marcia + Andrea + Susie Dean', tag: 'Costumes / Advertising', episode: 4, done: false },
  { id: 7, week: 'Jul 27–28', day: 'tue', people: 'Buffer day', tag: '', episode: null, done: false },
];

export const SEED_TEAM = [
  { name: 'Mama Rhoads', roles: ['Director'], episodes: [1, 5, 6] },
  { name: 'Marcia', roles: ['Costumes lead', 'Advertising'], episodes: [1, 4, 6] },
  { name: 'Andrea', roles: ['Costumes support', 'Advertising'], episodes: [4, 6] },
  { name: 'Susie Dean', roles: ['Costumes — sewing & crafting'], episodes: [4, 6] },
  { name: 'Jay', roles: ['Sets — vision/design'], episodes: [2, 6] },
  { name: 'Phil', roles: ['Sets — execution', 'AV (ProPresenter)'], episodes: [2, 5, 6] },
  { name: 'Joe', roles: ['Choreography lead'], episodes: [3, 6] },
  { name: 'Justina', roles: ['Choreography support'], episodes: [3, 6] },
  { name: 'James', roles: ['Composer'], episodes: [1, 6] },
  { name: 'Connor', roles: ['AV — audio mixing'], episodes: [5, 6] },
];

export const SEED_QUESTIONS = [
  { id: 1, text: 'Narrator: Jordan vs. Nick', done: false },
  { id: 2, text: 'Ask Mama Rhoads about her hardest moment / decision (Ep 1)', done: false },
  { id: 3, text: 'Confirm usage rights for professionally-recorded show footage (Ep 6)', done: false },
  { id: 4, text: 'YouTube thumbnails — Canva, handled independently', done: false },
];

export const FOOTAGE_CATEGORIES = [
  'Set construction',
  'Choreography',
  'Costumes',
  'AV / Booth',
  'Advertising',
  'Other',
];
