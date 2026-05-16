import { z } from "zod";

export const HeroBlock = z.object({
  type:               z.literal("hero"),
  eyebrow:            z.string(),
  heading:            z.string(),
  subheading:         z.string(),
  imageUrl:           z.string(),
  ctaText:            z.string(),
  ctaHref:            z.string(),
  ctaSecondaryText:   z.string().optional(),
  ctaSecondaryHref:   z.string().optional(),
});

export const IdeologyBlock = z.object({
  type:    z.literal("ideology"),
  eyebrow: z.string(),
  heading: z.string(),
  quote:   z.string().optional(),
  body:    z.string(),
});

const BadgeVariant = z.enum(["forever-friend", "coffee-cause", "purrfect-partners", "sip-cuddle-relax"] as const);

export const OfferingsBlock = z.object({
  type:   z.literal("offerings"),
  eyebrow: z.string(),
  items:  z.array(z.object({
    imageUrl: z.string(),
    badge:    BadgeVariant.optional(),
    title:    z.string(),
    body:     z.string(),
  })),
});

export const BookingCtaBlock = z.object({
  type:    z.literal("booking_cta"),
  heading: z.string(),
  sub:     z.string(),
  ctaText: z.string(),
  ctaHref: z.string(),
  note:    z.string().optional(),
});

export const KittyTeaserBlock = z.object({
  type:    z.literal("kitty_teaser"),
  eyebrow: z.string(),
  heading: z.string(),
});

export const ContactFormBlock = z.object({
  type:    z.literal("contact_form"),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
});

export const StoryBlock = z.object({
  type:     z.literal("story"),
  eyebrow:  z.string(),
  heading:  z.string(),
  body:     z.string(),
  body2:    z.string().optional(),
  imageUrl: z.string(),
  imageAlt: z.string(),
});

export const ValuesStripBlock = z.object({
  type:   z.literal("values_strip"),
  values: z.array(z.object({
    title: z.string(),
    body:  z.string(),
  })),
});

export const FaqBlock = z.object({
  type:    z.literal("faq"),
  eyebrow: z.string().optional(),
  heading: z.string(),
  items:   z.array(z.object({
    q: z.string(),
    a: z.string(),
  })),
});

export const HeroCenteredBlock = z.object({
  type:         z.literal("hero_centered"),
  eyebrow:      z.string(),
  heading:      z.string(),
  subtitle:     z.string().optional(),
  badgeVariant: BadgeVariant.optional(),
  background:   z.string().optional(),
});

export const PerfectForBlock = z.object({
  type:     z.literal("perfect_for"),
  eyebrow:  z.string(),
  heading:  z.string(),
  body:     z.string(),
  imageUrl: z.string(),
  ctaText:  z.string(),
  ctaHref:  z.string(),
});

export const PricingTiersBlock = z.object({
  type:     z.literal("pricing_tiers"),
  eyebrow:  z.string().optional(),
  heading:  z.string(),
  tiers:    z.array(z.object({
    label:    z.string(),
    sublabel: z.string(),
    price:    z.string(),
    duration: z.string(),
    capacity: z.string(),
    perks:    z.array(z.string()),
  })),
  footnote: z.string().optional(),
});

export const RulesListBlock = z.object({
  type:    z.literal("rules_list"),
  eyebrow: z.string().optional(),
  heading: z.string(),
  items:   z.array(z.string()),
});

export const GalleryBlock = z.object({
  type:    z.literal("gallery"),
  eyebrow: z.string().optional(),
  images:  z.array(z.object({
    url: z.string(),
    alt: z.string(),
  })),
});

export const InquiryFormBlock = z.object({
  type:    z.literal("inquiry_form"),
  eyebrow: z.string().optional(),
  heading: z.string(),
});

export const WaiverBlock = z.object({
  type:        z.literal("waiver"),
  sections:    z.array(z.object({
    heading: z.string(),
    body:    z.string(),
  })),
  updatedNote: z.string().optional(),
});

export const AnyBlock = z.discriminatedUnion("type", [
  HeroBlock,
  IdeologyBlock,
  OfferingsBlock,
  BookingCtaBlock,
  KittyTeaserBlock,
  ContactFormBlock,
  StoryBlock,
  ValuesStripBlock,
  FaqBlock,
  HeroCenteredBlock,
  PerfectForBlock,
  PricingTiersBlock,
  RulesListBlock,
  GalleryBlock,
  InquiryFormBlock,
  WaiverBlock,
]);
export type AnyBlock = z.infer<typeof AnyBlock>;

export const BlocksArray = z.array(AnyBlock);
export type BlocksArray = z.infer<typeof BlocksArray>;

// Named block types for use in renderers and editors
export type THeroBlock         = z.infer<typeof HeroBlock>;
export type TIdeologyBlock     = z.infer<typeof IdeologyBlock>;
export type TOfferingsBlock    = z.infer<typeof OfferingsBlock>;
export type TBookingCtaBlock   = z.infer<typeof BookingCtaBlock>;
export type TKittyTeaserBlock  = z.infer<typeof KittyTeaserBlock>;
export type TStoryBlock        = z.infer<typeof StoryBlock>;
export type TValuesStripBlock  = z.infer<typeof ValuesStripBlock>;
export type TFaqBlock          = z.infer<typeof FaqBlock>;
export type THeroCenteredBlock = z.infer<typeof HeroCenteredBlock>;
export type TPerfectForBlock   = z.infer<typeof PerfectForBlock>;
export type TPricingTiersBlock = z.infer<typeof PricingTiersBlock>;
export type TRulesListBlock    = z.infer<typeof RulesListBlock>;
export type TGalleryBlock      = z.infer<typeof GalleryBlock>;
export type TInquiryFormBlock  = z.infer<typeof InquiryFormBlock>;
export type TWaiverBlock       = z.infer<typeof WaiverBlock>;
