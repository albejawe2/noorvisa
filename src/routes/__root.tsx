import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import appCss from "@/styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#faf6f0" },
      { title: "NoorVisa" },
      { property: "og:title", content: "NoorVisa" },
      { name: "twitter:title", content: "NoorVisa" },
      { name: "description", content: "Noor Visa offers premium global visa services with interactive design and expert consultation." },
      { property: "og:description", content: "Noor Visa offers premium global visa services with interactive design and expert consultation." },
      { name: "twitter:description", content: "Noor Visa offers premium global visa services with interactive design and expert consultation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c678821e-d1a3-4645-9e83-8e9b58d117f0/id-preview-9ad40925--06aa4755-4802-407b-80cd-4a7c265d492a.lovable.app-1780887124695.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c678821e-d1a3-4645-9e83-8e9b58d117f0/id-preview-9ad40925--06aa4755-4802-407b-80cd-4a7c265d492a.lovable.app-1780887124695.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-ivory text-ink">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-3">404</h1>
        <a href="/" className="text-ember underline">العودة للصفحة الرئيسية</a>
      </div>
    </div>
  ),
});

function RootComponent() {
  return (
    <html lang="ar" dir="rtl">
      <head><HeadContent /></head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
