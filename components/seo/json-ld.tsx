/**
 * Structured data for search engines, as a JSON-LD script. Server-rendered,
 * so crawlers read it in the HTML; `<` is escaped so text coming from the API
 * can never close the script early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
