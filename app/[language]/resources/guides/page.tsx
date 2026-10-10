import type { Metadata } from "next";
import { MarketingPage } from "@/components/public/marketing-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/resources/guides">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/resources/guides",
    title: dict.marketing.guides.title,
    description: dict.site.seo.guides,
  });
}

export default async function Page({ params }: PageProps<"/[language]/resources/guides">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MarketingPage
      dict={dict}
      locale={locale}
      page={dict.marketing.guides}
    />
  );
}
