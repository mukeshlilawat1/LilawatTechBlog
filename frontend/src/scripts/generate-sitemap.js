// scripts/generate-sitemap.js
// Run: node scripts/generate-sitemap.js
// Add to package.json: "sitemap": "node scripts/generate-sitemap.js"

import fs from "fs";
import path from "path";

const SITE_URL = "https://lilawattechblog.in";
const API_URL = "https://api.lilawattechblog.in/api/v1";

const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/posts", priority: "0.9", changefreq: "daily" },
    { url: "/login", priority: "0.3", changefreq: "monthly" },
    { url: "/register", priority: "0.3", changefreq: "monthly" },
];

async function fetchPublishedPosts() {
    try {
        const response = await fetch(`${API_URL}/posts?page=0&size=1000`);
        const data = await response.json();
        return data.content || [];
    } catch (err) {
        console.log("Could not fetch posts, using static routes only");
        return [];
    }
}

async function generateSitemap() {
    const posts = await fetchPublishedPosts();

    const dynamicRoutes = posts.map((post) => ({
        url: `/posts/${post.id}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: post.updatedAt
            ? new Date(post.updatedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
    }));

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allRoutes
            .map(
                (route) => `  <url>
    <loc>${SITE_URL}${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ""}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
            )
            .join("\n")}
</urlset>`;

    const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
    fs.writeFileSync(outputPath, sitemap);
    console.log(`✅ Sitemap generated: ${outputPath}`);
    console.log(`   Total URLs: ${allRoutes.length}`);
}

generateSitemap();