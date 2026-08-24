import React from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

export function ArticleViewer({ content, title }) {
  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleCopy = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Simple Markdown parser for article content
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLanguage = '';
    let blockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start / End
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Finish code block
          const codeString = codeBuffer.join('\n');
          const currentIndex = blockIndex++;
          elements.push(
            <div key={`code-${currentIndex}`} className="relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span>{codeLanguage || 'javascript'}</span>
                <button
                  onClick={() => handleCopy(codeString, currentIndex)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copiedCode === currentIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar código</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-bold text-slate-100 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-extrabold text-white mt-8 mb-4 border-b border-slate-800 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl sm:text-3xl font-black text-white mt-4 mb-6">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // Unordered list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={i} className="text-slate-300 text-sm sm:text-base ml-6 list-disc mb-1 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }
      // Ordered list
      else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={i} className="text-slate-300 text-sm sm:text-base ml-6 list-decimal mb-1 leading-relaxed">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      // Blank lines
      else if (line.trim() === '') {
        // spacer
      }
      // Standard Paragraph
      else {
        elements.push(
          <p key={i} className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md max-w-4xl mx-auto shadow-2xl">
      <div className="prose prose-invert max-w-none">
        {renderFormattedContent(content)}
      </div>
    </div>
  );
}
