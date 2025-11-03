import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japanese Word Slot Game",
  description: "A simple slot game with Japanese hiragana words",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
