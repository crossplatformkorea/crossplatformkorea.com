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
  const opening = /```|~~~|`|<(pre|code)\b[^<>]*>/gi;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = opening.exec(content))) {
    const delimiter = match[1] ? `</${match[1].toLowerCase()}>` : match[0];
    const closing = (match[1] ? lowerContent : content).indexOf(delimiter, opening.lastIndex);
    if (delimiter === '`') {
      const newline = content.indexOf('\n', opening.lastIndex);
      if (closing === -1 || (newline !== -1 && newline < closing)) continue;
    }
    const end = closing === -1 ? content.length : closing + delimiter.length;
    parts.push(content.slice(cursor, match.index), `${marker}${code.length}${marker}`);
    code.push(content.slice(match.index, end));
    cursor = end;
    opening.lastIndex = end;
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
