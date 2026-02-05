import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import { PlansCacheProvider } from "@/lib/plans/PlansCache";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FavoritesProvider>
            <PlansCacheProvider>{children}</PlansCacheProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
