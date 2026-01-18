# Next.js Contractors Page Implementation Guide

## Overview
Your contractors landing page is built with **Next.js App Router + Tailwind CSS**, following your existing architecture patterns.

## File Structure

```
app/(site)/contractors/page.tsx              # Server page component
src/sitePages/
  └─ ContractorsPageContent.tsx              # Client component (manages modal state)
src/sections/contractors/
  ├─ HeroSection.tsx
  ├─ ProblemsSection.tsx
  ├─ SolutionSection.tsx
  ├─ OfferSection.tsx
  ├─ FeaturesSection.tsx
  ├─ TestimonialsSection.tsx
  ├─ BuilderPartnerSection.tsx
  ├─ PricingSection.tsx
  ├─ CTASection.tsx
  └─ ContactModal.tsx
```

## Installation Steps

### 1. Create Page Route
Create `app/(site)/contractors/page.tsx` with the provided server page code.

### 2. Create Main Component
Create `src/sitePages/ContractorsPageContent.tsx` - this manages the modal state and orchestrates all sections.

### 3. Create Section Components
Create the directory `src/sections/contractors/` and add all section components:
- HeroSection.tsx
- ProblemsSection.tsx
- SolutionSection.tsx
- OfferSection.tsx
- FeaturesSection.tsx
- TestimonialsSection.tsx
- BuilderPartnerSection.tsx
- PricingSection.tsx
- CTASection.tsx
- ContactModal.tsx

## Component Architecture

### Page Flow
```
ContractorsPageContent (client, manages modal state)
├─ HeroSection (calls onCTAClick)
├─ ProblemsSection
├─ SolutionSection
├─ OfferSection (calls onCTAClick)
├─ FeaturesSection
├─ TestimonialsSection
├─ BuilderPartnerSection (calls onCTAClick)
├─ PricingSection (calls onCTAClick)
├─ CTASection (calls onCTAClick)
└─ ContactModal (controlled by isModalOpen state)
```

### State Management
- **ContractorsPageContent** manages `isModalOpen` state
- Child components receive `onCTAClick` callback prop
- Modal receives `isOpen` and `onClose` props

## Design System Integration

### Colors (Tailwind)
- Primary Orange: `#FF5C02` (use `bg-[#FF5C02]`, `text-[#FF5C02]`)
- Dark Orange: `#e54a00` (hover state)
- Background: `#FAF9F7` (use `bg-[#FAF9F7]`)
- Light Orange: `#FFEFEB` (alternate sections, use `bg-[#FFEFEB]`)
- Text: `#000000` (use `text-black`)
- Highlight: `#8F8E8C` (secondary text, use `text-[#8F8E8C]`)
- Footer: `#2B2A28` (use `bg-[#2B2A28]`)

### Typography
- Font Family: Gilroy (already in your tailwind.config.js)
- Headings: `font-gilroy text-3xl md:text-4xl font-bold`
- Body: Regular Tailwind text utilities
- All components use Tailwind utility classes (no CSS modules)

## Key Features

### Responsive Design
- Mobile-first approach
- `md:` breakpoint for tablet/desktop
- All sections use responsive grid: `grid md:grid-cols-2 lg:grid-cols-3`

### Interactive Elements
1. **Hero CTA Buttons** - Opens modal or scrolls to offer section
2. **Offer Section** - Featured call-to-action with countdown/scarcity
3. **Pricing Cards** - Featured tier highlighted with border and scale
4. **Contact Modal** - Form with validation, handles submission
5. **Builder Partner Section** - Your existing CTA section design

### Modal Implementation
- Fixed positioning overlay
- Form state management with `useState`
- Email, phone, textarea inputs
- Simple validation via `required` attributes
- Alert on submission (can connect to API later)

## API Integration (Future)

When ready to save form data:

```typescript
// In ContactModal.tsx handleSubmit:
const response = await fetch("/api/admin/contractors/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

Create corresponding route: `app/api/admin/contractors/leads/route.ts`

## Styling Notes

1. **No CSS Modules Used** - Everything is Tailwind utilities
2. **Arbitrary Colors** - Using `[#COLORCODE]` syntax for custom colors
3. **Responsive Classes** - All sections use `px-4 py-16 md:py-24` pattern
4. **Hover States** - Buttons use `hover:` prefix for interactive states
5. **Transitions** - Added `transition`, `transform`, `hover:-translate-y-1` for polish

## Testing Checklist

- [ ] Page loads at `/contractors`
- [ ] Hero section displays with both CTA buttons
- [ ] All sections render with correct colors
- [ ] Gilroy font loads for headings
- [ ] Mobile responsive (test at 375px width)
- [ ] Tablet responsive (test at 768px width)
- [ ] Desktop responsive (test at 1024px width)
- [ ] Modal opens when CTA buttons clicked
- [ ] Modal closes with X button
- [ ] Modal closes when overlay clicked
- [ ] Form inputs accept data
- [ ] Form submission shows alert
- [ ] Scroll-to-offer button works smoothly
- [ ] Builder Partner section (yours) displays correctly
- [ ] No console errors
- [ ] Images load (if any)

## Customization

### Updating Text
- All section text is hardcoded in components
- Update directly in each component file
- No external config needed

### Updating Colors
- Change color values in each component's className strings
- Or update Tailwind config CSS variables (if you add them)

### Updating Pricing
- Edit the `tiers` array in `PricingSection.tsx`
- Modify `features` array for each tier

### Updating Testimonials
- Edit the `testimonials` array in `TestimonialsSection.tsx`
- Add/remove objects as needed

### Form Submission
- Currently shows alert
- To save to database:
  1. Update `handleSubmit` in `ContactModal.tsx`
  2. Create `/api/admin/contractors/leads/route.ts`
  3. Connect to Supabase or Sanity as needed

## Performance Notes

- All sections are client components (marked with "use client")
- No data fetching (all static content)
- Modal is conditionally rendered (not hidden with CSS)
- Images: Consider adding lazy loading if images added later
- Bundle size: Minimal - only utilities from Tailwind

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No polyfills needed (all CSS Grid/Flexbox support is standard)

## Next Steps

1. Copy all component files into your project
2. Verify Tailwind has Gilroy font family configured
3. Test responsive design on mobile devices
4. Connect form submission to API when ready
5. Monitor analytics on builder conversions
6. A/B test CTA button text/color if needed