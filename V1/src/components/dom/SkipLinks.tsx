import { useEffect } from 'react';

// Lane E — skip links (PLAN-MASTER §10). First tab stops: content, then film.
// `S` is a shortcut for "skip film" (Lane B also honours it on the canvas).
export function SkipLinks({ filmHref = '#film-pin', contentHref = '#content' }: {
  filmHref?: string;
  contentHref?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
      if (e.key === 's' || e.key === 'S') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const el = document.querySelector(filmHref.startsWith('#') ? filmHref : '#film-pin');
        // `S` skips FORWARD past the film to the white act.
        const white = document.querySelector('#white-act');
        if (white) {
          e.preventDefault();
          (white as HTMLElement).scrollIntoView({ behavior: 'auto' });
          (white as HTMLElement).focus({ preventScroll: true });
        } else if (el) {
          e.preventDefault();
          (el as HTMLElement).scrollIntoView({ behavior: 'auto' });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filmHref]);

  return (
    <>
      <a className="eyeq-skip" href={contentHref}>
        Skip to content
      </a>
      <a className="eyeq-skip" href="#white-act" style={{ left: 180 }}>
        Skip film
      </a>
    </>
  );
}
