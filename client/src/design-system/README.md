# AURA Design System

A completely new design system built from zero for the social-first messaging platform.

## Philosophy

- **Social-First**: Feed and discovery are primary, messaging is premium
- **Creator-Centric**: Emphasis on profiles and public conversations
- **Asymmetric Layouts**: Breaking away from traditional chat patterns
- **Modern & Scalable**: Built for a funded startup product

## Color System

### Primary Palette
- **Indigo** (`--aura-primary`): Main brand color
- **Pink** (`--aura-secondary`): Accent and highlights
- **Amber** (`--aura-accent`): Call-to-action and important elements

### Neutral Scale
11-step neutral scale from white to near-black for backgrounds, text, and borders.

## Typography

- **Font**: Inter (system fallbacks)
- **Scale**: 8 sizes from xs (12px) to 5xl (48px)
- **Weights**: 300-800 range
- **Line Heights**: Tight to loose (1.25-2.0)

## Spacing

8px base unit system (0.25rem increments) from 0 to 24 (96px).

## Shadows

7 elevation levels plus colored shadows for primary/secondary actions.

## Usage

Import tokens in your components:

```css
@import '../design-system/tokens.css';

.my-component {
  background: var(--aura-bg-elevated);
  color: var(--aura-text-primary);
  padding: var(--aura-space-4);
  border-radius: var(--aura-radius-lg);
  box-shadow: var(--aura-shadow-md);
}
```

