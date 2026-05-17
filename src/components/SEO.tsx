import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://andyzhu23.github.io';
const SITE_NAME = 'Andy Zhu';
const DEFAULT_IMAGE = `${SITE_URL}/images/profile.jpg`;

interface ArticleMeta {
  publishedTime: string;
  tags?: string[];
  author?: string;
}

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  article?: ArticleMeta;
  jsonLd?: object;
}

export default function SEO({ title, description, path, image, article, jsonLd }: SEOProps) {
  const fullTitle = path === '/' ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? DEFAULT_IMAGE;
  const ogType = article ? 'article' : 'website';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {article && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
