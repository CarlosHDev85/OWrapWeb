import React, { useRef } from 'react';

export default function CodeBlock({ children, className, copiedButtonId, setCopiedButtonId }) {
  const codeRef = useRef(null);
  const buttonId = `copy-button-${Math.random().toString(36).substr(2, 9)}`;

  const copyToClipboard = () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent;
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedButtonId(buttonId);
          setTimeout(() => {
            setCopiedButtonId(null);
          }, 2000);
        })
        .catch(err => console.error('Failed to copy code: ', err));
    }
  };

  return (
    <pre className={className}>
      <button
        id={buttonId}
        className={`copy-code-button ${copiedButtonId === buttonId ? 'copied' : ''}`}
        onClick={copyToClipboard}
      >
        {copiedButtonId === buttonId ? 'Copied!' : 'Copy'}
      </button>
      <code ref={codeRef} className={className}>
        {children}
      </code>
    </pre>
  );
}
