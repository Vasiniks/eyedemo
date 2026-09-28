// Lane E — typed accessors over B-verbatim JSON (PLAN-MASTER §12).
// Every string is verbatim from docs/research/B-content-inventory.md or
// docs/00-BRIEF.md §2, except entries flagged { draft: true } which come from
// docs/phase4/COPY-DRAFTS.md and MUST keep their DRAFT marker in render.
import storeJson from './store.json';
import brandsJson from './brands.json';
import insurersJson from './insurers.json';
import lensesJson from './lenses.json';
import servicesJson from './services.json';
import reviewsJson from './reviews.json';
import chaptersJson from './chapters.json';

export interface StoreInfo {
  businessName: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  address: { line1: string; line2: string; full: string };
  hours: Array<{ days: string; time: string }>;
  hoursInline: string;
  booking: { labelHomepage: string; labelServices: string; url: string; note: string };
  directionsUrl: string;
  mapEmbedUrl: string;
  mapTitle: string;
}

export interface LogoEntry {
  name: string;
  file: string;
  alt: string;
  hero?: boolean;
}

export interface DraftLine {
  text: string;
  draft: boolean;
  ref?: string;
  verbatim?: boolean;
  verbatimAlternative?: string;
}

export interface Beat {
  id: string;
  range: [number, number];
  eyebrow?: DraftLine | null;
  display?: DraftLine | null;
  microLabel?: DraftLine | null;
  heading?: DraftLine | null;
  sub?: DraftLine | null;
  lensList?: boolean;
  brandList?: 'brands' | 'insurers' | null;
}

// Brief §6d (highest priority): DRAFT film lines stay in data with
// `draft: true` but are NOT rendered unless this single build flag is set.
// Default false → the film shows only real site content. Set with
// `VITE_SHOW_DRAFT_COPY=true` at build time for client-approval previews.
export const SHOW_DRAFT_COPY: boolean =
  import.meta.env.VITE_SHOW_DRAFT_COPY === 'true';

export const store: StoreInfo = storeJson as StoreInfo;

export const brandHeading: string = brandsJson.heading as string;
export const brands: LogoEntry[] = brandsJson.brands as LogoEntry[];

export const insurerHeading: string = insurersJson.heading as string;
export const insurerAriaLabel: string = insurersJson.ariaLabel as string;
export const insurers: LogoEntry[] = insurersJson.insurers as LogoEntry[];

export interface Lens {
  name: string;
  description: string | null;
  short?: string;
}

export const lensHeading: string = lensesJson.heading as string;
export const lenses: Lens[] = lensesJson.lenses as Lens[];

export interface ServicePrecis {
  name: string;
  description: string | null;
}

export const servicesHeading: string = servicesJson.heading as string;
export const servicesIntro: string[] = servicesJson.intro as string[];
export const servicesPrecis: ServicePrecis[] = servicesJson.precis as ServicePrecis[];

export interface Review {
  initials: string;
  text: string;
}

export const reviewsHeading: string = reviewsJson.heading as string;
export const reviewsSub: string = reviewsJson.subheading as string;
export const reviewsAggregate: string = reviewsJson.aggregate as string;
export const reviewsAggregateSuffix: string = reviewsJson.aggregateSuffix as string;
export const reviews: Review[] = reviewsJson.reviews as Review[];

export const beats: Beat[] = chaptersJson.beats as Beat[];
export const aboutBrampton: DraftLine = chaptersJson.aboutBrampton as DraftLine;
export const videoDescription: DraftLine = chaptersJson.videoDescription as DraftLine;
export const videoMeta = chaptersJson.video as {
  heading: string;
  playLabel: string;
  src: string;
  paragraphs: string[];
};
