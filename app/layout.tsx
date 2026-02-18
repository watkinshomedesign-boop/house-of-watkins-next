import "./globals.css";
import localFont from "next/font/local";
import { CartProvider } from "@/lib/cart/CartContext";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import { PlansCacheProvider } from "@/lib/plans/PlansCache";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${gilroy.variable} ${gilroy.className}`}>
        <CartProvider>
          <FavoritesProvider>
            <PlansCacheProvider>{children}</PlansCacheProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
