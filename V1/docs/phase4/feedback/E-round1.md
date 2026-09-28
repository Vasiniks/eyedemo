# Orchestrator review — Lane E, round 1 (from qa/E/white-act-1440.png, rails-t6-1440.png)

P0
1. **Film rails read as a cheap grey-tile marquee.** Light logos sit on flat mid-grey (#777) tiles on Paper — low contrast, template look. Redesign as real dark FILM STOCK: each rail is a continuous Void/Graphite-800 strip (~120 px desktop), sprocket perforations punched in Paper colour along both edges, light logos placed DIRECTLY on the dark base (no inner tile), frame numbers as 10–11 px micro-caps in Bone-dim / Lamp-amber at 60%, faint frame dividers (1 px hairline Steel-edge at 30%), subtle film grain/noise ≤3% opacity. Mask top/bottom edges with a gradient into Paper (≥120 px). Keep 72 / 44 px/s opposite directions.
2. **Header over Paper is a muddy translucent grey bar.** Over the white act it must switch to Paper background (or transparent with backdrop blur) + Ink logo (use `eyeq-logo-header-original.png`) + Ink text; over the dark film it stays dark with the white logo. Progress hairline stays Lamp-amber.
3. **"SKIP FILM ↓" floats over the content** at the bottom centre of the white act (overlaps the hours ledger). Hide/fade it once the film is over (progress ≥ white-act start), and never let it overlap content.

P1
4. Canada Life light logo was broken (solid square, "life" missing) — orchestrator regenerated `public/web/insurance-light/canada-life-min.png` and patched `atlas-insurers.png/json`. Re-check it renders with the "life" knockout.
5. Rails placement: in the white act they must hug the LEFT and RIGHT page edges (brief §4Q) with the centre content readable between them — the `rails-t6` capture shows them side-by-side in the centre; verify the real layout.
6. Top of the white act: the small EyeQ logo above the H1 is cramped (≈12 px gap) — give it ≥32 px or remove it (header already carries the logo).

P0 (client rule, brief §6d)
7. Header/menu/footer may contain ONLY: Home · Services · Contact, the Book-an-exam CTA, and footer Refund/Privacy/Terms + copyright. Remove any "Frames", "Browse frames", "Catalog", "Shop", "Search", "Account", "Cart", social links. Audit every string in src/data/*.json and components against docs/research/B-content-inventory.md — anything not on the live site (other than new-store info and DRAFT film lines) must be deleted.
