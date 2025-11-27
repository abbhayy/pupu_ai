import { useState, useEffect } from 'react';
import { generateCode, getLanguages } from '../services/api';
import CodeDisplay from './CodeDisplay';
import { FaSpinner, FaRocket } from 'react-icons/fa';

const CodeGenerator = ({ onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);

  // Fetch available languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await getLanguages();
        setLanguages(response.data || []);
        if (response.data && response.data.length > 0) {
          setLanguage(response.data[0].name);
        }
      } catch (err) {
        console.error('Failed to fetch languages:', err);
        // Fallback languages if API fails
        setLanguages([
          { id: 1, name: 'Python', extension: '.py' },
          { id: 2, name: 'JavaScript', extension: '.js' },
          { id: 3, name: 'TypeScript', extension: '.ts' },
          { id: 4, name: 'C++', extension: '.cpp' }
        ]);
        setLanguage('Python');
      }
    };

    fetchLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    if (!language) {
      setError('Please select a language');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const response = await generateCode(prompt, language);
      setGeneratedCode(response.data);
      
      // Call success callback to refresh history
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Handle both error formats (string or array)
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.join(', '));
      } else {
        setError(err.error || 'Failed to generate code. Please try again.');
      }
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedCode(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-gray-700 mb-2">
              Description Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Write a Python function to calculate the factorial of a number recursively"
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {prompt.length} / 5000 characters
            </p>
          </div>

          {/* Language Selection */}
          <div>
            <label htmlFor="language" className="block text-lg font-semibold text-gray-700 mb-2">
              Select Programming Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              disabled={loading}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.name}>
                  {lang.name} ({lang.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-fade-in">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-200 to-green-400 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaRocket />
                  <span className='text-black'>Generate Code</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="animate-fade-in">
          <CodeDisplay
            code={generatedCode.code}
            language={generatedCode.language}
            prompt={generatedCode.prompt}
            timestamp={generatedCode.createdAt}
          />
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
