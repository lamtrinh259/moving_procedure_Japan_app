import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Moving Assistant",
  description: "A practical bilingual guide for moving in, within, or out of Japan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
