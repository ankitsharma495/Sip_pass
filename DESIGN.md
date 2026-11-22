---
name: "Sip Pass Design System"
description: "Warm, sunlit cafe-culture design system for Sip Pass, a citywide daily coffee subscription app in Indian metro cities."
---

## Overview

Sip Pass is a daily coffee discovery and subscription app for students, freelancers, and young professionals in Indian metro cities (Bengaluru, Mumbai, Delhi NCR). The visual language blends sunlit editorial warmth with tactile, thumb-friendly mobile utility: warm cream paper surfaces, deep espresso brown typography and primary actions, and terracotta accents inspired by roasted beans, ceramic pour-overs, and Instagram-era indie cafe culture.

The style is **Warm Minimalism with Tactile Cards**: generous breathing room, large high-bleed cafe photography, soft rounded corners, and clear single-column scannability. Light mode is the primary experience, evoking morning sunlight in a neighborhood roastery.

## Colors

The palette anchors on **Espresso Brown** for primary actions and high-contrast ink, **Terracotta** for warm highlights, active states, and pass badges, and **Warm Cream** (`#FDF9F4`) for the canvas. Semantic `success` (matcha/forest green) and `warning` (amber roast) are reserved strictly for redemption confirmation, active pass status, and countdown states.

```yaml
colors:
  espresso: "#2D221E"
  terracotta: "#C65D3B"
  cream: "#FAF4EC"
  honey-oat: "#ECC894"
  on-honey-oat: "#1F1916"
  botanical: "#8B7765"
  success: "#1F6E43"
  on-success: "#FFFFFF"
  success-container: "#D9F8E7"
  on-success-container: "#052016"
  warning: "#A65600"
  on-warning: "#FFFFFF"
  light:
    primary: "#2D221E"
    on-primary: "#FFFFFF"
    primary-container: "#43342E"
    on-primary-container: "#EADBC8"
    secondary: "#9F4021"
    on-secondary: "#FFFFFF"
    secondary-container: "#ECC894"
    on-secondary-container: "#1F1916"
    tertiary: "#082319"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#1F392E"
    on-tertiary-container: "#86A394"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#FAF4EC"
    on-background: "#1F1916"
    surface: "#FAF4EC"
    surface-dim: "#E5DDD2"
    surface-bright: "#FAF4EC"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F4ECE1"
    surface-container: "#EFE4D6"
    surface-container-high: "#E9DCCB"
    surface-container-highest: "#E2D3C0"
    on-surface: "#1F1916"
    surface-variant: "#EFE4D6"
    on-surface-variant: "#5C5049"
    outline: "#8C7D73"
    outline-variant: "#E6DACB"
    inverse-surface: "#2D221E"
    inverse-on-surface: "#FAF4EC"
    inverse-primary: "#ECC894"
    shadow: "#000000"
    scrim: "#000000"
  dark:
    primary: "#EABCB8"
    on-primary: "#462827"
    primary-container: "#4A2C2A"
    on-primary-container: "#BD928F"
    secondary: "#FFB59E"
    on-secondary: "#5E1700"
    secondary-container: "#832C0D"
    on-secondary-container: "#FFA083"
    tertiary: "#B0CDBE"
    on-tertiary: "#1B352B"
    tertiary-container: "#1F392E"
    on-tertiary-container: "#86A394"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#141311"
    on-background: "#E6E2DD"
    surface: "#141311"
    surface-dim: "#141311"
    surface-bright: "#3A3936"
    surface-container-lowest: "#0F0E0C"
    surface-container-low: "#1C1C19"
    surface-container: "#20201D"
    surface-container-high: "#2B2A27"
    surface-container-highest: "#363532"
    on-surface: "#E6E2DD"
    surface-variant: "#504443"
    on-surface-variant: "#D4C3C1"
    outline: "#9D8D8C"
    outline-variant: "#504443"
    inverse-surface: "#E6E2DD"
    inverse-on-surface: "#31302D"
    inverse-primary: "#795553"
    shadow: "#000000"
    scrim: "#000000"
```

## Typography

**Rubik** leads headlines and display moments with its friendly, softly rounded terminals. **Plus Jakarta Sans** carries all UI copy, cafe names, and metadata with crisp geometric legibility on mobile screens. **Geist Mono** is reserved for QR countdown timers, pass IDs, and referral codes.

```yaml
typography:
  display-lg:
    fontFamily: "Rubik"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 46px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Rubik"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Rubik"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.25px
  headline-lg-mobile:
    fontFamily: "Rubik"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 30px
    letterSpacing: -0.2px
  headline-md:
    fontFamily: "Rubik"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.1px
  headline-sm:
    fontFamily: "Rubik"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 23px
    letterSpacing: 0px
  title-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 21px
    letterSpacing: 0px
  title-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.25px
  mono-md:
    fontFamily: "Geist Mono"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.5px
  mono-sm:
    fontFamily: "Geist Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.4px
```

## Layout & Spacing

Mobile-first single-column **Fluid Grid** built for a `390px` viewport with `20px` horizontal page margins and a `4px` / `8px` spacing rhythm. Interactive touch targets are at least `44px` tall for comfortable one-handed thumb use. Bottom navigation is fixed at `64px` height plus safe-area padding, and screens with bottom nav reserve `88px` of bottom scroll padding.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 12px
  gutter-lg: 16px
  gutter-xl: 24px
  section: 28px
  page-margin: 20px
```

## Elevation & Depth

Hierarchy relies on **Tonal Layers** rather than heavy drop shadows. The base canvas sits on `surface` (`#FDF9F4`), interactive cards sit on `surface-container-lowest` (`#FFFFFF`) with a subtle `1px` `outline-variant` border, and secondary chips or callout wells sit on `surface-container-low` (`#F7F3EE`). Floating elements (sticky bottom navigation, map preview sheet, and primary redeem dock) use a soft warm espresso-tinted ambient shadow (`0 8px 24px rgba(50, 23, 22, 0.08)`).

## Shapes

Generous, friendly curves echo ceramic mugs and rounded cafe signage. Cards use `xl` (`20px`) corners, nested imagery inside padded cards steps down to `lg` (`16px`), primary buttons and search bars use `full` (`9999px`) pill shapes, and status tags use `md` (`12px`) or `full`.

```yaml
rounded:
  sm: 6px
  DEFAULT: 12px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 28px
  full: 9999px
```

## Motion & Micro-interaction

Interactions feel snappy and organic—like tapping a ceramic cup onto a coaster. Button presses scale subtly (`0.98`), filter chips transition background and text color in `120ms`, and bottom sheets or QR confirmation overlays decelerate smoothly into place.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 240ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 160ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice:** Warm, upbeat, and local—like a friend who knows every specialty roaster in Indiranagar or Bandra. Never corporate, never pushy.
- **Capitalisation:** Sentence case for headings, buttons, and filter chips ("Redeem coffee", "Today's coffee", "Work-friendly").
- **Terminology:** Always say "pass" (not "membership" or "tier"), "redeem" (not "claim" or "checkout"), and "partner cafe" (not "merchant" or "vendor").
- **Button labels:** Clear verb phrases naming the outcome ("Redeem coffee", "Send OTP", "Give a week, get a week").
- **Numbers & currency:** Indian Rupee (`₹`) with `tabular-nums`, distances in `m` or `km` (`450 m`, `1.2 km`), and ratings to one decimal place (`4.8`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Chip** → `@components/chip.html`: `chip-action`, `chip-input`, `chip-with-icon`
- **Searchbar** → `@components/searchbar.html`: `searchbar-standard`, `searchbar-with-suggestions`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
