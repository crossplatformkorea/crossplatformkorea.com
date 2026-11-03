/** Split text into user-perceived characters, falling back to code points without Intl.Segmenter. */
export function createGraphemes(Segmenter: typeof Intl.Segmenter | undefined) {
  const segmenter =
    typeof Segmenter === 'function'
      ? new Segmenter(undefined, { granularity: 'grapheme' })
      : undefined;

  return (value: string): string[] => {
    const normalized = value.normalize('NFC');
    return segmenter
      ? Array.from(segmenter.segment(normalized), ({ segment }) => segment)
      : Array.from(normalized);
  };
}

export const graphemes = createGraphemes(Intl.Segmenter);
