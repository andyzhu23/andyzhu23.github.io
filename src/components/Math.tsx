import { useMemo } from 'react';
import katex from 'katex';

interface MathProps {
  tex: string;
}

function render(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    output: 'htmlAndMathml',
  });
}

export function InlineMath({ tex }: MathProps) {
  const html = useMemo(() => render(tex, false), [tex]);
  return <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockMath({ tex }: MathProps) {
  const html = useMemo(() => render(tex, true), [tex]);
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
