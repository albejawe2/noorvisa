import { createFileRoute } from "@tanstack/react-router";
import countries from "world-countries";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
};

// Pick only requested fields to keep payload small (matches restcountries v3.1/all shape).
function pick(obj: Record<string, unknown>, fields: string[]) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f in obj) out[f] = obj[f];
  }
  return out;
}

export const Route = createFileRoute("/api/public/countries")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const fieldsParam = url.searchParams.get("fields");
        const fields = fieldsParam
          ? fieldsParam.split(",").map((s) => s.trim()).filter(Boolean)
          : ["cca2", "name", "translations", "flag"];

        const data = (countries as unknown as Record<string, unknown>[]).map((c) => pick(c, fields));

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      },
    },
  },
});
