import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
