export default defineEventHandler(() => {
  const baseUrl = 'https://welfare-notifier.vercel.app'

  // 정적 페이지 목록
  const staticPages = [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: '/search',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8',
    },
  ]

  // XML 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return sitemap
})
