import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Raleway } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Spin to Win | Echo & Ember",
  description: "Spin the wheel for a chance to win exclusive discounts on premium beauty and skincare products from Echo & Ember. Premium makeup, cosmetics, and skincare for all skin types.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${lato.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
