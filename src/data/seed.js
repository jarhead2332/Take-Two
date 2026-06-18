// First-run seed data. Once a localStorage key exists, that is the source of truth.

export const SEED_EPISODES = [
  {
    num: 1, title: 'The Vision', focus: 'Origin story — how an idea became a vision',
    status: 'standing-by', order: 4, colorHex: '#e63946', notes: '',
    subjects: [
      { name: 'Marcia', done: false },
      { name: 'Mama Rhoads', done: false },
      { name: 'James', done: false },
    ],
  },
  {
    num: 2, title: 'Building the World', focus: 'Set construction — foam, paint, design',
    status: 'in-progress', order: 1, colorHex: '#7c3aed', notes: '',
    subjects: [
      { name: 'Jay', done: false },
      { name: 'Phil', done: false },
    ],
  },
  {
    num: 3, title: 'Making It Move', focus: 'Choreography for 27 acts, one practice a week',
    status: 'standing-by', order: 2, colorHex: '#2563eb', notes: '',
    subjects: [
      { name: 'Joe', done: false },
      { name: 'Justina', done: false },
    ],
  },
  {
    num: 4, title: 'Making It Real', focus: 'Costumes (65 total) and advertising',
    status: 'standing-by', order: 4, colorHex: '#d97706', notes: '',
    subjects: [
      { name: 'Marcia', done: false },
      { name: 'Andrea', done: false },
      { name: 'Susie Dean', done: false },
    ],
  },
  {
    num: 5, title: 'Behind the Booth', focus: 'AV — six months of live troubleshooting',
    status: 'standing-by', order: 3, colorHex: '#0d9488', notes: '',
    subjects: [
      { name: 'Phil', done: false },
      { name: 'Connor', done: false },
      { name: 'Mama Rhoads', done: false },
    ],
  },
  {
    num: 6, title: 'Show Week', focus: 'Culmination — reflective interviews with everyone',
    status: 'standing-by', order: 4, colorHex: '#16a34a', notes: '',
    subjects: [{ name: 'All 10 people', done: false }],
  },
];

export const SEED_FOOTAGE = [
  { id: 1, label: 'Set build time-lapse', episode: 2, category: 'Set construction', status: 'captured' },
  { id: 2, label: 'Set construction photos', episode: 2, category: 'Set construction', status: 'captured' },
  { id: 3, label: 'Choreography rehearsal footage', episode: 3, category: 'Choreography', status: 'captured' },
  { id: 4, label: 'Costume B-roll', episode: 4, category: 'Costumes', status: 'captured' },
  { id: 5, label: 'AV booth in action — Phil at ProPresenter, Connor on audio board', episode: 5, category: 'AV / Booth', status: 'needed' },
  { id: 6, label: 'Backstage moments from Sunday June 15 rehearsal', episode: 1, category: 'Other', status: 'captured' },
  { id: 7, label: 'Set building footage from Sunday June 15', episode: 2, category: 'Set construction', status: 'captured' },
  { id: 8, label: 'Show week time-lapse — set build days Jun 22 and Jun 24', episode: 2, category: 'Set construction', status: 'needed' },
  { id: 9, label: 'Mama Rhoads running a cue-through', episode: 5, category: 'AV / Booth', status: 'needed' },
  { id: 10, label: 'Full show recording on church cameras — Final Rehearsal Jun 23', episode: 6, category: 'Other', status: 'needed' },
  { id: 11, label: 'Pre-show energy on live show nights — full costume and hair/makeup', episode: 6, category: 'Other', status: 'needed' },
];

export const SEED_QUESTIONS = [
  { id: 1, text: 'Reach out to Nick about the narrator role — he needs to know before recording in September', done: false },
  { id: 2, text: 'Narrator script — written after all interviews wrap, then recorded with Nick in September', done: false },
  { id: 3, text: 'YouTube thumbnails — handling independently in Canva after episodes are cut', done: false },
  { id: 4, text: 'Release pacing — one episode per day or spread over several weeks? Decide once editing is underway', done: false },
];

// Gantt timeline. episode → bar takes that episode's color; otherwise colorHex; else grey.
export const SEED_SCHEDULE = [
  { id: 1, section: 'Show & Filming', label: 'Show nights', start: '2026-06-25', end: '2026-06-27', colorHex: '#e63946' },
  { id: 2, section: 'Show & Filming', label: 'B-roll filming', start: '2026-06-25', end: '2026-06-27', colorHex: '#6b7280' },

  { id: 3, section: 'Interviews', label: 'Jay + Phil', start: '2026-07-07', end: '2026-07-07', episode: 2, done: false },
  { id: 4, section: 'Interviews', label: 'Phil + Connor', start: '2026-07-08', end: '2026-07-08', episode: 5, done: false },
  { id: 5, section: 'Interviews', label: 'Joe + Justina', start: '2026-07-14', end: '2026-07-14', episode: 3, done: false },
  { id: 6, section: 'Interviews', label: 'Mama Rhoads', start: '2026-07-21', end: '2026-07-21', episode: 1, done: false },
  { id: 7, section: 'Interviews', label: 'James', start: '2026-07-21', end: '2026-07-21', episode: 1, done: false },
  { id: 8, section: 'Interviews', label: 'Marcia + team', start: '2026-07-28', end: '2026-07-28', episode: 4, done: false },

  { id: 9, section: 'Editing', label: 'Ep 2 rough cut', start: '2026-07-08', end: '2026-07-14', episode: 2 },
  { id: 10, section: 'Editing', label: 'Ep 3 rough cut', start: '2026-07-14', end: '2026-07-21', episode: 3 },
  { id: 11, section: 'Editing', label: 'Ep 5 rough cut', start: '2026-07-21', end: '2026-07-28', episode: 5 },
  { id: 12, section: 'Editing', label: 'Eps 1, 4, 6', start: '2026-07-28', end: '2026-08-31', episode: 6 },
  { id: 13, section: 'Editing', label: 'Polish & audio', start: '2026-08-01', end: '2026-09-30', colorHex: '#6b7280' },

  { id: 14, section: 'Release', label: 'Episodes', start: '2026-09-01', end: '2026-10-31', episode: 1 },
];

export const SCHEDULE_SECTIONS = ['Show & Filming', 'Interviews', 'Editing', 'Release'];

export const nextId = (items) => items.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
