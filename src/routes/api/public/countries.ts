import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
};

export const Route = createFileRoute("/api/public/countries")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const fields =
          url.searchParams.get("fields") ||
          "cca2,name,translations,flag";
        try {
          const r = await fetch(
            `https://restcountries.com/v3.1/all?fields=${encodeURIComponent(fields)}`,
            { headers: { Accept: "application/json" } },
          );
          if (!r.ok) {
            return new Response(JSON.stringify({ error: "upstream", status: r.status }), {
              status: 502,
              headers: { "Content-Type": "application/json", ...CORS },
            });
          }
          const body = await r.text();
          return new Response(body, {
            status: 200,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        }
      },
    },
  },
});
