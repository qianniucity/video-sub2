import type { MetadataRoute } from "next";

/**
 * 定义了一个简单的robots规则，允许所有搜索引擎爬虫访问网站的所有内容。这是SEO（搜索引擎优化）的一个基本步骤，确保网站的内容能被搜索引擎索引和抓取。
 * @returns 
 * 
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
