import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import siteConfig, { getAbsoluteUrl, getSiteUrl } from '../config/site.js';

/**
 * SEO & Dynamic Meta Manager Component
 * Keeps document head, OpenGraph, Canonical URLs, and Twitter cards synchronized with the current route.
 */
export default function SEO({
  title,
  description,
  image,
  imageAlt,
  type = 'website'
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const pageTitle = title
      ? (title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`)
      : siteConfig.title;
    document.title = pageTitle;

    // 2. Description
    const metaDescription = description || siteConfig.description;

    // 3. Absolute URLs
    const currentUrl = getAbsoluteUrl(location.pathname);
    const ogImageRelative = image || siteConfig.ogImage;
    const ogImageUrl = ogImageRelative.startsWith('http')
      ? ogImageRelative
      : getAbsoluteUrl(ogImageRelative);
    const altText = imageAlt || siteConfig.ogImageAlt;

    // Helper to update or create meta tags
    const setMetaTag = (selector, attributeName, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) el.setAttribute('property', prop);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attributeName, value);
    };

    // Update standard meta
    setMetaTag('meta[name="description"]', 'content', metaDescription);
    setMetaTag('meta[name="title"]', 'content', pageTitle);

    // Update OpenGraph tags
    setMetaTag('meta[property="og:title"]', 'content', pageTitle);
    setMetaTag('meta[property="og:description"]', 'content', metaDescription);
    setMetaTag('meta[property="og:url"]', 'content', currentUrl);
    setMetaTag('meta[property="og:image"]', 'content', ogImageUrl);
    setMetaTag('meta[property="og:image:secure_url"]', 'content', ogImageUrl);
    setMetaTag('meta[property="og:image:alt"]', 'content', altText);
    setMetaTag('meta[property="og:type"]', 'content', type);

    // Update Twitter tags
    setMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', metaDescription);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImageUrl);
    setMetaTag('meta[name="twitter:image:alt"]', 'content', altText);

    // Update Canonical URL link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }, [title, description, image, imageAlt, type, location.pathname]);

  return null;
}
