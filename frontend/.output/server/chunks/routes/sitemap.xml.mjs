import { d as defineEventHandler } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const sitemap_xml = defineEventHandler(() => {
  const baseUrl = "https://welfare-notifier.vercel.app";
  const staticPages = [
    {
      loc: "/",
      lastmod: (/* @__PURE__ */ new Date()).toISOString(),
      changefreq: "daily",
      priority: "1.0"
    },
    {
      loc: "/search",
      lastmod: (/* @__PURE__ */ new Date()).toISOString(),
      changefreq: "daily",
      priority: "0.8"
    }
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(
    (page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join("\n")}
</urlset>`;
  return sitemap;
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
