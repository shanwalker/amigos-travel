
## Fix V1 Hero Section - Add Missing V1 Render Logic

### The Problem
The current `Index.tsx` imports `HeroSection` (V1) but never renders it. The conditional logic only handles:
- `'redesign'` → Shows `HeroSectionRedesign`  
- Everything else → Shows V2 components

There's no branch for `currentVersion === 'v1'`, so selecting V1 in the navbar actually shows V2 content.

### The Fix
Add a proper condition for V1 that renders the original `HeroSection` component with the auto-scrolling trip cards carousel, plus the same below-the-fold sections used in the redesign.

### Changes Required

**File: `src/pages/Index.tsx`**

1. Change default state from `'redesign'` to `'v1'` (line 46)

2. Update the conditional rendering to add a V1 branch:
   - When `currentVersion === 'v1'` → Show original `HeroSection` + all the same sections (HowItWorks, TripSearchBar, etc.)
   - When `currentVersion === 'redesign'` → Show `HeroSectionRedesign` + sections (unchanged)
   - When `currentVersion === 'v2'` → Show V2 components (unchanged)

### What V1 Includes
The original `HeroSection` component features:
- Auto-scrolling trip cards carousel (Thailand, Vietnam, Bali, Japan)
- Smooth 60fps animation using `requestAnimationFrame`
- "Travel with Travellers You Haven't Met" headline with word-by-word animations
- Background video/image with overlay

### What Won't Change
- V2 components and their rendering remain exactly the same
- Redesign components and their rendering remain exactly the same
- All lazy-loaded sections stay the same
- Navbar version switcher functionality stays the same

### Technical Implementation
```tsx
{currentVersion === 'v1' ? (
  <>
    <HeroSection />
    {/* Same sections as redesign */}
    <LazySection>...</LazySection>
  </>
) : currentVersion === 'redesign' ? (
  <>
    <HeroSectionRedesign />
    {/* Existing redesign sections - unchanged */}
  </>
) : (
  {/* V2 components - unchanged */}
)}
```
