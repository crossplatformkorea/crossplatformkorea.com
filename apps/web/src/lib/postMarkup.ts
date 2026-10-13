import { unified } from 'unified';
import remarkParse from 'remark-parse';

const parser = unified().use(remarkParse);

interface MarkupNode {
  type: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
  children?: MarkupNode[];
}

/** Keep literal code intact while supporting emphasis inside legacy HTML posts. */
export function preprocessPostMarkdown(content: string): string {
  // Protect code before processing emphasis, including emphasis around inline code.
  const usedMarkers = new Set(
    Array.from(content.matchAll(/CPK-CODE-(\d+):/g), (match) => match[1]),
  );
  let nonce = 0;
  while (usedMarkers.has(String(nonce))) nonce++;
  const marker = `CPK-CODE-${nonce}:`;
  const code: string[] = [];
  const parts: string[] = [];
  // ASCII tag folding preserves offsets even when Unicode case folding expands text.
  const lowerContent = content.replace(/[A-Z]/g, (letter) => letter.toLowerCase());
  const ranges: { start: number; end: number }[] = [];
  // Reuse the Markdown parser's source ranges for CommonMark fences and code spans.
  const pending: MarkupNode[] = [parser.parse(content)];
  while (pending.length) {
    const node = pending.pop()!;
    if (node.type === 'code' || node.type === 'inlineCode') {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      if (start !== undefined && end !== undefined) ranges.push({ start, end });
    } else if (node.children) {
      for (const child of node.children) pending.push(child);
    }
  }
  // Legacy HTML code is opaque to the Markdown parser; protect it separately.
  const markdownRanges = [...ranges].sort((a, b) => a.start - b.start);
  let markdownIndex = 0;
  const opening = /<(pre|code)\b[^<>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = opening.exec(content))) {
    while (markdownRanges[markdownIndex]?.end <= match.index) markdownIndex++;
    const protectedRange = markdownRanges[markdownIndex];
    if (protectedRange && protectedRange.start <= match.index) {
      opening.lastIndex = protectedRange.end;
      continue;
    }
    const delimiter = `</${match[1].toLowerCase()}>`;
    const closing = lowerContent.indexOf(delimiter, opening.lastIndex);
    const end = closing === -1 ? content.length : closing + delimiter.length;
    ranges.push({ start: match.index, end });
    opening.lastIndex = end;
  }
  const merged: typeof ranges = [];
  for (const range of ranges.sort((a, b) => a.start - b.start)) {
    const previous = merged[merged.length - 1];
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push(range);
  }
  let cursor = 0;
  for (const range of merged) {
    parts.push(content.slice(cursor, range.start), `${marker}${code.length}${marker}`);
    code.push(content.slice(range.start, range.end));
    cursor = range.end;
  }
  parts.push(content.slice(cursor));
  return parts
    .join('')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(
      new RegExp(`${marker}(\\d+)${marker}`, 'g'),
      (_, index: string) => code[Number(index)],
    );
}
