import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "../i18n";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const i18nNamespaces = ["global"];

export const metadata: Metadata = {
  title: "CV Master",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale}>
      <body className={`${inter.className}`}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <Providers apiKey={apiKey}>
            <div className="max-w-5xl p-4 mx-auto flex flex-col h-screen gap-4">
              <Navbar />
              <div className="border border-border w-full p-4 rounded-md h-full bg-card">
                {children}
              </div>
              <Toaster />
            </div>
          </Providers>
        </TranslationsProvider>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </body>
    </html>
  );
}
