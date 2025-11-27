import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Import core language first
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
// Import markup-templating before PHP (PHP depends on it)
import 'prismjs/components/prism-markup-templating';
// Then import other languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeDisplay = ({ code, language, prompt, timestamp }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Map language names to Prism language codes
  const getPrismLanguage = (lang) => {
    const languageMap = {
      'Python': 'python',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'C++': 'cpp',
      'Java': 'java',
      'Go': 'go',
      'Rust': 'rust',
      'C#': 'csharp',
      'PHP': 'php',
      'Ruby': 'ruby'
    };
    return languageMap[lang] || 'javascript';
  };

  const prismLang = getPrismLanguage(language);

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Generated Code</h3>
            <p className="text-sm text-gray-300">{language}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {copied ? (
              <>
                <FaCheck />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt */}
      {prompt && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Prompt:</span> {prompt}
          </p>
        </div>
      )}

      {/* Code Block */}
      <div className="relative">
        <pre className="!mb-0 !rounded-none overflow-x-auto">
          <code className={`language-${prismLang}`}>
            {code}
          </code>
        </pre>
      </div>

      {/* Footer */}
      {timestamp && (
        <div className="bg-gray-50 px-6 py-2 text-right border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Generated at {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
