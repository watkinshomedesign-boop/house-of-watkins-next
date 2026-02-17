"use client";

import { useState, useEffect, useRef } from "react";
import "./builder-landing.css";
import { motion, useInView } from "framer-motion";
import { ChevronDown, ArrowRight, Phone, Mail, MapPin, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

// Lead Capture Form Component
const LeadCaptureForm = ({ variant = "default" }: { variant?: string }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    role: "builder",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    variant === "cta"
      ? "blp-form-input bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white"
      : "blp-form-input";

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <p className="blp-heading-h3 mb-2">Thank You!</p>
        <p className="blp-body-text">We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="blp-form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="John"
          />
        </div>
        <div>
          <label className="blp-form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <label className="blp-form-label">Email *</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="john@company.com"
        />
      </div>
      <div>
        <label className="blp-form-label">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
          placeholder="(555) 123-4567"
        />
      </div>
      <div>
        <label className="blp-form-label">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={inputClass}
          placeholder="Your Building Company"
        />
      </div>
      <div>
        <label className="blp-form-label">Message / Project Details</label>
        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className={inputClass}
          placeholder="Tell us about your project..."
        />
      </div>
      <input type="hidden" name="role" value="builder" />
      <button type="submit" className="blp-btn-primary w-full">
        Send Message
      </button>
    </form>
  );
};

// Header Component
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`blp-header-sticky transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="blp-container flex items-center justify-between">
        <a href="/" className="flex items-center gap-1">
          <span
            className="font-bold text-xl tracking-tight text-[#27272A]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            HOUSE <span className="text-sm font-normal">OF</span> WATKINS
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#portfolio" className="blp-text-link text-sm font-medium">
            Portfolio
          </a>
          <a href="#process" className="blp-text-link text-sm font-medium">
            Process
          </a>
          <a href="#about" className="blp-text-link text-sm font-medium">
            About
          </a>
          <a href="#faq" className="blp-text-link text-sm font-medium">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6 text-[#27272A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="blp-btn-secondary text-sm py-2.5 px-5 hidden md:block">Contact Us</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="blp-heading-h3">Get in Touch</DialogTitle>
              </DialogHeader>
              <LeadCaptureForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E4E4E7] py-4">
          <nav className="blp-container flex flex-col gap-4">
            <a href="#portfolio" className="blp-text-link text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#process" className="blp-text-link text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Process
            </a>
            <a href="#about" className="blp-text-link text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
            <a href="#faq" className="blp-text-link text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <button className="blp-btn-primary text-sm py-2.5 px-5 mt-2">Contact Us</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="blp-heading-h3">Get in Touch</DialogTitle>
                </DialogHeader>
                <LeadCaptureForm />
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      )}
    </header>
  );
};

// Section 1: Hero
const HeroSection = () => {
  return (
    <section
      className="blp-hero-bg min-h-[80vh] flex items-center justify-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
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
          Stop Competing. Start Dominating.
        </motion.h1>
        <motion.p
          className="blp-body-large text-white/90 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          In a market flooded with look-alike luxury homes, design distinction is your last true competitive
          advantage. Our plans help you command premium prices, attract high-caliber clients, and build a reputation
          that sells itself.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <button className="blp-btn-primary">See How Our Designs Deliver a 20-40% Premium</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="blp-heading-h3">Schedule Your Strategy Call</DialogTitle>
              </DialogHeader>
              <LeadCaptureForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors">
                Read by 150+ premium builders. Download the Free Guide
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="blp-heading-h3">
                  Download: The Builder&apos;s Guide to Design Distinction
                </DialogTitle>
              </DialogHeader>
              <p className="blp-body-text mb-6">Enter your email to receive your free copy.</p>
              <LeadCaptureForm />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};

// Section 2: The Problem
const ProblemSection = () => {
  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]">
      <div className="blp-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="blp-heading-h2 mb-6">Are You Building Homes, or Just Competing on Price?</h2>
            <div className="blp-body-text space-y-4">
              <p>
                The luxury market is crowded. Every day, another builder puts up a &quot;custom&quot; home that looks
                just like the one next door. They compete on square footage, finishes, and, ultimately, on price. This
                is a race to the bottom, where your margins get squeezed and your brand gets lost in the noise.
              </p>
              <p>
                Premium builders know this. They know that the most discerning clients aren&apos;t looking for the
                biggest house or the cheapest price-per-square-foot. They are looking for something different. They are
                looking for a home that feels unique, that tells a story, that has a soul.
              </p>
              <p className="font-semibold text-[#27272A]">
                If your designs look like everyone else&apos;s, you&apos;re not in the luxury business. You&apos;re in
                the commodity business.
              </p>
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"
              alt="Generic suburban homes"
              className="blp-rounded-image w-full h-auto grayscale opacity-70"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 3: The Solution
const SolutionSection = () => {
  const benefits = [
    { title: "Command Premium Pricing", desc: "Justify 20-40% higher sale prices that clients are happy to pay." },
    {
      title: "Shorten Your Sales Cycle",
      desc: "Create homes with such powerful curb appeal they sell before the drywall is even up.",
    },
    {
      title: "Build a Powerful Brand",
      desc: "Become the builder known for creating the most distinctive, sought-after homes in your market.",
    },
    {
      title: "Eliminate Costly Rework",
      desc: "Work from complete, professional plans honed over 400+ successful builds.",
    },
  ];

  return (
    <AnimatedSection className="blp-section">
      <div className="blp-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="blp-heading-h2 mb-6">Sell a Masterpiece. Not Just a House.</h2>
          <p className="blp-body-large">
            Design distinction is the invisible asset that allows you to exit the pricing game and enter the value
            conversation. It&apos;s the difference between a client who haggles over every line item and a client who
            says, &quot;I have to have this,&quot; and signs the contract.
          </p>
        </div>

        <p className="blp-body-text text-center max-w-3xl mx-auto mb-12">
          For 30 years, I&apos;ve designed homes that provide that unfair advantage. My plans are not just blueprints;
          they are strategic business tools for builders who refuse to be average.
        </p>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} className="blp-card text-center" variants={fadeInUp}>
              <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-[#EA580C]" />
              </div>
              <h3 className="blp-heading-h3 text-lg mb-3">{benefit.title}</h3>
              <p className="blp-body-text text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Section 4: Portfolio
const PortfolioSection = () => {
  const portfolioImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop&q=80",
  ];

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]" id="portfolio">
      <div className="blp-container">
        <div className="text-center mb-12">
          <h2 className="blp-heading-h2 mb-4">The Proof is in the Portfolio.</h2>
          <p className="blp-heading-h3 text-[#52525B] font-normal">
            Over 400 luxury homes across America. Each one unique. Each one a testament to the power of design mastery.
          </p>
        </div>

        <div className="blp-portfolio-grid mb-12">
          {portfolioImages.map((img, index) => (
            <div key={index} className="blp-portfolio-item cursor-pointer group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Luxury home design ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="blp-btn-primary">
            Explore the Full Builder&apos;s Portfolio
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 5: ROI
const ROISection = () => {
  const tableData = [
    { metric: "Sale Price", stock: "$2,000,000", watkins: "$2,400,000 (20% Premium)", diff: "+$400,000" },
    { metric: "Cost of Goods Sold", stock: "$1,600,000", watkins: "$1,604,000", diff: "+$4,000" },
    { metric: "Gross Profit", stock: "$400,000", watkins: "$796,000", diff: "+$396,000" },
    { metric: "Your Net Profit (at 7%)", stock: "$28,000", watkins: "$55,720", diff: "+99% Profit" },
  ];

  return (
    <AnimatedSection className="blp-section">
      <div className="blp-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="blp-heading-h2 mb-6">
            Don&apos;t Think of it as a Cost. Think of it as Your Highest-ROI Investment.
          </h2>
          <p className="blp-body-text">
            Let&apos;s be blunt. A set of stock plans might cost you $500. Our Signature Collection plans are a $4,000
            investment. Here&apos;s why that&apos;s the easiest business decision you&apos;ll make all year.
          </p>
          <p className="blp-body-text mt-4 font-semibold text-[#27272A]">
            Consider a typical $2,000,000 luxury build:
          </p>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="blp-roi-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>With Stock Plans</th>
                <th>With a House of Watkins Design</th>
                <th className="bg-[#FFF7ED]">The Difference</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="font-medium text-[#27272A]">{row.metric}</td>
                  <td>{row.stock}</td>
                  <td>{row.watkins}</td>
                  <td className="blp-highlight">{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="blp-body-text text-center max-w-3xl mx-auto">
          Would you invest $4,000 to make an additional $396,000 in gross profit on a single project? That&apos;s the
          power of design distinction. It&apos;s not an expense; it&apos;s{" "}
          <span className="font-semibold text-[#EA580C]">a multiplier for your revenue and your reputation</span>.
        </p>
      </div>
    </AnimatedSection>
  );
};

// Section 6: Process
const ProcessSection = () => {
  const steps = [
    {
      num: "01",
      title: "Explore the Collection",
      desc: "Browse our curated Signature Collection of proven, market-tested luxury designs. Find the one that aligns with your project vision and client profile.",
    },
    {
      num: "02",
      title: "Strategic Consultation",
      desc: "Every plan purchase includes a 90-minute consultation. We'll review your specific lot, your client's needs, and make strategic modifications.",
    },
    {
      num: "03",
      title: "Receive Complete Plans",
      desc: "Get a full set of professional, builder-ready architectural plans. Detailed, clear, and complete\u2014designed to minimize errors.",
    },
    {
      num: "04",
      title: "Build with Confidence",
      desc: "Construct a home that stands apart from the competition. Enjoy a smoother build, fewer change orders, and a premium price.",
    },
  ];

  return (
    <AnimatedSection className="blp-section bg-[#27272A]" id="process">
      <div className="blp-container">
        <h2 className="blp-heading-h2 text-white text-center mb-16">
          A Proven Process for Predictable Excellence.
        </h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="blp-process-step" variants={fadeInUp}>
              <span className="blp-process-number text-white/10">{step.num}</span>
              <h3 className="blp-heading-h3 text-white mb-3 -mt-4">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Section 7: Testimonials
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "David's designs are our secret weapon. We were stuck competing with every other builder in Aspen. With our first Watkins-designed home, we sold it for 25% more than our previous projects, and we had a waiting list for the next one. We don't build anything else now.",
      name: "John T.",
      title: "Founder, Aspen Peak Homes",
      image: "https://images.unsplash.com/photo-1652772589253-c1ab2308fbf4?crop=entropy&cs=srgb&fm=jpg&w=150&q=80",
    },
    {
      quote:
        "The level of detail in these plans is unlike anything I've seen. My framing crew made zero errors. We had almost no change orders related to design. That saved me at least $50,000 and two months on the project timeline. The ROI is a no-brainer.",
      name: "Maria G.",
      title: "CEO, Sterling Custom Builds",
      image: "https://images.unsplash.com/photo-1650100689950-966e8ed82230?crop=entropy&cs=srgb&fm=jpg&w=150&q=80",
    },
    {
      quote:
        "Our clients can see the difference immediately. The way the light fills the rooms, the flow of the space... it just feels different. We're no longer selling houses; we're selling a vision. And that vision is created by David Watkins.",
      name: "Sam R.",
      title: "President, Coastal Legacy Homes",
      image: "https://images.unsplash.com/photo-1601310721867-15e1a5493360?crop=entropy&cs=srgb&fm=jpg&w=150&q=80",
    },
  ];

  return (
    <AnimatedSection className="blp-section">
      <div className="blp-container">
        <h2 className="blp-heading-h2 text-center mb-12">Don&apos;t Just Take Our Word For It.</h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} className="blp-testimonial-card" variants={fadeInUp}>
              <p className="blp-testimonial-quote">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-[#27272A]">{testimonial.name}</p>
                  <p className="text-sm text-[#52525B]">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Section 8: The Offer
const OfferSection = () => {
  const includes = [
    "Full Architectural Plan Set: Complete, builder-ready plans for any design in our Signature Collection.",
    "90-Minute Site-Specific Consultation: We'll work with you to adapt the design to your lot, views, and client needs.",
    "Professional Detailing: Plans honed over 30 years and 400+ builds to ensure clarity and reduce rework.",
    "Portfolio-Grade Credibility: Leverage our stunning portfolio to help sell the vision to your clients.",
    "Direct Access: You get my personal email and phone number for support during the build.",
  ];

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]">
      <div className="blp-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="blp-heading-h2 mb-4">The Signature Collection Partnership</h2>
            <p className="blp-body-large">This isn&apos;t a one-time transaction; it&apos;s the start of a partnership.</p>
          </div>

          <div className="bg-white rounded-[16px] p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-[#E4E4E7]">
              <div>
                <p className="text-sm font-medium text-[#52525B] mb-1">Your Investment</p>
                <p className="text-4xl font-bold text-[#27272A]" style={{ fontFamily: "Manrope, sans-serif" }}>
                  $3,995
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="blp-btn-primary mt-4 md:mt-0">Get Started Today</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="blp-heading-h3">Start Your Partnership</DialogTitle>
                  </DialogHeader>
                  <LeadCaptureForm />
                </DialogContent>
              </Dialog>
            </div>

            <h3 className="blp-heading-h3 mb-6">What&apos;s Included:</h3>
            <ul className="space-y-4">
              {includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFF7ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#EA580C]" />
                  </div>
                  <span className="blp-body-text">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-[#E4E4E7]">
              <p className="blp-body-text">
                Ready for a deeper partnership? We offer{" "}
                <span className="font-semibold text-[#27272A]">Preferred and Exclusive tiers</span> for builders who
                want to dominate their market.
                <a href="#contact" className="text-[#EA580C] hover:underline ml-1">
                  Learn about our Partnership Programs
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 9: About
const AboutSection = () => {
  return (
    <AnimatedSection className="blp-section" id="about">
      <div className="blp-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
              alt="David Watkins - Architect"
              className="blp-rounded-image w-full h-auto"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="blp-heading-h2 mb-6">Your Partner in Design Mastery.</h2>
            <div className="blp-body-text space-y-4">
              <p>
                For 30 years, I&apos;ve had a single focus: designing homes. Not office buildings, not retail centers,
                not hospitals. Just homes. This singular obsession has allowed me to design over 400 luxury residences
                across America and refine a process that delivers both breathtaking beauty and practical buildability.
              </p>
              <p>
                I&apos;m not a typical architect; I started my career with hands-on construction experience. I
                understand your challenges because I&apos;ve lived them.
              </p>
              <p className="font-semibold text-[#27272A]">
                My goal is to be your most valuable partner&mdash;the one who provides the strategic design asset that
                makes your business more profitable, more reputable, and more successful.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-[#EA580C]" style={{ fontFamily: "Manrope, sans-serif" }}>
                  400+
                </p>
                <p className="text-sm text-[#52525B]">Homes Designed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#EA580C]" style={{ fontFamily: "Manrope, sans-serif" }}>
                  30
                </p>
                <p className="text-sm text-[#52525B]">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#EA580C]" style={{ fontFamily: "Manrope, sans-serif" }}>
                  50+
                </p>
                <p className="text-sm text-[#52525B]">Markets Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Section 10: FAQ
const FAQSection = () => {
  const faqs = [
    {
      question: "Why not just use stock plans for a fraction of the cost?",
      answer:
        "Because stock plans lead to stock homes, which compete on price. Our designs are for builders who want to compete on excellence. The $3,500 difference in plan cost is recouped 100-fold by the 20-40% premium you'll command on the final sale price.",
    },
    {
      question: "I already have an architect. Why do I need you?",
      answer:
        "Most architects are generalists. I am a residential specialist with 30 years and 400+ homes of focused experience. I've solved the unique challenges of luxury residential design hundreds of times. My plans aren't just drawings; they are proven, market-tested business tools.",
    },
    {
      question: "What if my client wants significant changes?",
      answer:
        "That's what the 90-minute consultation is for. We work together to make the design perfect for your client and site. If the changes are substantial, it may evolve into a Bespoke Design project, but for most clients, the Signature Collection provides the perfect, customizable foundation.",
    },
    {
      question: "How do I know these designs will sell in my specific market?",
      answer:
        "The principles of great design\u2014natural light, intelligent flow, emotional impact\u2014are universal. My portfolio spans from the mountains of Colorado to the coasts of the Carolinas. Great design sells everywhere. We'll choose a plan and make modifications that perfectly suit your regional aesthetic.",
    },
  ];

  return (
    <AnimatedSection className="blp-section bg-[#F4F4F5]" id="faq">
      <div className="blp-container">
        <h2 className="blp-heading-h2 text-center mb-12">Frequently Asked Questions</h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
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
          Ready to Build a Reputation, Not Just More Houses?
        </motion.h2>
        <motion.p
          className="blp-body-large text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Stop competing and start commanding the prices you deserve. Let&apos;s partner to create the most
          sought-after homes in your market.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <button className="blp-cta-btn-primary">Schedule Your Free Builder Strategy Call</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="blp-heading-h3">Schedule Your Strategy Call</DialogTitle>
              </DialogHeader>
              <LeadCaptureForm />
            </DialogContent>
          </Dialog>
          <button className="blp-cta-btn-secondary">Explore the Signature Collection Now</button>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const BuilderFooter = () => {
  return (
    <footer className="py-12 border-t border-[#E4E4E7]">
      <div className="blp-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1">
            <span
              className="font-bold text-lg tracking-tight text-[#27272A]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              HOUSE <span className="text-xs font-normal">OF</span> WATKINS
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#52525B]">
            <a href="#" className="hover:text-[#27272A] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#27272A] transition-colors">
              Terms of Service
            </a>
            <a
              href="mailto:info@houseofwatkins.com"
              className="hover:text-[#27272A] transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> info@houseofwatkins.com
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-[#A1A1AA]">
          &copy; {new Date().getFullYear()} House of Watkins. All rights reserved.
        </div>
      </div>
    </footer>
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
export default function BuilderLandingPage() {
  return (
    <div className="builder-landing" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <PortfolioSection />
        <ROISection />
        <ProcessSection />
        <TestimonialsSection />
        <OfferSection />
        <AboutSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <BuilderFooter />
      <ScrollToTop />
    </div>
  );
}
