"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";
import { cn } from "@/lib/utils";
import { gtmPush } from "@/lib/gtm";

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

const RequiredMark = () => (
  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M3.136 0C3.164 0 3.18733 0.00466661 3.206 0.0139998C3.234 0.0139998 3.262 0.0139998 3.29 0.0139998C3.43933 0.042 3.57467 0.107333 3.696 0.21C3.81733 0.312667 3.878 0.443333 3.878 0.602C3.878 0.732667 3.85933 0.882 3.822 1.05C3.78467 1.20867 3.72867 1.386 3.654 1.582C3.598 1.73133 3.56067 1.84333 3.542 1.918C3.52333 1.99267 3.50467 2.06267 3.486 2.128C3.486 2.13733 3.486 2.14667 3.486 2.156C3.486 2.156 3.486 2.16067 3.486 2.17C3.47667 2.198 3.46733 2.23067 3.458 2.268C3.458 2.296 3.45333 2.32867 3.444 2.366C3.444 2.37533 3.43933 2.38933 3.43 2.408C3.43 2.42667 3.43 2.44067 3.43 2.45C3.42067 2.46867 3.416 2.48733 3.416 2.506C3.416 2.51533 3.416 2.52933 3.416 2.548C3.416 2.548 3.416 2.55267 3.416 2.562C3.416 2.57133 3.416 2.576 3.416 2.576C3.42533 2.58533 3.43 2.59467 3.43 2.604C3.43933 2.61333 3.444 2.62267 3.444 2.632C3.5 2.61333 3.57467 2.58067 3.668 2.534C3.76133 2.48733 3.85467 2.436 3.948 2.38C3.976 2.37067 3.99933 2.35667 4.018 2.338C4.046 2.31933 4.074 2.30533 4.102 2.296C4.158 2.25867 4.214 2.22133 4.27 2.184C4.326 2.14667 4.37267 2.114 4.41 2.086C4.42867 2.06733 4.44733 2.04867 4.466 2.03C4.494 2.01133 4.522 1.99267 4.55 1.974C4.64333 1.89933 4.74133 1.82933 4.844 1.764C4.956 1.69867 5.068 1.666 5.18 1.666H5.32C5.59067 1.666 5.796 1.75 5.936 1.918C6.076 2.07667 6.146 2.268 6.146 2.492C6.146 2.688 6.08533 2.83267 5.964 2.926C5.852 3.01 5.72133 3.066 5.572 3.094C5.50667 3.10333 5.44133 3.11267 5.376 3.122C5.31067 3.122 5.25 3.122 5.194 3.122H5.054C5.01667 3.122 4.97933 3.122 4.942 3.122C4.90467 3.122 4.86733 3.11733 4.83 3.108C4.79267 3.108 4.75533 3.108 4.718 3.108C4.68067 3.108 4.64333 3.108 4.606 3.108C4.59667 3.108 4.58267 3.108 4.564 3.108C4.55467 3.108 4.54533 3.108 4.536 3.108C4.51733 3.108 4.50333 3.108 4.494 3.108C4.48467 3.108 4.47067 3.108 4.452 3.108C4.43333 3.108 4.41 3.108 4.382 3.108C4.36333 3.108 4.34467 3.108 4.326 3.108C4.31667 3.108 4.30267 3.108 4.284 3.108C4.26533 3.108 4.25133 3.108 4.242 3.108C4.214 3.108 4.186 3.11267 4.158 3.122C4.13 3.122 4.102 3.122 4.074 3.122C3.97133 3.13133 3.878 3.15 3.794 3.178C3.71 3.19667 3.668 3.23867 3.668 3.304C3.668 3.35067 3.71 3.42067 3.794 3.514C3.878 3.598 3.98067 3.68667 4.102 3.78C4.12067 3.79867 4.13933 3.81733 4.158 3.836C4.186 3.85467 4.20933 3.87333 4.228 3.892C4.312 3.95733 4.38667 4.018 4.452 4.074C4.52667 4.13 4.592 4.17667 4.648 4.214C4.65733 4.214 4.662 4.21867 4.662 4.228C4.67133 4.228 4.68067 4.23267 4.69 4.242C4.83933 4.34467 4.97467 4.45667 5.096 4.578C5.21733 4.69933 5.278 4.858 5.278 5.054C5.278 5.09133 5.27333 5.138 5.264 5.194C5.25467 5.25 5.24067 5.30133 5.222 5.348C5.18467 5.46 5.11933 5.56267 5.026 5.656C4.942 5.74 4.82067 5.782 4.662 5.782H4.522C4.25133 5.782 4.05067 5.70733 3.92 5.558C3.78933 5.40867 3.69133 5.24533 3.626 5.068C3.60733 5.02133 3.58867 4.97 3.57 4.914C3.56067 4.858 3.54667 4.80667 3.528 4.76C3.528 4.74133 3.50933 4.68067 3.472 4.578C3.444 4.466 3.40667 4.34467 3.36 4.214C3.332 4.13933 3.29933 4.06933 3.262 4.004C3.234 3.92933 3.206 3.864 3.178 3.808C3.15933 3.78933 3.14067 3.77067 3.122 3.752C3.11267 3.724 3.09867 3.70533 3.08 3.696C3.04267 3.724 2.98667 3.81733 2.912 3.976C2.83733 4.12533 2.73 4.424 2.59 4.872C2.58067 4.89067 2.57133 4.90933 2.562 4.928C2.562 4.94667 2.55733 4.96533 2.548 4.984C2.48267 5.18 2.38467 5.362 2.254 5.53C2.13267 5.698 1.92267 5.782 1.624 5.782H1.484C1.30667 5.782 1.15733 5.712 1.036 5.572C0.924 5.432 0.868 5.25933 0.868 5.054C0.868 4.89533 0.905333 4.76467 0.98 4.662C1.064 4.55 1.16667 4.44733 1.288 4.354C1.35333 4.30733 1.42333 4.26067 1.498 4.214C1.57267 4.158 1.64733 4.102 1.722 4.046C2.10467 3.77533 2.32867 3.58867 2.394 3.486C2.45933 3.374 2.492 3.31333 2.492 3.304C2.492 3.29467 2.492 3.29 2.492 3.29C2.492 3.28067 2.48733 3.27133 2.478 3.262C2.45933 3.22467 2.38467 3.192 2.254 3.164C2.12333 3.136 1.87133 3.11733 1.498 3.108C1.47933 3.108 1.46067 3.108 1.442 3.108C1.42333 3.108 1.40933 3.108 1.4 3.108C1.39067 3.108 1.38133 3.108 1.372 3.108C1.36267 3.108 1.35333 3.108 1.344 3.108C1.316 3.11733 1.28333 3.122 1.246 3.122C1.20867 3.122 1.162 3.122 1.106 3.122H0.966C0.966 3.122 0.961333 3.122 0.952 3.122C0.905333 3.122 0.84 3.122 0.756 3.122C0.681333 3.11267 0.597333 3.09867 0.504 3.08C0.382667 3.052 0.266 2.996 0.154 2.912C0.0513333 2.81867 0 2.67867 0 2.492C0 2.212 0.0886667 2.002 0.266 1.862C0.443333 1.71267 0.634667 1.638 0.84 1.638H0.98C1.08267 1.638 1.18533 1.67067 1.288 1.736C1.4 1.80133 1.50267 1.876 1.596 1.96C1.61467 1.96933 1.63333 1.98333 1.652 2.002C1.67067 2.01133 1.68933 2.02533 1.708 2.044C1.74533 2.072 1.79667 2.10933 1.862 2.156C1.93667 2.20267 2.02067 2.254 2.114 2.31C2.15133 2.32867 2.184 2.34733 2.212 2.366C2.24933 2.38467 2.28667 2.40333 2.324 2.422C2.39867 2.45933 2.46867 2.492 2.534 2.52C2.60867 2.548 2.674 2.57133 2.73 2.59L2.744 2.562C2.744 2.54333 2.744 2.52933 2.744 2.52C2.744 2.50133 2.73933 2.48267 2.73 2.464C2.73 2.44533 2.72533 2.42667 2.716 2.408C2.716 2.38933 2.716 2.37533 2.716 2.366C2.70667 2.31933 2.69733 2.27733 2.688 2.24C2.67867 2.19333 2.674 2.15133 2.674 2.114C2.66467 2.09533 2.65533 2.07667 2.646 2.058C2.646 2.03933 2.646 2.02067 2.646 2.002C2.62733 1.92733 2.604 1.848 2.576 1.764C2.548 1.68 2.51067 1.568 2.464 1.428C2.41733 1.26933 2.37533 1.12 2.338 0.98C2.31 0.84 2.296 0.709333 2.296 0.588C2.296 0.448 2.338 0.336 2.422 0.252C2.506 0.168 2.59933 0.102667 2.702 0.0560001C2.758 0.0373337 2.80933 0.0233336 2.856 0.0139998C2.912 0.00466661 2.95867 0 2.996 0H3.136Z" fill="#FF0808"/>
  </svg>
);

type CardType = "visa" | "mastercard" | "amex" | "discover" | null;

const detectCardType = (digits: string): CardType => {
  if (!digits) return null;
  if (/^4/.test(digits)) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^(6011|622|64[4-9]|65)/.test(digits)) return "discover";
  return null;
};

const formatCardNumber = (raw: string, type: CardType): string => {
  const digits = raw.replace(/\D/g, "");
  if (type === "amex") {
    const d = digits.slice(0, 15);
    if (d.length <= 4) return d;
    if (d.length <= 10) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 10)} ${d.slice(10)}`;
  }
  const d = digits.slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

const CardBrandIcon = ({ type }: { type: CardType }) => {
  if (type === "visa") return (
    <svg className="ml-2 shrink-0" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="27" height="18" rx="2" fill="#1434CB" />
      <text x="13.5" y="13" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text>
    </svg>
  );
  if (type === "mastercard") return (
    <svg className="ml-2 shrink-0" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="27" height="18" rx="2" fill="#252525" />
      <circle cx="10" cy="9" r="5.5" fill="#EB001B" />
      <circle cx="17" cy="9" r="5.5" fill="#F79E1B" />
      <path d="M13.5 4.9A5.5 5.5 0 0 1 17 9a5.5 5.5 0 0 1-3.5 4.1A5.5 5.5 0 0 1 10 9a5.5 5.5 0 0 1 3.5-4.1z" fill="#FF5F00" />
    </svg>
  );
  if (type === "amex") return (
    <svg className="ml-2 shrink-0" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="27" height="18" rx="2" fill="#016FD0" />
      <text x="13.5" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
    </svg>
  );
  if (type === "discover") return (
    <svg className="ml-2 shrink-0" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="27" height="18" rx="2" fill="#231F20" />
      <circle cx="20" cy="9" r="6" fill="#F76F20" />
      <text x="7" y="13" fill="white" fontSize="5.5" fontWeight="bold" fontFamily="Arial, sans-serif">DIS</text>
    </svg>
  );
  return (
    <svg className="ml-2 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#8f8e8c" strokeWidth="1.5" />
      <path d="M2 10h20" stroke="#8f8e8c" strokeWidth="1.5" />
      <rect x="5" y="13" width="4" height="2" rx="0.5" fill="#8f8e8c" />
    </svg>
  );
};

export function OrderingPage() {
  const cart = useCart();

  const [enableDisplayNames, setEnableDisplayNames] = useState(false);

  const [builderCode, setBuilderCode] = useState("");
  const quoteItems = useMemo(() => cartToCheckoutItems(cart.items), [cart.items]);

  const [quoteSubtotal, setQuoteSubtotal] = useState("$ 0.00");
  const [quoteTotal, setQuoteTotal] = useState("$ 0.00");
  const [quoteItemsExpanded, setQuoteItemsExpanded] = useState<ExpandedItem[]>([]);
  const [quoteItemsVisible, setQuoteItemsVisible] = useState(false);

  useEffect(() => {
    if (quoteItemsExpanded.length > 0) {
      requestAnimationFrame(() => setQuoteItemsVisible(true));
    } else {
      setQuoteItemsVisible(false);
    }
  }, [quoteItemsExpanded.length]);

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
  const [cardType, setCardType] = useState<CardType>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [termsCheckError, setTermsCheckError] = useState(false);
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
  const submitErrorRef = useRef<HTMLDivElement | null>(null);
  const orderSummaryRef = useRef<HTMLElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const termsCheckboxRef = useRef<HTMLInputElement | null>(null);
  const lastErrorTargetRef = useRef<"cart" | "email" | "terms" | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

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
    setEnableDisplayNames(true);
  }, []);

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
      gtmPush({
        event: "purchase",
        ecommerce: {
          currency: "USD",
          items: cart.items.map((ci) => ({
            item_id: ci.slug,
            item_name: ci.name,
            item_variant: ci.license_type === "builder" ? "Builder License" : "Single Build License",
            quantity: ci.qty,
          })),
        },
      });
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
      const display =
        enableDisplayNames && typeof Intl !== "undefined" && (Intl as any).DisplayNames
          ? new (Intl as any).DisplayNames(["en"], { type: "region" })
          : null;

      const opts = COUNTRY_CODES.map((code) => ({
        value: code,
        label: code === "US" ? "USA" : String(display?.of?.(code) ?? code),
      }));

      opts.sort((a, b) => a.label.localeCompare(b.label));
      return opts;
    },
    [enableDisplayNames]
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

  function scrollToRef(el: HTMLElement | null, focus?: boolean) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (focus) {
      setTimeout(() => {
        try {
          el.focus();
        } catch {
          // ignore focus errors
        }
      }, 0);
    }
  }

  async function placeOrder() {
    setSubmitError(null);
    setFieldErrors({});

    if (quoteItems.length === 0) {
      lastErrorTargetRef.current = "cart";
      setSubmitError("Your cart is empty.");
      scrollToRef(orderSummaryRef.current);
      return;
    }

    const errors: Record<string, boolean> = {};
    if (!email.trim() || !isValidEmail(email.trim())) errors.email = true;
    if (!phone.trim()) errors.phone = true;
    if (!firstName.trim()) errors.firstName = true;
    if (!lastName.trim()) errors.lastName = true;
    if (!country.trim()) errors.country = true;
    if (!stateVal.trim()) errors.stateVal = true;
    if (!city.trim()) errors.city = true;
    if (!street.trim()) errors.street = true;
    if (!zip.trim()) errors.zip = true;
    if (!unit.trim()) errors.unit = true;

    if (paymentMethod === "card") {
      if (!cardEmail.trim() || !isValidEmail(cardEmail.trim())) errors.cardEmail = true;
      const rawCard = cardNumber.replace(/\s/g, "");
      const expectedCardLen = cardType === "amex" ? 15 : 16;
      if (!rawCard || rawCard.length !== expectedCardLen) errors.cardNumber = true;
      if (cardExpiry.length !== 7) errors.cardExpiry = true;
      const expectedCvcLen = cardType === "amex" ? 4 : 3;
      if (cardCvc.length !== expectedCvcLen) errors.cardCvc = true;
    }

    if (!agreeTerms) errors.terms = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError("Order not submitted. Please check the form.");
      if (errors.terms) {
        scrollToRef(termsCheckboxRef.current);
        if (!termsAccepted && Object.keys(errors).length === 1) {
          setTermsOpen(true);
        }
      }
      return;
    }

    // GTM: begin_checkout
    gtmPush({
      event: "begin_checkout",
      ecommerce: {
        currency: "USD",
        items: cart.items.map((ci) => ({
          item_id: ci.slug,
          item_name: ci.name,
          item_variant: ci.license_type === "builder" ? "Builder License" : "Single Build License",
          quantity: ci.qty,
        })),
      },
    });

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

  useEffect(() => {
    if (!submitError) return;
    if (lastErrorTargetRef.current) {
      lastErrorTargetRef.current = null;
      return;
    }
    const el = submitErrorRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitError]);

  return (
    <main className="w-full text-zinc-800">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-14">
        <div className="pt-6 md:pt-4">
          <Breadcrumb currentLabel="Ordering" currentHref="/ordering" />
        </div>

        <div className="pb-20 md:pb-24">
          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_520px] lg:gap-12">
            <section>
              <h1 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Billing Details</h1>

              {showTopError ? (
                <div ref={submitErrorRef} className="mt-4 font-gilroy text-[18px] font-semibold leading-[24px] text-[#ff3b3b]">
                  {submitError}
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2">
                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Email address</span>
                    <RequiredMark />
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.email ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.email && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Phone</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 Phone number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.phone ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.phone && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">First name</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.firstName ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.firstName && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Last name</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.lastName ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.lastName && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block md:col-span-2">
                  <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Company name (optional)</span>
                  <input
                    type="text"
                    placeholder="Enter the name of your company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 w-full rounded-full border border-[#e2ddda] bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Country/Region</span>
                    <RequiredMark />
                  </div>
                  <select
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); if (fieldErrors.country) setFieldErrors(prev => ({ ...prev, country: false })); }}
                    style={selectArrowStyle as any}
                    className={cn("mt-1 w-full appearance-none rounded-full border bg-white pl-[18px] pr-[40px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none", fieldErrors.country ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.country && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">State</span>
                    <RequiredMark />
                  </div>
                  {stateOptions.length > 0 ? (
                    <select
                      value={stateVal}
                      onChange={(e) => { setStateVal(e.target.value); if (fieldErrors.stateVal) setFieldErrors(prev => ({ ...prev, stateVal: false })); }}
                      style={selectArrowStyle as any}
                      className={cn("mt-1 w-full appearance-none rounded-full border bg-white pl-[18px] pr-[40px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none", fieldErrors.stateVal ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                    >
                      <option value="">Select state</option>
                      {stateOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter state / region"
                      value={stateVal}
                      onChange={(e) => { setStateVal(e.target.value); if (fieldErrors.stateVal) setFieldErrors(prev => ({ ...prev, stateVal: false })); }}
                      className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.stateVal ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                    />
                  )}
                  {fieldErrors.stateVal && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Town/City</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter town or city"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.city ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.city && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Street address</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    value={street}
                    onChange={(e) => { setStreet(e.target.value); if (fieldErrors.street) setFieldErrors(prev => ({ ...prev, street: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.street ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.street && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Zip code</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={zip}
                    onChange={(e) => { setZip(e.target.value); if (fieldErrors.zip) setFieldErrors(prev => ({ ...prev, zip: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.zip ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.zip && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Unit</span>
                    <RequiredMark />
                  </div>
                  <input
                    type="text"
                    placeholder="Unit number"
                    value={unit}
                    onChange={(e) => { setUnit(e.target.value); if (fieldErrors.unit) setFieldErrors(prev => ({ ...prev, unit: false })); }}
                    className={cn("mt-1 w-full rounded-full border bg-white px-[18px] py-[11px] font-gilroy text-[15px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]", fieldErrors.unit ? "border-[#ff3b3b]" : "border-[#e2ddda]")}
                  />
                  {fieldErrors.unit && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                </label>
              </div>
            </section>

            <aside ref={orderSummaryRef}>
              <h2 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Your Order</h2>

              <div className="mt-5 rounded-[40px] bg-[#FAF9F7] p-10">
                <div className="font-gilroy text-[18px] font-semibold leading-[24px] text-[#2b2a28]">
                  Product
                </div>

                <div className="mt-4 space-y-3">
                  {quoteItemsExpanded.map((it, idx) => {
                    return (
                      <div
                        key={idx}
                        className={cn("space-y-3 reveal", quoteItemsVisible && "reveal--visible")}
                        style={{ ["--reveal-delay" as string]: `${idx * 80}ms` }}
                      >
                        <div className="font-gilroy text-[15px] font-semibold leading-[22px] text-[#2b2a28]">{it.name}</div>
                        <div className="space-y-3">
                          {it.rows.map((r, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between font-gilroy text-[15px] font-normal leading-[22px] text-[#2b2a28]">
                              <div className="pr-4">{r.label}</div>
                              <div className="shrink-0">{r.amount}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 h-px w-full bg-stone-200" />

                <div className="mt-5 flex items-center justify-between font-gilroy text-[16px] font-semibold leading-[24px] text-[#2b2a28]">
                  <div>Subtotal</div>
                  <div>{quoteSubtotal}</div>
                </div>
                <div className="mt-5 flex items-center justify-between font-gilroy text-[20px] font-semibold leading-[30px] text-[#2b2a28]">
                  <div>Total</div>
                  <div>{quoteTotal}</div>
                </div>

                <div className="mt-5 h-px w-full bg-stone-200" />

                <div className="mt-5 space-y-4">
                  {/* Stripe / Card row */}
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[12px]",
                        paymentMethod === "card" ? "bg-[#ff5c02] p-[6px]" : "border border-[#e2ddda] bg-white"
                      )}>
                        {paymentMethod === "card" && <div className="h-3 w-3 rounded-full bg-white" />}
                      </div>
                      <svg width="52" height="22" viewBox="0 0 52 22" xmlns="http://www.w3.org/2000/svg">
                        <text x="0" y="16" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="500" fill="#635BFF">stripe</text>
                      </svg>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4.5" width="16" height="11" rx="2" stroke="#8f8e8c" strokeWidth="1.5" />
                        <path d="M2 9h16" stroke="#8f8e8c" strokeWidth="1.5" />
                        <rect x="4" y="12" width="4" height="1.5" rx="0.75" fill="#8f8e8c" />
                      </svg>
                      <span className="font-gilroy text-[15px] font-medium leading-[22px] text-[#8f8e8c]">Credit / Debit Card</span>
                    </div>
                  </div>

                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    paymentMethod === "card" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 !mt-0"
                  )}>
                  <div className="min-h-0 overflow-hidden">
                    <div className="space-y-5 pt-1">
                      <p className="font-gilroy text-[15px] leading-[22px] text-[#2b2a28]">
                        Your card details will be <span className="font-medium">securely processed</span> by Stripe
                      </p>

                      <label className="block">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Email</span>
                          <RequiredMark />
                        </div>
                        <div className={cn(
                          "mt-1 flex items-center rounded-[35px] border bg-white pl-[18px] pr-[12px] py-[11px] transition-colors",
                          fieldErrors.cardEmail ? "border-[#ff3b3b]" : cardEmail ? "border-[#12b91f]" : "border-[#e2ddda]"
                        )}>
                          <input
                            type="email"
                            placeholder="example@mail.com"
                            value={cardEmail}
                            onChange={(e) => { setCardEmail(e.target.value); if (fieldErrors.cardEmail) setFieldErrors(prev => ({ ...prev, cardEmail: false })); }}
                            className="min-w-0 flex-1 bg-transparent font-gilroy text-[15px] leading-[22px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]"
                          />
                          <svg className="ml-2 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="6" width="18" height="13" rx="2" stroke="#8f8e8c" strokeWidth="1.5" />
                            <path d="M3 9l9 5.5L21 9" stroke="#8f8e8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        {fieldErrors.cardEmail && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                      </label>

                      <label className="block">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Card number</span>
                          <RequiredMark />
                        </div>
                        <div className={cn(
                          "mt-1 flex items-center rounded-[35px] border bg-white pl-[18px] pr-[12px] py-[11px] transition-colors",
                          fieldErrors.cardNumber ? "border-[#ff3b3b]" : cardNumber ? "border-[#12b91f]" : "border-[#e2ddda]"
                        )}>
                          <input
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="1111 1111 1111 1111"
                            value={cardNumber}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "");
                              const detected = detectCardType(digits);
                              setCardType(detected);
                              setCardNumber(formatCardNumber(digits, detected));
                              if (fieldErrors.cardNumber) setFieldErrors(prev => ({ ...prev, cardNumber: false }));
                            }}
                            className="min-w-0 flex-1 bg-transparent font-gilroy text-[15px] leading-[22px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]"
                          />
                          <CardBrandIcon type={cardType} />
                        </div>
                        {fieldErrors.cardNumber && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                          <div className="flex items-center gap-[6px]">
                            <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Expiration date</span>
                            <RequiredMark />
                          </div>
                          <div className={cn(
                            "mt-1 flex items-center rounded-[35px] border bg-white pl-[18px] pr-[12px] py-[11px] transition-colors",
                            fieldErrors.cardExpiry ? "border-[#ff3b3b]" : cardExpiry ? "border-[#12b91f]" : "border-[#e2ddda]"
                          )}>
                            <input
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              placeholder="MM / YY"
                              value={cardExpiry}
                              onChange={(e) => {
                                setCardExpiry(formatExpiry(e.target.value));
                                if (fieldErrors.cardExpiry) setFieldErrors(prev => ({ ...prev, cardExpiry: false }));
                              }}
                              className="min-w-0 flex-1 bg-transparent font-gilroy text-[15px] leading-[22px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]"
                            />
                          </div>
                          {fieldErrors.cardExpiry && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                        </label>

                        <label className="block">
                          <div className="flex items-center gap-[6px]">
                            <span className="font-gilroy text-[13px] font-semibold leading-[24px] text-[#2b2a28]">Security code</span>
                            <RequiredMark />
                          </div>
                          <div className={cn(
                            "mt-1 flex items-center rounded-[35px] border bg-white pl-[18px] pr-[12px] py-[11px] transition-colors",
                            fieldErrors.cardCvc ? "border-[#ff3b3b]" : cardCvc ? "border-[#12b91f]" : "border-[#e2ddda]"
                          )}>
                            <input
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="CVC"
                              value={cardCvc}
                              onChange={(e) => {
                                const maxLen = cardType === "amex" ? 4 : 3;
                                setCardCvc(e.target.value.replace(/\D/g, "").slice(0, maxLen));
                                if (fieldErrors.cardCvc) setFieldErrors(prev => ({ ...prev, cardCvc: false }));
                              }}
                              className="min-w-0 flex-1 bg-transparent font-gilroy text-[15px] leading-[22px] text-[#2b2a28] outline-none placeholder:text-[#8f8e8c]"
                            />
                            <svg className="ml-2 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="2" y="6" width="20" height="13" rx="3" stroke="#8f8e8c" strokeWidth="1.5" />
                              <circle cx="17" cy="11" r="2" stroke="#8f8e8c" strokeWidth="1.5" />
                              <path d="M5 14h8" stroke="#8f8e8c" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                          {fieldErrors.cardCvc && <p className="mt-1 font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">Invalid input. Please check and try again.</p>}
                        </label>
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* PayPal row */}
                  <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[12px]",
                      paymentMethod === "paypal" ? "bg-[#ff5c02] p-[6px]" : "border border-[#e2ddda] bg-white"
                    )}>
                      {paymentMethod === "paypal" && <div className="h-3 w-3 rounded-full bg-white" />}
                    </div>
                    <svg width="70" height="22" viewBox="0 0 70 22" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="16" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" fill="#003087">Pay</text>
                      <text x="36" y="16" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" fill="#009CDE">Pal</text>
                    </svg>
                  </div>

                  {/* PayPal hint text */}
                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    paymentMethod === "paypal" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 !mt-0"
                  )}>
                    <div className="min-h-0 overflow-hidden">
                      <p className="font-gilroy text-[15px] leading-[22px] text-[#8f8e8c]">
                        Click <span className="font-medium">'Place Order'</span> to proceed to the PayPal payment page and complete your purchase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-orange-600 text-[13px] font-semibold uppercase tracking-[0.15px] text-white disabled:opacity-50"
                  >
                    {submitting ? "Redirecting..." : "Place Order"}
                  </button>
                </div>

                <div className="mt-8" ref={termsCheckboxRef}>
                  <div className="flex items-center gap-[10px]">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={agreeTerms}
                      onClick={() => {
                        setTermsCheckError(false);
                        setFieldErrors(prev => ({ ...prev, terms: false }));
                        if (!termsAccepted) {
                          setSubmitError(null);
                          setTermsOpen(true);
                          return;
                        }
                        setAgreeTerms((v) => !v);
                      }}
                      className={cn(
                        "mt-[2px] shrink-0 h-[24px] w-[24px] rounded-[8px] overflow-hidden flex items-center justify-center transition-colors",
                        agreeTerms ? "bg-[#ff5c02]" : (termsCheckError || fieldErrors.terms) ? "border border-[#FF3B3B] bg-white" : "border border-[#E2DDDA] bg-white"
                      )}
                    >
                      {agreeTerms && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="pt-[2px] font-gilroy text-[15px] font-medium not-italic leading-[22px] text-[#2B2A28]">
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
                  </div>
                  {(termsCheckError || fieldErrors.terms) && !agreeTerms && (
                    <p className="mt-[6px] font-gilroy text-[13px] leading-[19px] text-[#ff3b3b]">
                      Please read the Terms and Conditions before checking this box.
                    </p>
                  )}
                </div>
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
                onClick={() => {
                  setTermsOpen(false);
                  if (!termsAccepted) setTermsCheckError(true);
                }}
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
                    setAgreeTerms(true);
                    setTermsCheckError(false);
                    setFieldErrors(prev => ({ ...prev, terms: false }));
                    setSubmitError(null);
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
