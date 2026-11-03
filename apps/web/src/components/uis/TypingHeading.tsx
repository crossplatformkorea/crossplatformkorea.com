import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { graphemes } from '../../lib/graphemes';

function textContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return child.type === 'br' ? '\n' : textContent(child.props.children);
      }
      return '';
    })
    .join('');
}

type TypingHeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'aria-label' | 'children'> & {
  children: ReactNode;
};

/** Reserve the full heading while revealing its single text copy. */
export default function TypingHeading({ children, ...props }: TypingHeadingProps) {
  const text = textContent(children).normalize('NFC');
  const interval = Math.min(45, 900 / Math.max(1, graphemes(text).length));
  let characterIndex = 0;
  const reveal = (nodes: ReactNode): ReactNode =>
    Children.map(nodes, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return graphemes(String(child)).map((character) => {
          const index = characterIndex++;
          return (
            <span
              key={index}
              className="typing-character"
              style={{ animationDelay: `${100 + index * interval}ms` }}
            >
              {character}
            </span>
          );
        });
      }
      if (isValidElement<{ children?: ReactNode }>(child) && child.props.children != null) {
        return cloneElement(child, { children: reveal(child.props.children) });
      }
      return child;
    });

  return (
    <h1 {...props} aria-label={text.replace(/\s+/g, ' ').trim()}>
      <span key={text} aria-hidden="true">
        {reveal(children)}
      </span>
    </h1>
  );
}
