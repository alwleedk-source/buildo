import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";

export const metadata: Metadata = {
  title: "BouwMeesters Amsterdam BV",
  description: "Professional construction company in Amsterdam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          :root{--background:#ffffff;--foreground:#171717}
          body{background:#fff;color:#171717;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin:0;padding:0}
          h1{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-weight:700;line-height:1.2;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
          img{content-visibility:auto}
          html{scroll-behavior:smooth}
          *{box-sizing:border-box}
        `}} />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <QueryProvider>{children}</QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
