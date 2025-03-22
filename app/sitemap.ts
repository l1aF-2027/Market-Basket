export async function GET() {
  const siteUrl = "https://market-basket.vercel.app";
  const pages = ["", "main", "admin", "signUp"]; // Các trang tĩnh

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(
            (page) => `
            <url>
                <loc>${siteUrl}/${page}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>`
          )
          .join("")}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
