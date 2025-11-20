import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Multiplica Shop - Tu asistente de compras inteligente",
  description: "Encuentra los mejores productos con la ayuda de nuestro asistente de IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="antialiased h-full m-0 p-0">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
