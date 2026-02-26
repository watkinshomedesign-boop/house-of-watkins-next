import "./globals.css";
import { Suspense } from "react";
import localFont from "next/font/local";
import Script from "next/script";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { PageVisitTracker } from "@/components/analytics/PageVisitTracker";
import { CartProvider } from "@/lib/cart/CartContext";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import { PlansCacheProvider } from "@/lib/plans/PlansCache";
export const metadata = {
  verification: {
    google: "p1FaTI1nGV-fpDjoRqgx1jqGigY9lFyfEgGW_pwjQ5c",
    other: {
      "msvalidate.01": ["76C12C5F9919B997B34A104924FB7C04"],
    },
  },
};


const gilroy = localFont({
  variable: "--font-gilroy",
  display: "swap",
  src: [
    { path: "../assets/fonts/gilroy/Gilroy-Thin.ttf", weight: "100", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-UltraLight.ttf", weight: "200", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-UltraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-Light.ttf", weight: "300", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-RegularItalic.ttf", weight: "400", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../assets/fonts/gilroy/Gilroy-Black.ttf", weight: "900", style: "normal" },
    { path: "../assets/fonts/gilroy/Gilroy-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="76C12C5F9919B997B34A104924FB7C04" />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vkd2wmn0fy");
            `,
          }}
        />
      </head>
      <body className={`${gilroy.variable} ${gilroy.className}`}>
        {gtmId && <Suspense fallback={null}><GoogleTagManager GTM_ID={gtmId} /></Suspense>}
        <PageVisitTracker />
        <CartProvider>
          <FavoritesProvider>
            <PlansCacheProvider>{children}</PlansCacheProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
