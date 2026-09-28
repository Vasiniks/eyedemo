// EyeQ Vision Care — ONE master timeline, the conductor (Lane B, step 3).
// `gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:{ trigger:'#film-pin',
// start:'top top', end:'+=800vh' desk / '+=560vh' mob (/640vh tablet),
// scrub:1.0, pin:true, anticipatePin:1, invalidateOnRefresh:true }})`
// + addLabel() per §6 beat. Scrubbed shell: ease stays 'none' (scroll IS
// timing); arrival curves are baked into the sampled values (chapters.ts),
// never into tween eases. onUpdate writes filmProgress — the sole 3D input.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BEATS, darkVhForWidth, type BeatId } from './chapters'
import { setFilmProgress } from './progress'

gsap.registerPlugin(ScrollTrigger)

export const FILM_PIN_SELECTOR = '#film-pin'

export interface FilmTimelineHandle {
  timeline: gsap.core.Timeline | null
  trigger: ScrollTrigger | null
  reducedMotion: boolean
  destroy: () => void
}

/** Labels frozen by §6 (shared contract — coordinator-only changes). */
export function beatLabelTimes(): Array<{ label: BeatId; at: number }> {
  return BEATS.map((b) => ({ label: b.id, at: b.start }))
}

export function createFilmTimeline(
  pinEl: HTMLElement,
  opts: { reducedMotion: boolean; onProgress?: (p: number) => void } = { reducedMotion: false },
): FilmTimelineHandle {
  if (opts.reducedMotion) {
    // RM branch: no Lenis, no scrub smoothing, no pin flights (§10).
    // Chapters render as static DOM (Lane E); 3D snaps via rig.smooth=target.
    return { timeline: null, trigger: null, reducedMotion: true, destroy: () => undefined }
  }

  const proxy = { v: 0 }
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: pinEl,
      start: 'top top',
      end: () => `+=${(darkVhForWidth(window.innerWidth) / 100) * window.innerHeight}`,
      scrub: 1.0,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setFilmProgress(self.progress)
        opts.onProgress?.(self.progress)
      },
    },
  })

  tl.to(proxy, { v: 1, duration: 1, ease: 'none' }, 0)
  for (const b of BEATS) tl.addLabel(b.id, b.start)
  tl.addLabel('W', 1)

  const st = tl.scrollTrigger as ScrollTrigger | undefined
  return {
    timeline: tl,
    trigger: st ?? null,
    reducedMotion: false,
    destroy: () => {
      st?.kill()
      tl.kill()
    },
  }
}
