import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { PluggableList } from 'unified';

interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

const videoHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

function safeVideoSrc(src: unknown): string | null {
  if (typeof src !== 'string') return null;
  try {
    const url = new URL(src);
    if (
      url.protocol !== 'https:' ||
      url.port ||
      !videoHosts.has(url.hostname) ||
      !/^\/embed\/[\w-]{11}\/?$/.test(url.pathname)
    )
      return null;
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function rehypePostEmbeds() {
  return (tree: HtmlNode) => {
    const pending = [tree];
    const nodes: HtmlNode[] = [];
    const ids = new Set<string>();
    while (pending.length) {
      const node = pending.pop()!;
      nodes.push(node);
      if (typeof node.properties?.id === 'string') ids.add(node.properties.id);
      if (node.tagName === 'a' && typeof node.properties?.name === 'string') {
        ids.add(node.properties.name);
      }
      if (!node.children) continue;
      node.children = node.children.filter((child) => {
        if (child.tagName !== 'iframe') return true;
        const src = safeVideoSrc(child.properties?.src);
        if (!src) return false;
        child.properties = { ...child.properties, src, loading: 'lazy' };
        return true;
      });
      for (const child of node.children) pending.push(child);
    }
    // Keep article-local anchors working after the sanitizer prefixes unsafe IDs.
    for (const node of nodes) {
      const href = node.properties?.href;
      if (node.tagName !== 'a' || typeof href !== 'string' || !href.startsWith('#')) continue;
      try {
        const target = `user-content-${decodeURIComponent(href.slice(1))}`;
        if (ids.has(target)) node.properties!.href = `#${encodeURIComponent(target)}`;
      } catch {
        /* Invalid fragments remain inert links. */
      }
    }
  };
}

export const postHtmlPlugins: PluggableList = [
  rehypeRaw,
  [
    rehypeSanitize,
    {
      ...defaultSchema,
      strip: [...(defaultSchema.strip || []), 'style'],
      tagNames: [...(defaultSchema.tagNames || []), 'iframe'],
      attributes: {
        ...defaultSchema.attributes,
        iframe: ['src', 'title', 'width', 'height', 'allowFullScreen', 'frameBorder', 'loading'],
      },
    },
  ],
  rehypePostEmbeds,
];
