/** A compact text excerpt; previews never render the post's HTML or embeds. */
function stripEmbeddedContent(content: string): string {
  const tags = /<\/?(script|style|iframe)\b[^<>]*>/gi;
  const parts: string[] = [];
  let blocked: string | null = null;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = tags.exec(content))) {
    const tag = match[1].toLowerCase();
    if (!blocked && !match[0].startsWith('</')) {
      parts.push(content.slice(cursor, match.index));
      blocked = tag;
    } else if (blocked === tag && match[0].startsWith('</')) {
      parts.push(' ');
      cursor = tags.lastIndex;
      blocked = null;
    }
  }
  if (!blocked) parts.push(content.slice(cursor));
  return parts.join('');
}

export function postPreview(content: string, limit = 220): string {
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };
  const text = stripEmbeddedContent(content)
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/!\[[^[\]]*\]\((?:[^()]|\([^()]*\))*\)/g, ' ')
    .replace(/\[([^[\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, '$1')
    .replace(/<[^<>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/(^|\n)\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/g, ' ')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/[*`~]/g, '')
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, entity: string) => entities[entity])
    .replace(/\s+/g, ' ')
    .trim();
  const characters = Array.from(text);
  return characters.length > limit ? `${characters.slice(0, limit).join('')}…` : text;
}
