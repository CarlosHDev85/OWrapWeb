import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ children, className, copiedButtonId, setCopiedButtonId }) {
  // extract raw code string and language
  const codeString = Array.isArray(children) ? children.join('') : children;
  const language = className ? className.replace('language-', '') : '';
  const buttonId = `copy-button-${Math.random().toString(36).substr(2, 9)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString)
      .then(() => {
        setCopiedButtonId(buttonId);
        setTimeout(() => setCopiedButtonId(null), 2000);
      })
      .catch(err => console.error('Failed to copy code: ', err));
  };

  return (
    <div className="code-block-container">
      <button
        id={buttonId}
        className={`copy-code-button ${copiedButtonId === buttonId ? 'copied' : ''}`}
        onClick={copyToClipboard}
      >
        {copiedButtonId === buttonId ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        showLineNumbers
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
