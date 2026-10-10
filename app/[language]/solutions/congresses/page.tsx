import type { Metadata } from "next";
import { MarketingPage } from "@/components/public/marketing-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/solutions/congresses">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/solutions/congresses",
    title: dict.marketing.congresses.title,
    description: dict.site.seo.congresses,
  });
}

export default async function Page({ params }: PageProps<"/[language]/solutions/congresses">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MarketingPage
      dict={dict}
      locale={locale}
      page={dict.marketing.congresses}
    />
  );
}
