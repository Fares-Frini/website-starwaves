import type { Metadata } from "next";
import { MarketingPage } from "@/components/public/marketing-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[language]/contact">): Promise<Metadata> {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/contact",
    title: dict.marketing.contact.title,
    description: dict.site.seo.contact,
  });
}

export default async function Page({ params }: PageProps<"/[language]/contact">) {
  const { language: locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MarketingPage
      dict={dict}
      locale={locale}
      page={dict.marketing.contact}
    />
  );
}
