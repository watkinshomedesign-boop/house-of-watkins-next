"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";

type ExpandedLine = { label: string; amount: string };

type ExpandedItem = {
  name: string;
  qty: number;
  rows: ExpandedLine[];
};

type SelectOption = { value: string; label: string };

const COUNTRY_CODES: string[] = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
];

const US_STATES: SelectOption[] = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function OrderingPage() {
  const cart = useCart();

  const [builderCode, setBuilderCode] = useState("");
  const quoteItems = useMemo(() => cartToCheckoutItems(cart.items), [cart.items]);

  const [quoteSubtotal, setQuoteSubtotal] = useState("$ 0.00");
  const [quoteTotal, setQuoteTotal] = useState("$ 0.00");
  const [quoteItemsExpanded, setQuoteItemsExpanded] = useState<ExpandedItem[]>([]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("US");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [unit, setUnit] = useState("");

  const [cardEmail, setCardEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [termsHtml, setTermsHtml] = useState<string>("");
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsScrolledToEnd, setTermsScrolledToEnd] = useState(false);
  const termsScrollRef = useRef<HTMLDivElement | null>(null);
  const termsPrefetchStartedRef = useRef(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showThankYou, setShowThankYou] = useState(false);

  // Preload Terms HTML in the background so opening the modal feels instant.
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (termsPrefetchStartedRef.current) return;
      termsPrefetchStartedRef.current = true;
      if (termsHtml) return;
      setTermsLoading(true);
      setTermsError(null);
      try {
        const res = await fetch("/api/terms", { method: "GET" });
        const json = (await res.json()) as any;
        if (cancelled) return;
        if (!res.ok) {
          setTermsError(String(json?.error ?? "Failed to load terms"));
          return;
        }
        setTermsHtml(String(json?.html ?? ""));
      } catch (e: any) {
        if (!cancelled) setTermsError(String(e?.message ?? "Failed to load terms"));
      } finally {
        if (!cancelled) setTermsLoading(false);
      }
    }

    // Let the page render first, then warm the cache.
    const id = window.setTimeout(run, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!termsOpen) return;
      if (termsHtml) return;
      if (termsLoading) return;

      setTermsLoading(true);
      setTermsError(null);
      try {
        const res = await fetch("/api/terms", { method: "GET" });
        const json = (await res.json()) as any;
        if (cancelled) return;
        if (!res.ok) {
          setTermsError(String(json?.error ?? "Failed to load terms"));
          return;
        }
        setTermsHtml(String(json?.html ?? ""));
      } catch (e: any) {
        if (!cancelled) setTermsError(String(e?.message ?? "Failed to load terms"));
      } finally {
        if (!cancelled) setTermsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [termsOpen, termsHtml, termsLoading]);

  useEffect(() => {
    if (!termsOpen) return;
    setTermsScrolledToEnd(false);
    setTimeout(() => {
      const el = termsScrollRef.current;
      if (el) el.scrollTop = 0;
    }, 0);
  }, [termsOpen]);

  useEffect(() => {
    setBuilderCode(getStoredBuilderCode());

    function onChange() {
      setBuilderCode(getStoredBuilderCode());
    }

    window.addEventListener("moss_builder_code_changed", onChange);
    return () => window.removeEventListener("moss_builder_code_changed", onChange);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success === "1") {
      setShowThankYou(true);
      cart.clearCart();
    }
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const token = String(params.get("token") || "").trim();
    const payerId = String(params.get("PayerID") || params.get("payerId") || "").trim();

    async function run() {
      if (!token || !payerId) return;
      if (cancelled) return;

      try {
        setSubmitting(true);
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: token }),
        });
        const json = (await res.json()) as any;
        if (!res.ok) {
          setSubmitError(String(json?.error ?? "PayPal capture failed"));
          return;
        }

        cart.clearCart();
        const next = new URL(window.location.href);
        next.searchParams.delete("token");
        next.searchParams.delete("PayerID");
        next.searchParams.delete("payerId");
        next.searchParams.delete("paymentId");
        next.searchParams.set("success", "1");
        window.location.replace(next.toString());
      } catch (e: any) {
        setSubmitError(String(e?.message ?? "PayPal capture failed"));
      } finally {
        setSubmitting(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [cart]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (quoteItems.length === 0) {
        setQuoteSubtotal("$ 0.00");
        setQuoteTotal("$ 0.00");
        setQuoteItemsExpanded([]);
        return;
      }

      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: quoteItems, builderCode }),
        });
        const data = (await res.json()) as any;
        if (cancelled) return;

        setQuoteSubtotal(String(data?.formatted?.subtotal ?? "$ 0.00"));
        setQuoteTotal(String(data?.formatted?.total ?? "$ 0.00"));

        const itemsAny = Array.isArray(data?.items) ? data.items : [];
        const expanded: ExpandedItem[] = itemsAny.map((it: any) => {
          const qty = Math.max(1, Number(it?.qty ?? 1) || 1);
          const lineItems = Array.isArray(it?.lineItems) ? it.lineItems : [];
          return {
            name: String(it?.name ?? ""),
            qty,
            rows: lineItems.map((li: any) => ({
              label: String(li?.label ?? ""),
              amount: formatUsdFromCents(Number(li?.amountCents ?? 0) * qty),
            })),
          };
        });
        setQuoteItemsExpanded(expanded);
      } catch {
        if (cancelled) return;
        setQuoteSubtotal("$ 0.00");
        setQuoteTotal("$ 0.00");
        setQuoteItemsExpanded([]);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [quoteItems, builderCode]);

  const countryOptions = useMemo<SelectOption[]>(
    () => {
      const display = typeof Intl !== "undefined" && (Intl as any).DisplayNames
        ? new (Intl as any).DisplayNames(["en"], { type: "region" })
        : null;

      const opts = COUNTRY_CODES.map((code) => ({
        value: code,
        label: code === "US" ? "USA" : String(display?.of?.(code) ?? code),
      }));

      opts.sort((a, b) => a.label.localeCompare(b.label));
      return opts;
    },
    []
  );

  const selectArrowStyle = useMemo(
    () => ({
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27%3E%3Cpath d=%27M6 8l4 4 4-4%27 stroke=%27%236b7280%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 15px center",
      backgroundSize: "14px 14px",
    }),
    []
  );

  const stateOptionsByCountry = useMemo<Record<string, SelectOption[]>>(
    () => ({
      BY: [
        { value: "minsk", label: "Minsk" },
        { value: "brest", label: "Brest" },
        { value: "gomel", label: "Gomel" },
        { value: "grodno", label: "Grodno" },
        { value: "mogilev", label: "Mogilev" },
        { value: "vitebsk", label: "Vitebsk" },
      ],
      CA: [
        { value: "on", label: "Ontario" },
        { value: "bc", label: "British Columbia" },
        { value: "ab", label: "Alberta" },
        { value: "qc", label: "Quebec" },
      ],
      US: US_STATES,
      DE: [
        { value: "be", label: "Berlin" },
        { value: "by", label: "Bavaria" },
        { value: "nw", label: "North Rhine-Westphalia" },
        { value: "he", label: "Hesse" },
      ],
      UA: [
        { value: "kyiv", label: "Kyiv" },
        { value: "lviv", label: "Lviv" },
        { value: "odesa", label: "Odesa" },
        { value: "kharkiv", label: "Kharkiv" },
      ],
      UK: [
        { value: "england", label: "England" },
        { value: "scotland", label: "Scotland" },
        { value: "wales", label: "Wales" },
        { value: "ni", label: "Northern Ireland" },
      ],
    }),
    []
  );

  const stateOptions = useMemo<SelectOption[]>(() => stateOptionsByCountry[country] ?? [], [country, stateOptionsByCountry]);

  useEffect(() => {
    setStateVal("");
    setCity("");
  }, [country]);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function placeOrder() {
    setSubmitError(null);

    if (quoteItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    if (!agreeTerms) {
      setSubmitError("Please agree to the terms and conditions.");
      return;
    }

    if (!email.trim() || !isValidEmail(email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    // Option A: PayPal redirect (when selected)
    if (paymentMethod === "paypal") {
      setSubmitting(true);
      try {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            items: quoteItems,
            builderCode,
            returnUrl: `${window.location.origin}/ordering`,
            cancelUrl: `${window.location.origin}/ordering`,
          }),
        });

        const data = (await res.json()) as any;
        if (!res.ok) {
          setSubmitError(String(data?.error ?? "PayPal checkout failed"));
          return;
        }

        const approvalUrl = String(data?.approvalUrl ?? "").trim();
        if (approvalUrl) {
          window.location.href = approvalUrl;
          return;
        }

        setSubmitError("PayPal checkout failed");
      } catch (e: any) {
        setSubmitError(String(e?.message ?? "PayPal checkout failed"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Option B: Stripe Checkout redirect
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          items: quoteItems,
          builderCode,
          successUrl: `${window.location.origin}/ordering?success=1`,
          cancelUrl: `${window.location.origin}/ordering?canceled=1`,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        setSubmitError(String(data?.error ?? "Checkout failed"));
        return;
      }

      if (data?.url) {
        window.location.href = String(data.url);
        return;
      }

      setSubmitError("Checkout failed");
    } catch (e: any) {
      setSubmitError(String(e?.message ?? "Checkout failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const showTopError = Boolean(submitError);

  return (
    <main className="w-full bg-[#FAF9F7] text-zinc-800">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-14">
        <div className="pt-6 md:pt-4">
          <Breadcrumb currentLabel="Ordering" currentHref="/ordering" />
        </div>

        <div className="pb-20 md:pb-24">
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[1fr_460px] md:gap-12">
            <section>
              <h1 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Billing Details</h1>

              {showTopError ? (
                <div className="mt-4 text-[13px] text-red-600">{submitError}</div>
              ) : null}

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Email address <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Phone <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    First name <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Last name <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block md:col-span-2">
                  <div className="text-[12px] font-semibold text-neutral-900">Company name (optional)</div>
                  <input
                    type="text"
                    placeholder="Enter the name of your company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Country/Region <span className="text-red-500">*</span>
                  </div>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={selectArrowStyle as any}
                    className="mt-2 h-11 w-full appearance-none rounded-full border border-stone-200 bg-white pl-5 pr-[40px] text-[13px] outline-none"
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    State <span className="text-red-500">*</span>
                  </div>
                  <select
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    style={selectArrowStyle as any}
                    className="mt-2 h-11 w-full appearance-none rounded-full border border-stone-200 bg-white pl-5 pr-[40px] text-[13px] outline-none"
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Town/City <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter town or city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Street address <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Zip code <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Unit <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Unit number"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                  />
                </label>
              </div>
            </section>

            <aside>
              <h2 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Your Order</h2>

              <div className="mt-6 rounded-[32px] bg-[#F7F3EE] p-8">
                <div className="flex items-center justify-between text-[14px] font-semibold text-neutral-900">
                  <div>Product</div>
                  <div>Subtotal</div>
                </div>

                <div className="mt-4 space-y-4">
                  {quoteItemsExpanded.map((it, idx) => {
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="text-[12px] font-semibold text-neutral-900">{it.name}</div>
                        <div className="space-y-2">
                          {it.rows.map((r, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between text-[12px] text-neutral-700">
                              <div className="pr-4">{r.label}</div>
                              <div className="shrink-0">{r.amount}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 h-px w-full bg-stone-200" />

                <div className="mt-4 flex items-center justify-between text-[13px] font-semibold text-neutral-900">
                  <div>Subtotal</div>
                  <div>{quoteSubtotal}</div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[16px] font-semibold text-neutral-900">
                  <div>Total</div>
                  <div>{quoteTotal}</div>
                </div>

                <div className="mt-6 h-px w-full bg-stone-200" />

                <div className="mt-6 space-y-4">
                  <label className="flex items-center gap-3 text-[13px] text-neutral-900">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="h-4 w-4 accent-orange-600"
                    />
                    <span>Credit / Debit Card</span>
                  </label>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4 pl-7">
                      <div className="text-[11px] text-neutral-600">
                        Secure, 1-click checkout with <span className="text-orange-600">Link</span>
                      </div>

                      <label className="block">
                        <div className="text-[12px] font-semibold text-neutral-900">
                          Email <span className="text-red-500">*</span>
                        </div>
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          value={cardEmail}
                          onChange={(e) => setCardEmail(e.target.value)}
                          className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                        />
                      </label>

                      <label className="block">
                        <div className="text-[12px] font-semibold text-neutral-900">
                          Card number <span className="text-red-500">*</span>
                        </div>
                        <input
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="1111 1111 1111 1111"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                          <div className="text-[12px] font-semibold text-neutral-900">
                            Expiration date <span className="text-red-500">*</span>
                          </div>
                          <input
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                          />
                        </label>

                        <label className="block">
                          <div className="text-[12px] font-semibold text-neutral-900">
                            Security code <span className="text-red-500">*</span>
                          </div>
                          <input
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}

                  <label className="flex items-center gap-3 text-[13px] text-neutral-900">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="h-4 w-4 accent-orange-600"
                    />
                    <span className="font-semibold text-[#003087]">PayPal</span>
                  </label>
                </div>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-orange-600 text-[13px] font-semibold uppercase tracking-[0.15px] text-white disabled:opacity-50"
                  >
                    {submitting ? "Redirecting..." : "Place Order"}
                  </button>
                </div>

                <label className="mt-5 flex items-start gap-3 text-[12px] text-neutral-700">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={!termsAccepted}
                    className="mt-[2px] h-4 w-4 accent-orange-600"
                  />
                  <span>
                    I have read and agree to the website{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitError(null);
                        setTermsOpen(true);
                      }}
                      className="text-orange-600"
                    >
                      terms and conditions
                    </button>
                  </span>
                </label>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {termsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-3xl rounded-[24px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="text-[14px] font-semibold text-neutral-900">Terms and Conditions</div>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-5 pt-4">
              <div
                ref={termsScrollRef}
                className="max-h-[60vh] overflow-y-auto rounded-[18px] border border-stone-200 bg-white p-4 text-[13px] leading-6 text-neutral-800"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
                  if (nearBottom) setTermsScrolledToEnd(true);
                }}
              >
                {termsLoading ? (
                  <div className="text-[13px] text-neutral-600">Loading…</div>
                ) : termsError ? (
                  <div className="text-[13px] text-red-600">{termsError}</div>
                ) : (
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: termsHtml }} />
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[12px] text-neutral-600">
                  Scroll to the bottom to enable agreement.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAccepted(true);
                    setTermsOpen(false);
                  }}
                  disabled={!termsScrolledToEnd}
                  className="flex h-11 items-center justify-center rounded-full bg-orange-600 px-8 text-[13px] font-semibold uppercase tracking-[0.15px] text-white disabled:opacity-50"
                >
                  I agree
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showThankYou ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-[24px] bg-white p-8 text-center shadow-xl">
            <button
              type="button"
              onClick={() => setShowThankYou(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-orange-600">
              <svg viewBox="0 0 24 24" className="h-9 w-9 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11l9-8 9 8" />
                <path d="M5 10v10h14V10" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </div>

            <div className="mt-6 text-[22px] font-semibold text-neutral-900">Thank you for your order!</div>
            <div className="mt-3 text-[13px] leading-5 text-neutral-600">
              We’ve received your order and we’ll be in touch very soon to go over the details together. If you have any questions
              in the meantime, don’t hesitate to reach out — we’re here for you.
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full bg-orange-600 px-10 text-[13px] font-semibold uppercase tracking-[0.15px] text-white"
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
