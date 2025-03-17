import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game App",
  description: "A modern game application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
