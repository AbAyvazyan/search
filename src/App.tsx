import { useEffect } from 'react';
import { useSearch } from './hooks/useSearch';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import './App.css';

function App() {
  const {
    query,
    results,
    loading,
    error,
    setQuery,
    setQueryImmediate,
    clearResults,
  } = useSearch({
    debounceMs: 800,
    minQueryLength: 2,
  });

  // Load initial query from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam && queryParam.trim()) {
      // Use immediate search for URL parameters (no debounce)
      setQueryImmediate(queryParam.trim());
    }
  }, [setQueryImmediate]); // Include setQueryImmediate in dependencies

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Search App</h1>
          <p className="app-subtitle">
            Find what you're looking for with our powerful search
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="search-section">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={clearResults}
            placeholder="Search for anything..."
            disabled={loading}
          />
        </div>

        <SearchResults
          results={results}
          loading={loading}
          error={error}
          query={query}
        />
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          Built with React, TypeScript, and modern web technologies
        </p>
      </footer>
    </div>
  );
}

export default App;
