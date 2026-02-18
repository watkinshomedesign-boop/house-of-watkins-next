import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

export type BuilderPageCMS = {
  hero?: {
    headline?: string;
    subheadline?: string;
    ctaLabel?: string;
    secondaryCtaLabel?: string;
    backgroundImageUrl?: string;
    backgroundImageAlt?: string;
  };
  problem?: {
    headline?: string;
    body?: string[];
    boldStatement?: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  solution?: {
    headline?: string;
    intro?: string;
    body?: string;
    benefits?: { title?: string; description?: string }[];
  };
  portfolio?: {
    headline?: string;
    subheadline?: string;
    ctaLabel?: string;
    images?: { url: string; alt?: string }[];
  };
  roi?: {
    headline?: string;
    intro?: string;
    tableNote?: string;
    tableRows?: { metric?: string; stockValue?: string; watkinsValue?: string; difference?: string }[];
    conclusion?: string;
  };
  process?: {
    headline?: string;
    steps?: { number?: string; title?: string; description?: string }[];
  };
  testimonials?: {
    headline?: string;
    items?: { quote?: string; name?: string; title?: string; photoUrl?: string }[];
  };
  offer?: {
    headline?: string;
    subheadline?: string;
    price?: string;
    ctaLabel?: string;
    includes?: string[];
    partnershipNote?: string;
  };
  about?: {
    headline?: string;
    body?: string[];
    boldStatement?: string;
    imageUrl?: string;
    imageAlt?: string;
    stats?: { value?: string; label?: string }[];
  };
  faq?: {
    headline?: string;
    items?: { question?: string; answer?: string }[];
  };
  finalCta?: {
    headline?: string;
    body?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
  };
};

const BUILDER_PAGE_QUERY = `*[_type == "builderLandingPage" && _id == "builderLandingPage"][0] {
  hero {
    headline,
    subheadline,
    ctaLabel,
    secondaryCtaLabel,
    "backgroundImageUrl": backgroundImage.asset->url,
    backgroundImageAlt
  },
  problem {
    headline,
    body,
    boldStatement,
    "imageUrl": image.asset->url,
    imageAlt
  },
  solution {
    headline,
    intro,
    body,
    benefits[] { title, description }
  },
  portfolio {
    headline,
    subheadline,
    ctaLabel,
    images[] { "url": asset->url, alt }
  },
  roi {
    headline,
    intro,
    tableNote,
    tableRows[] { metric, stockValue, watkinsValue, difference },
    conclusion
  },
  process {
    headline,
    steps[] { number, title, description }
  },
  testimonials {
    headline,
    items[] { quote, name, title, "photoUrl": photo.asset->url }
  },
  offer {
    headline,
    subheadline,
    price,
    ctaLabel,
    includes,
    partnershipNote
  },
  about {
    headline,
    body,
    boldStatement,
    "imageUrl": image.asset->url,
    imageAlt,
    stats[] { value, label }
  },
  faq {
    headline,
    items[] { question, answer }
  },
  finalCta {
    headline,
    body,
    primaryCtaLabel,
    secondaryCtaLabel
  }
}`;

export async function getBuilderLandingPage(): Promise<BuilderPageCMS | null> {
  if (!hasSanity()) return null;
  try {
    const client = getServerSanityClient();
    const row = await client.fetch(BUILDER_PAGE_QUERY);
    return row ?? null;
  } catch (e) {
    console.error("[builderPage/sanity] Failed to fetch:", e);
    return null;
  }
}
