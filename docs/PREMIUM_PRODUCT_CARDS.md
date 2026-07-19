# Premium Product Cards — Design System

## Audit: why old cards don't sell

The current marketplace-style cards (grey gradient, yellow feature headlines, dimension arrows, bullet lists) fail because they:

1. **Sell specs, not desire** — "УСИЛЕННЫЙ КАРКАС" describes metal, not the buyer's result.
2. **Look like classified ads** — grey background + arrows = low trust, low price perception.
3. **Overload with text** — the eye has no focal point; nothing stops the scroll.
4. **No human context** — buyer can't imagine themselves training.
5. **Weak hierarchy** — headline, bullets, and dimensions compete at the same visual weight.
6. **No brand emotion** — interchangeable with any Ozon/WB listing.

## New concept: "Result-first premium fitness"

We sell strength, back width, home training freedom — not a pull-up bar.

### Visual language

| Token | Value | Usage |
|------|-------|-------|
| Background | `#0A0A0B` | Premium dark base |
| Graphite | `#191C1D` | Secondary surfaces |
| White | `#FFFFFF` | Headlines |
| Muted | `#8B8F8C` | Supporting copy |
| Accent | `#D9FF00` | CTA, highlights, stats |
| Font | Manrope 700–800 | Display typography |

### Slide system (5 slides)

1. **Emotional Hook** — desire headline + athlete + visible product
2. **Product Benefit** — 3 exercises, not 3 bullet points
3. **Trust / Safety** — load, warranty, steel, origin — readable stats
4. **Lifestyle** — home training scene, time benefit
5. **Conversion** — hero product + "Начни сегодня"

### Rules

- Product always visible and unobstructed
- One message per slide
- Large type, lots of air
- No dimension arrows on emotional slides
- Athletes: athletic but realistic silhouettes / photography
- Accent color used sparingly for conversion points

## Output

Generated assets live in:

`public/products/premium-cards/<product-slug>/`

Run generator:

```bash
npm run cards:premium
```

The product is rendered from AI photo scenes + HTML typography composite (not photo cutouts or flat SVG).

1. Scene photos live in `scripts/generate-premium-cards/scenes/`
2. Typography/layout lives in `scripts/generate-premium-cards/templates/`
3. Run `npm run cards:premium` to rebuild all 5 slides

To regenerate scenes only, replace PNG files in `scenes/` folder and rerun the generator.
