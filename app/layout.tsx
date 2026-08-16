import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quotation Review",
  description: "Review industrial quotations with confidence.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
