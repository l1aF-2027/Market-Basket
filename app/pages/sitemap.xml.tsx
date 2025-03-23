import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { format } from "date-fns";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  ctx.res.setHeader("Content-Type", "text/xml");
  const xml = await generateSitemapXml();
  ctx.res.write(xml);
  ctx.res.end();

  return {
    props: {},
  };
};

async function generateSitemapXml(): Promise<string> {
  const pages = ["main", "admin"];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>https://market-basket.vercel.app/${page}</loc>
      <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
    </url>
    `;
    })
    .join("")}
</urlset>`;
}
