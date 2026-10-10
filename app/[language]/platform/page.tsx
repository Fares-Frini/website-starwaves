import type { Metadata } from "next";
import { MarketingPage } from "@/components/public/marketing-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/platform">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/platform",
    title: dict.marketing.platform.title,
    description: dict.site.seo.platform,
  });
}

export default async function Page({ params }: PageProps<"/[language]/platform">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MarketingPage
      dict={dict}
      locale={locale}
      page={dict.marketing.platform}
    />
  );
}
