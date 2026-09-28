// Lane F — shared verbatim content constants for secondary routes.
// SOURCES (authority order):
// - New-store facts: docs/00-BRIEF.md §2 (phone, email, address, hours).
// - All other copy: docs/research/B-content-inventory.md (B §§2–5,7–9,11).
// - Link destinations: docs/research/C-link-inventory.md.
// - DRAFT lines: docs/phase4/COPY-DRAFTS.md (marked DRAFT wherever used).
//
// TODO(Lane E data swap): once src/data/*.json land (services, lenses,
// insurers, brands, reviews), re-point these imports at those files.
// Until then this module is the single source for Lane F routes —
// every string below is byte-verbatim from B or brief §2 unless marked.

export const BOOKING_URL =
  'http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1'
// NOTE: http (not https) is verbatim from the live site (C Key finding 1).
// Do not "fix". [CLIENT CONFIRM: Brampton location code? — COPY-DRAFTS (e).]

export const STORE = {
  phoneDisplay: '905-497-0227',
  phoneHref: 'tel:+19054970227',
  email: 'eyeshine2020@gmail.com',
  emailHref: 'mailto:eyeshine2020@gmail.com',
  address: '2-227 Vodden St East, Brampton, ON',
  hours: [
    { days: 'Mon–Fri', time: '11:00 am–6:30 pm' },
    { days: 'Sat', time: '11:00 am–5:00 pm' },
    { days: 'Sun', time: '11:00 am–4:00 pm' },
  ] as const,
} as const

export const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON'
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=2-227+Vodden+St+East%2C+Brampton%2C+ON&t=m&z=15&output=embed&iwloc=near'
export const MAP_IFRAME_TITLE = 'Map — EyeQ Vision Care, 2-227 Vodden St East, Brampton'

// ---- Services page (B §3, verbatim) ------------------------------------

export const SERVICES_H1 = 'Services'

export const SERVICES_INTRO: readonly string[] = [
  "Looking for a trusted optometrist in Burlington? At Eye Q Optical, we're committed to helping you achieve clear, healthy vision through comprehensive eye care. Our services include comprehensive eye exams, children's eye exams, and contact lens fittings tailored to your individual needs.",
  'We also offer a carefully curated collection of premium eyewear from leading designer brands, including Gucci, Prada, and Ray-Ban, making it easy to find frames that match your style while providing exceptional vision.',
  'Whether you need a routine eye exam, an updated prescription, or your next pair of prescription glasses or sunglasses, our experienced team is here to help. Book your eye exam with Eye Q Optical today and visit our Burlington store to discover quality eye care and eyewear for every lifestyle.',
]

export const SERVICE_BLOCKS = [
  {
    heading: 'Accurate Prescription Fittings',
    text: 'Accurate prescription fitting to ensure clear, comfortable vision tailored to your needs.',
  },
  {
    heading: 'Comprehensive Eye Exams',
    text: 'A complete assessment of your vision and eye health, including prescription testing and screening for common eye conditions.',
    cta: 'Book your Eye Exam today',
  },
] as const

// ---- Lenses (B §4, verbatim; ®/™ intact) --------------------------------

export const LENSES_HEADING = 'Our Popular High-Definition Lenses'

export const LENS_NAMES_4: readonly string[] = [
  'Varilux® Physio Extensee™',
  'Distinctive® Superior',
  'Distinctive® Enhanced',
  'Distinctive® SV Lenses',
]

export interface LensSlide {
  name: string
  description: string
}

export const LENS_SLIDES: readonly LensSlide[] = [
  {
    name: 'Essilor Stellest® 2.0 Lenses',
    description:
      'Innovative myopia-management lenses designed to help slow the progression of myopia in children while providing clear, comfortable vision.',
  },
  {
    name: 'Transitions® Lenses',
    description:
      'Experience comfortable vision in changing light with Transitions® lenses. These light-adaptive lenses automatically adjust their tint based on the surrounding light, providing clear vision indoors and helping reduce glare and brightness outdoors. They offer convenient, everyday protection without the need to switch between regular glasses and sunglasses.',
  },
  {
    name: 'Xperio® Lenses',
    description:
      'Xperio® polarized lenses are designed to provide clear, comfortable vision outdoors while reducing glare from reflective surfaces. They offer excellent visual clarity and UV protection, making them ideal for driving, outdoor activities, and everyday use in bright conditions.',
  },
]

// ---- Insurance (B §5, verbatim heading + display order) ------------------
// Logos: single-colour light knockouts in public/web/insurance-light/
// (brief §6c.2). Unlinked everywhere (C §6).

export const INSURANCE_HEADING = 'We Accept Most Major Insurance Plans'

export interface Insurer {
  name: string
  logo: string
}

export const INSURERS: readonly Insurer[] = [
  { name: 'Sun Life', logo: '/web/insurance-light/sun-life.png' },
  { name: 'Medavie Blue Cross', logo: '/web/insurance-light/mbc-logo-en.png' },
  { name: 'Manulife', logo: '/web/insurance-light/manulife.png' },
  { name: 'GreenShield', logo: '/web/insurance-light/greenshield.png' },
  { name: 'Canada Life', logo: '/web/insurance-light/canada-life-min.png' },
  { name: 'Desjardins', logo: '/web/insurance-light/desjardins.png' },
  { name: 'IA Financial Group', logo: '/web/insurance-light/ia-financial-group.png' },
  { name: 'Empire Life', logo: '/web/insurance-light/empire-life.png' },
]

// ---- Contact labels (B §8 structure, brief §2 values) --------------------

export const CONTACT_LABELS = {
  phone: 'PHONE',
  email: 'EMAIL',
  address: 'ADDRESS',
  hours: 'HOURS',
} as const
