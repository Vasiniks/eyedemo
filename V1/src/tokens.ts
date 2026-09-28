// EyeQ Vision Care — design tokens as TS export (mirrors styles/tokens.css).
// PLAN-MASTER §2 values are frozen; coordinator-only changes.

export const tokens = {
  void: '#050607',
  stage: '#0A0C0E',
  graphite800: '#121519',
  graphite700: '#1B2027',
  graphite600: '#262D36',
  steelEdge: '#4B5563',
  mutedOnDark: '#8F97A3',
  velvetShadow: '#22060A',
  oxblood: '#4B0F16',
  oxbloodLift: '#641420',
  sheen: '#8E2E38',
  bone: '#E9E2D3',
  boneDim: '#C5BCA6',
  paper: '#F5F1E8',
  cardWhite: '#FFFFFF',
  ink: '#131417',
  inkBody: '#2A2B2E',
  inkMuted: '#5E5B54',
  lampAmber: '#D9A441',
  hairlineDark: 'rgba(233,226,211,0.14)',
  hairlineDarkStrong: 'rgba(233,226,211,0.24)',
  hairlineLight: 'rgba(19,20,23,0.14)',
  hairlineLightStrong: 'rgba(19,20,23,0.22)',
  fontDisplay: '"Fraunces", "Georgia", serif',
  fontUi: '"Inter", "Helvetica Neue", "Arial", sans-serif',
} as const

export type TokenName = keyof typeof tokens
