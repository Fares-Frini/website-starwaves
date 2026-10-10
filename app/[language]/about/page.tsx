import type { Metadata } from "next";
import { MarketingPage } from "@/components/public/marketing-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/about">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/about",
    title: dict.marketing.about.title,
    description: dict.site.seo.about,
  });
}

export default async function Page({ params }: PageProps<"/[language]/about">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MarketingPage
      dict={dict}
      locale={locale}
      page={dict.marketing.about}
    />
  );
}
