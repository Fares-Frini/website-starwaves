"use client";

/**
 * The last-resort boundary: it replaces the root layout when the layout itself
 * fails, so it has to bring its own `<html>` and `<body>` and cannot rely on
 * the stylesheet, the fonts or the dictionaries being there. Deliberately
 * plain, and in French (the primary locale) with the English beneath.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#1b2330",
          background: "#fff",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
            Le service est momentanément indisponible
          </h1>
          <p style={{ color: "#5b6573" }}>
            Réessayez dans un instant. / The service is temporarily unavailable;
            please try again shortly.
          </p>
          {error.digest ? (
            <p style={{ fontSize: "0.75rem", color: "#7a8494" }}>
              Réf. {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              height: "2.75rem",
              padding: "0 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #2e86ef",
              background: "#2e86ef",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Réessayer / Retry
          </button>
        </main>
      </body>
    </html>
  );
}
