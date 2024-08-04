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
  description:
    "Nuestra app de revisión de currículums analiza y valida CVs según los requisitos del puesto. Automatiza el proceso de aprobación o rechazo de currículums de forma rápida y precisa. Ideal para reclutadores y empresas.",

  openGraph: {
    title: "CV Master",
    description:
      "Nuestra app de revisión de currículums analiza y valida CVs según los requisitos del puesto. Automatiza el proceso de aprobación o rechazo de currículums de forma rápida y precisa. Ideal para reclutadores y empresas.",
    type: "website",
    url: "https://cv-master.oxanetwork.com/",
    images: [
      {
        url: "https://cv-master.oxanetwork.com/og-image.png",
        width: 1872,
        height: 956,
        alt: "CV Master",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CV Master",
    description:
      "Nuestra app de revisión de currículums analiza y valida CVs según los requisitos del puesto. Automatiza el proceso de aprobación o rechazo de currículums de forma rápida y precisa. Ideal para reclutadores y empresas.",
    images: ["https://cv-master.oxanetwork.com/og-image.png"],
  },
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
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={`${inter.className}`}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <Providers apiKey={apiKey}>
            <div className="max-w-5xl p-4 mx-auto flex flex-col h-screen gap-4">
              <Navbar />
              <div className="border border-border w-full p-4 rounded-md h-full bg-card overflow-y-auto">
                {children}
              </div>
              <Toaster />
            </div>
          </Providers>
        </TranslationsProvider>
      </body>
    </html>
  );
}
