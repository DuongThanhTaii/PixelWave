---
name: Pixelwave
colors:
  surface: '#fff8f9'
  surface-dim: '#ffcbeb'
  surface-bright: '#fff8f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f6'
  surface-container: '#ffe8f4'
  surface-container-high: '#ffe0f1'
  surface-container-highest: '#ffd7ef'
  on-surface: '#3a0130'
  on-surface-variant: '#574146'
  inverse-surface: '#541847'
  inverse-on-surface: '#ffecf5'
  outline: '#8a7176'
  outline-variant: '#ddbfc5'
  surface-tint: '#ac2a5d'
  primary: '#ac2a5d'
  on-primary: '#ffffff'
  primary-container: '#ff6b9d'
  on-primary-container: '#6e0035'
  inverse-primary: '#ffb1c5'
  secondary: '#006970'
  on-secondary: '#ffffff'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#506600'
  on-tertiary: '#ffffff'
  tertiary-container: '#88ab00'
  on-tertiary-container: '#2d3b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c5'
  on-primary-fixed: '#3f001b'
  on-primary-fixed-variant: '#8c0a46'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#c3f400'
  tertiary-fixed-dim: '#abd600'
  on-tertiary-fixed: '#161e00'
  on-tertiary-fixed-variant: '#3c4d00'
  background: '#fff8f9'
  on-background: '#3a0130'
  surface-variant: '#ffd7ef'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-display:
    fontFamily: Courier Prime
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system embodies a "Pastel Futurism" aesthetic, merging the optimistic, digital-first energy of the Y2K era with the high-end precision of modern editorial interfaces. It targets a digitally native audience that values both expressive personality and functional clarity.

The visual language is defined by **Neo-Brutalist structuralism** (heavy borders, offset shadows) layered with **Glassmorphic softness** (frosted surfaces, chrome gradients). This creates a "Tactile Digital" experience—where elements feel like physical objects existing within a high-fidelity virtual space. The emotional response should be one of vibrant energy, nostalgic technological wonder, and premium reliability.

## Colors
This system utilizes a high-contrast palette balanced by soft background tones. 

- **Primary (Hot Pink):** Reserved for high-priority calls to action and critical interactions.
- **Secondary (Cyan Glow):** Used for interactive highlights, focus states, and digital "energy" accents.
- **Tertiary (Neon Lime):** Communicates success, growth, and earned achievements.
- **Base (Deep Purple):** The primary color for text and structural borders to maintain readability without the harshness of pure black.
- **Surface (Off-white):** A clean, slightly cool background that allows gradients and blurs to pop.
- **Chrome Gradient:** Applied to large headers, hero sections, and glassmorphic container backgrounds to evoke a liquid-metal Y2K feel.

## Typography
The typographic hierarchy creates a tension between geometric modernism and lo-fi nostalgia.

- **Headlines:** Space Grotesk provides a technical, geometric foundation. Use tight tracking for larger headers.
- **Body:** Plus Jakarta Sans ensures high legibility and a welcoming feel for long-form content.
- **Data & Numbers:** Use a monospaced alternative like Courier Prime (representing the requested VT323 vibe for web-standard compatibility) for tabular data and technical values.
- **Retro Accents:** Small labels or "system messages" should use high-contrast, uppercase styling to mimic early web interfaces.

## Layout & Spacing
The layout follows a rigorous **4px base unit** grid. 

- **Grid System:** A 12-column fluid grid on desktop, scaling to 4 columns on mobile. 
- **Rhythm:** Neo-brutalist elements require generous "breathing room" to prevent the heavy borders from feeling cluttered. Use `md` (24px) as the default container padding.
- **Offsets:** Component shadows are specifically fixed at a 4px horizontal and vertical offset to maintain the rigid "sticker" look of the UI.

## Elevation & Depth
Elevation is expressed through two distinct layers:

1.  **Structural Layer (Bottom):** Hard-edged surfaces with 2px solid Deep Purple borders and 4px solid offset shadows (no blur). This creates a tactile, mechanical feel.
2.  **Glass Layer (Top):** Floating overlays, modals, and navigation bars use backdrop-blur (12px–20px) and a semi-transparent white stroke (1px). This represents the "Apple Music precision" within the chaotic Y2K aesthetic.

Combined, these layers create a "Glass-on-Grid" look where vibrant content sits behind frosted windows, all held together by heavy outlines.

## Shapes
The shape language is primarily controlled and geometric. While the base `roundedness` is set to "Soft" (1), specific components utilize a wide range of radii to define their hierarchy:

- **Buttons/Inputs:** 8px (md) for a modern, clickable feel.
- **Cards:** 16px (lg) for a substantial, containerized appearance.
- **Feature Hero Blocks:** 24px (xl) to soften large areas of Chrome Gradient.
- **Tags/Pills:** Full pill-shape to contrast against the rigid 4px offset shadows.

## Components
- **Buttons:** Primary buttons use the Hot Pink background, a 2px Deep Purple border, and a 4px Deep Purple offset shadow. On hover, the shadow should retract to 0px, mimicking a physical press.
- **Glass Cards:** Use a background of `rgba(255, 255, 255, 0.6)` with a `backdrop-filter: blur(10px)`. The border should be a thin 1px white stroke at 40% opacity.
- **Input Fields:** 2px solid Deep Purple border with a background of Surface white. Use Cyan Glow for the focus ring.
- **Chips/Badges:** Use the Pill-shape radius. Successful states use Neon Lime with black text.
- **Navigation Bar:** A sticky Glassmorphic bar at the top or bottom of the viewport, utilizing the Chrome Gradient as a subtle underlay or border highlight.
- **Data Visualizations:** Use monospaced fonts and Cyan Glow for line graphs or progress bars to emphasize the "tech-futurism" aspect.