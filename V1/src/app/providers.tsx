import type { ReactNode } from 'react'

// MAIN lane: the hard-case 3D film was removed (archived to
// archive/hardcase/), and '/' now renders the red-velvet V1 App, which owns
// its own Lenis singleton (src/v1/lenis.ts, started by FilmSequence). The old
// conductor Lenis (src/motion/lenis.ts) must NOT initialise here — two Lenis
// instances hijacking wheel input breaks scrolling. This provider therefore
// stays as a passive pass-through so the non-film routes keep mounting
// unchanged. src/motion/* + src/store/* are unreferenced (kept for the
// orchestrator to reassign or archive as follow-up).
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}
