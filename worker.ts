interface Env {
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

interface ArticleRow {
  title: string;
  slug: string;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured_image: string;
  is_published: boolean;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char] || char);
}

function replaceMeta(html: string, matcher: RegExp, tag: string): string {
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}


async function fetchAssets(env: Env, request: Request): Promise<Response> {
  if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    console.error('Cloudflare static assets binding ASSETS is missing. Check wrangler.jsonc and redeploy the Worker.');
    return new Response('Website assets are not configured on this Worker. Please contact the site administrator.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }
    });
  }
  return fetchAssets(env, request);
}

function withArticleMetadata(html: string, article: ArticleRow, canonicalUrl: string): string {
  const title = escapeHtml(article.seo_title?.trim() || article.title);
  const description = escapeHtml((article.seo_description?.trim() || article.excerpt || article.title).slice(0, 300));
  const image = escapeHtml(article.featured_image);
  const url = escapeHtml(canonicalUrl);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title} | D YOUNG LUXURY HAIRS</title>`);
  html = replaceMeta(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:type["'][^>]*>/i, '<meta property="og:type" content="article" />');
  html = replaceMeta(html, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${image}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:image:alt["'][^>]*>/i, `<meta property="og:image:alt" content="${title}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${url}" />`);
  html = replaceMeta(html, /<meta\s+name=["']twitter:card["'][^>]*>/i, '<meta name="twitter:card" content="summary_large_image" />');
  html = replaceMeta(html, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}" />`);
  html = replaceMeta(html, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description}" />`);
  html = replaceMeta(html, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${image}" />`);
  return replaceMeta(html, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${url}" />`);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (request.method !== 'GET' || !match) return fetchAssets(env, request);

    const slug = decodeURIComponent(match[1]);
    const supabaseUrl = env.SUPABASE_URL || 'https://geikolbqvlrcucobzwlt.supabase.co';
    if (!env.SUPABASE_ANON_KEY) return fetchAssets(env, request);

    try {
      const query = new URL('/rest/v1/blog_posts', supabaseUrl);
      query.searchParams.set('select', 'title,slug,excerpt,seo_title,seo_description,featured_image,is_published');
      query.searchParams.set('slug', `eq.${slug}`);
      query.searchParams.set('is_published', 'eq.true');
      query.searchParams.set('limit', '1');
      const result = await fetch(query.toString(), {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
          Accept: 'application/json'
        }
      });
      if (!result.ok) return fetchAssets(env, request);
      const articles = await result.json() as ArticleRow[];
      const article = articles[0];
      if (!article) return fetchAssets(env, request);

      const assetUrl = new URL('/index.html', url);
      const page = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (!page.ok) return page;
      const html = withArticleMetadata(await page.text(), article, url.toString());
      const headers = new Headers(page.headers);
      headers.set('content-type', 'text/html; charset=utf-8');
      headers.set('cache-control', 'public, max-age=0, s-maxage=300');
      return new Response(html, { status: page.status, headers });
    } catch (error) {
      console.error('Article social preview generation failed:', error);
      return fetchAssets(env, request);
    }
  }
};
