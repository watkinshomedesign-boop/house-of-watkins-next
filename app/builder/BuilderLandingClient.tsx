"use client";

import { useState, useEffect, useRef } from "react";
import "./builder-landing.css";
import { motion, useInView } from "framer-motion";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { Footer } from "@/sections/Footer";
import type { BuilderPageCMS } from "@/lib/builderPage/sanity";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } as const,
  },
};

// Section wrapper with scroll animation
const AnimatedSection = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
      id={id}
    >
      {children}
    </motion.section>
  );
};


// Section 1: Hero
const HeroSection = ({ cms }: { cms?: BuilderPageCMS["hero"] }) => {
  const bgImage = cms?.backgroundImageUrl ?? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80";
  const headline = cms?.headline ?? "Complete, Buildable Plans. From a Designer Who\u2019s Designed 400+ of Them.";
  const subheadline = cms?.subheadline ?? "I design homes that work on the job site, not just on screen. Stock plans with builder discounts & modifications.";

  return (
    <section
      className="blp-hero-bg min-h-[80vh] flex items-center justify-center relative"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      <div className="blp-hero-overlay"></div>
      <div className="blp-container relative z-10 text-center py-20">
        <motion.h1
          className="blp-heading-h1 text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="blp-body-large text-white max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subheadline}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="/house-plans" className="blp-btn-primary">See House Plans</a>
          <a href="#builder-partner-program" className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors">
            Or scroll down to see the Builder Partner Program
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Section 2: The Problem
const PROBLEM_DEFAULTS = {
  headline: "The Plans You\u2019re Getting Aren\u2019t Complete. You Already Know This.",
  body: [
    "If you\u2019ve been building for any length of time, you\u2019ve dealt with this: plans that look fine on screen but fall apart in the field. Missing dimensions. Details that don\u2019t translate to framing. Specs that generate RFIs and change orders before the foundation is poured.",
    "It\u2019s not that the designers don\u2019t care. It\u2019s that most of them haven\u2019t stood on a job site and watched a framing crew try to work from their drawings. I have -- for 30 years, across more than 400 homes.",
  ],
  boldStatement: "Every plan I produce is dimensioned for the framer, detailed for the sub, and designed by someone who knows where the problems hide. That\u2019s what \u2018complete\u2019 actually means.",
  imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
  imageAlt: "Construction site",
};

const ProblemSection = ({ cms }: { cms?: BuilderPageCMS["problem"] }) => {
  const h = cms?.headline ?? PROBLEM_DEFAULTS.headline;
  const body = cms?.body?.length ? cms.body : PROBLEM_DEFAULTS.body;
  const bold = cms?.boldStatement ?? PROBLEM_DEFAULTS.boldStatement;
  const imgUrl = cms?.imageUrl ?? PROBLEM_DEFAULTS.imageUrl;
  const imgAlt = cms?.imageAlt ?? PROBLEM_DEFAULTS.imageAlt;

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]">
      <div className="blp-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="blp-heading-h2 mb-6">{h}</h2>
            <div className="blp-body-text space-y-4">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-semibold text-[#27272A]">{bold}</p>
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={imgAlt}
              className="blp-rounded-image w-full h-auto grayscale opacity-70"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 3: Three Ways I Work With Builders
const SolutionSection = () => {
  const cards = [
    {
      title: "Ready-to-Build Plans",
      body: "Proven designs refined across hundreds of projects. Every plan on my site has been built before. Builder discounts start at 15% off your first plan, and CAD files include an unlimited build license.",
      ctaLabel: "See House Plans",
      ctaHref: "/house-plans",
    },
    {
      title: "Plan Modifications",
      body: "Need to adjust a stock plan to fit a lot, a client\u2019s wish list, or local code? Small adjustments start at $225. I turn modifications around on your timeline, not mine.",
      ctaLabel: "See Modification Options",
      ctaHref: "/whats-included",
    },
    {
      title: "Custom Design",
      body: "For clients who want something designed from scratch. $2.85 per square foot of conditioned space.",
      ctaLabel: "Let\u2019s Talk About Your Project",
      ctaHref: "/contact-us",
    },
  ];

  return (
    <AnimatedSection className="blp-section">
      <div className="blp-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="blp-heading-h2 mb-6">Three Ways I Work With Builders</h2>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {cards.map((card, index) => (
            <motion.div key={index} className="blp-card text-center flex flex-col" variants={fadeInUp}>
              <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-[#EA580C]" />
              </div>
              <h3 className="blp-heading-h3 text-lg mb-3">{card.title}</h3>
              <p className="blp-body-text text-sm mb-6 flex-1">{card.body}</p>
              <a href={card.ctaHref} className="blp-btn-secondary text-sm py-2.5 px-5 inline-block">
                {card.ctaLabel}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Section 4: Portfolio
const PORTFOLIO_DEFAULTS = {
  headline: "Some of the 400+ Homes I\u2019ve Designed",
  subheadline: "These have all been built. They\u2019re not renderings of theoretical designs -- they\u2019re real homes, framed and finished by builders like you.",
  ctaLabel: "Explore the Full Portfolio",
  images: [
    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&q=80", alt: "Luxury home 1" },
    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&q=80", alt: "Luxury home 2" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80", alt: "Luxury home 3" },
    { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&q=80", alt: "Luxury home 4" },
    { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&q=80", alt: "Luxury home 5" },
    { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80", alt: "Luxury home 6" },
    { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop&q=80", alt: "Luxury home 7" },
    { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&q=80", alt: "Luxury home 8" },
    { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop&q=80", alt: "Luxury home 9" },
  ],
};

const PortfolioSection = ({ cms }: { cms?: BuilderPageCMS["portfolio"] }) => {
  const headline = cms?.headline ?? PORTFOLIO_DEFAULTS.headline;
  const subheadline = cms?.subheadline ?? PORTFOLIO_DEFAULTS.subheadline;
  const ctaLabel = cms?.ctaLabel ?? PORTFOLIO_DEFAULTS.ctaLabel;
  const images = cms?.images?.length ? cms.images : PORTFOLIO_DEFAULTS.images;

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]" id="portfolio">
      <div className="blp-container">
        <div className="text-center mb-12">
          <h2 className="blp-heading-h2 mb-4">{headline}</h2>
          <p className="blp-heading-h3 text-[#52525B] font-normal">{subheadline}</p>
        </div>

        <div className="blp-portfolio-grid mb-12">
          {images.map((img, index) => (
            <div key={index} className="blp-portfolio-item cursor-pointer group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? `Luxury home design ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="blp-btn-primary">
            {ctaLabel}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 5: Builder Partner Program
const BuilderPartnerProgramSection = () => {
  const tiers = [
    { level: "First Plan", qualification: "Any builder, first purchase", discount: "15% off" },
    { level: "Repeat Builder", qualification: "2nd through 5th plan", discount: "20% off" },
    { level: "Preferred Builder", qualification: "6+ plans purchased", discount: "25% off + priority modifications" },
  ];

  const perks = [
    { title: "Unlimited Build License", description: "CAD file purchases include the right to build the plan as many times as you want. No per-use fees." },
    { title: "Free Consultation Call", description: "15-20 minutes on every plan you purchase. I walk you through the design intent, framing considerations, and site adaptation options." },
    { title: "Marketing Image Rights", description: "Use my renderings and floor plan images in your own marketing -- MLS listings, brochures, your website. I\u2019ll share them in a format you can use." },
    { title: "Direct Client Meetings", description: "I\u2019ll meet (via video) with your end client to walk through the plan, answer their questions, and help you close the sale. No stock plan company does this." },
    { title: "Priority Modifications", description: "Preferred builders (6+ plans) move to the front of the modification queue." },
  ];

  return (
    <AnimatedSection className="blp-section" id="builder-partner-program">
      <div className="blp-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="blp-heading-h2 mb-6">Builder Partner Program</h2>
          <p className="blp-body-large">No contracts. No annual minimums. No registration fees. The discount grows as the relationship grows.</p>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="blp-roi-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>How You Qualify</th>
                <th className="bg-[#FFF7ED]">Your Discount</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, index) => (
                <tr key={index}>
                  <td className="font-medium text-[#27272A]">{tier.level}</td>
                  <td>{tier.qualification}</td>
                  <td className="blp-highlight">{tier.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="blp-body-text text-center max-w-3xl mx-auto mb-12">
          At an average plan price of $1,600, your first plan costs $1,360. By your sixth plan, you&apos;re paying $1,200 -- with unlimited build licenses on every CAD purchase.
        </p>

        <h3 className="blp-heading-h3 text-center mb-8">Builder Perks</h3>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {perks.map((perk, index) => (
            <motion.div key={index} className="blp-card" variants={fadeInUp}>
              <h4 className="font-semibold text-[#27272A] mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>{perk.title}</h4>
              <p className="blp-body-text text-sm">{perk.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <a href="/house-plans" className="blp-btn-primary">
            Get Your First Plan at 15% Off
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 6: Process
const PROCESS_DEFAULTS = {
  headline: "How It Works",
  steps: [
    { number: "01", title: "Pick a Plan or Start Custom", description: "Browse ready-to-build plans on the site, or reach out about a fully custom design at $2.85/sqft. Either way, builder discounts apply from day one." },
    { number: "02", title: "We Talk Through the Details", description: "Every project starts with a conversation. Your lot, your client\u2019s priorities, local code considerations. If you\u2019re modifying a stock plan, this is where we sort out what changes make sense and what they\u2019ll cost." },
    { number: "03", title: "You Get Complete Documents", description: "Framer-friendly dimensions. Details your subs can actually build from. A plan set that doesn\u2019t generate a stack of RFIs. That\u2019s the standard." },
    { number: "04", title: "Build It", description: "You build. I\u2019m available if questions come up. Builders on tight schedules don\u2019t have time for a designer who disappears for two weeks." },
  ],
};

const ProcessSection = ({ cms }: { cms?: BuilderPageCMS["process"] }) => {
  const headline = cms?.headline ?? PROCESS_DEFAULTS.headline;
  const steps = cms?.steps?.length ? cms.steps : PROCESS_DEFAULTS.steps;

  return (
    <AnimatedSection className="blp-section bg-[#27272A]" id="process">
      <div className="blp-container">
        <h2 className="blp-heading-h2 text-white text-center mb-16">{headline}</h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="blp-process-step" variants={fadeInUp}>
              <span className="blp-process-number text-white/10">{step.number}</span>
              <h3 className="blp-heading-h3 text-white mb-3 -mt-4">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};


// Section 8: (Removed — handled by Builder Partner Program above)

// Section 9: About
const ABOUT_DEFAULTS = {
  headline: "About David",
  body: [
    "I\u2019m David Watkins, a residential designer based in South Carolina. I\u2019ve spent the last 30 years focused entirely on homes -- not office buildings, not retail, not mixed-use. Just homes. More than 400 of them.",
    "I started in construction, which is probably why my plans read the way they do. I know what happens when a dimension is missing or a detail doesn\u2019t make sense at 7 AM on a job site. My goal is to hand you a set of documents that your crew can build from without calling me -- but I\u2019m here if they do.",
  ],
  boldStatement: "I\u2019m not a large firm. I\u2019m a one-person operation, which means when you call, you get me.",
  imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  imageAlt: "David Watkins - Residential Designer",
};

const AboutSection = ({ cms }: { cms?: BuilderPageCMS["about"] }) => {
  const headline = cms?.headline ?? ABOUT_DEFAULTS.headline;
  const body = cms?.body?.length ? cms.body : ABOUT_DEFAULTS.body;
  const bold = cms?.boldStatement ?? ABOUT_DEFAULTS.boldStatement;
  const imgUrl = cms?.imageUrl ?? ABOUT_DEFAULTS.imageUrl;
  const imgAlt = cms?.imageAlt ?? ABOUT_DEFAULTS.imageAlt;

  return (
    <AnimatedSection className="blp-section" id="about">
      <div className="blp-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={imgAlt}
              className="blp-rounded-image w-full h-auto"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="blp-heading-h2 mb-6">{headline}</h2>
            <div className="blp-body-text space-y-4">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-semibold text-[#27272A]">{bold}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 10: FAQ
const FAQ_DEFAULTS = {
  headline: "Questions Builders Ask Me",
  items: [
    { question: "What does the builder discount look like?", answer: "15% off your first plan, 20% off plans 2 through 5, and 25% off everything after that. CAD file purchases include an unlimited build license. No contracts, no annual fees." },
    { question: "Can you modify a stock plan to fit my lot or my client?", answer: "Yes. That\u2019s one of the most common things I do. Small modifications (garage flip, bedroom resize) start at $225. Larger changes are quoted after a quick conversation. Turnaround depends on scope, but I don\u2019t sit on projects." },
    { question: "What does $2.85 per square foot include for custom design?", answer: "Consultation, schematic design, and a full construction document set -- the same level of detail you\u2019d get in any plan on my site. I\u2019ll also meet with your client directly if that helps move the project forward." },
    { question: "I already have a designer. Why would I switch?", answer: "Maybe you wouldn\u2019t. But if you\u2019re dealing with incomplete plans, slow turnarounds, or drawings your framing crew can\u2019t follow, it\u2019s worth a conversation. I\u2019ve spent 30 years doing nothing but residential design, and I started in construction. That combination shows up in the documents." },
    { question: "Will these plans work in my market?", answer: "I\u2019ve designed homes from the mountains of Colorado to the coasts of the Carolinas. Good bones translate everywhere. We\u2019ll talk about your regional code requirements and aesthetic preferences before anything gets drawn." },
    { question: "How do I get started?", answer: "Browse plans on the site and use the builder checkout, or email me at david@houseofwatkins.com. Either way, the discount applies from your first purchase." },
  ],
};

const FAQSection = ({ cms }: { cms?: BuilderPageCMS["faq"] }) => {
  const headline = cms?.headline ?? FAQ_DEFAULTS.headline;
  const items = cms?.items?.length ? cms.items : FAQ_DEFAULTS.items;

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]" id="faq">
      <div className="blp-container">
        <h2 className="blp-heading-h2 text-center mb-12">{headline}</h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {items.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-left font-semibold text-[#27272A]" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-[#52525B] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 11: Final CTA
const FinalCTASection = () => {
  return (
    <section className="blp-cta-section py-24 md:py-32">
      <div className="blp-container text-center">
        <motion.h2
          className="blp-heading-h2 text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Let&apos;s Build Something Worth Building
        </motion.h2>
        <motion.p
          className="blp-body-large text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Browse builder plans, ask about modifications, or start a custom project. No pressure, no sales pitch -- just a conversation between two people who care about getting the details right.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="/house-plans" className="blp-cta-btn-primary">Browse Builder Plans</a>
          <a href="mailto:david@houseofwatkins.com" className="blp-cta-btn-secondary">Email David Directly</a>
        </motion.div>
      </div>
    </section>
  );
};


// Scroll to Top Button
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#EA580C] text-white shadow-lg flex items-center justify-center hover:bg-[#C2410C] transition-colors"
      aria-label="Scroll to top"
    >
      <ChevronDown className="w-5 h-5 rotate-180" />
    </button>
  );
};

// Main Page
export default function BuilderLandingPage({ cms }: { cms?: BuilderPageCMS | null }) {
  return (
    <div className="builder-landing" style={{ fontFamily: "'Inter', sans-serif" }}>
      <InteriorHeader />
      <main>
        <HeroSection cms={cms?.hero} />
        <ProblemSection cms={cms?.problem} />
        <SolutionSection />
        <PortfolioSection cms={cms?.portfolio} />
        <BuilderPartnerProgramSection />
        <ProcessSection cms={cms?.process} />
        <AboutSection cms={cms?.about} />
        <FAQSection cms={cms?.faq} />
        <FinalCTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
