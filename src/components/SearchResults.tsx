import { type SearchResult } from '../hooks/useSearch';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
}

export function SearchResults({
  results,
  loading,
  error,
  query,
}: SearchResultsProps) {
  if (error) {
    return (
      <div className="search-results-container">
        <div className="error-state">
          <svg
            className="error-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h3 className="error-title">Search Error</h3>
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p className="loading-text">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="search-results-container">
        <div className="empty-state">
          <h3 className="empty-title">Start Searching</h3>
          <p className="empty-message">
            Enter a search term above to find relevant results
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="no-results-state">
          <svg
            className="no-results-icon"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
          <h3 className="no-results-title">No Results Found</h3>
          <p className="no-results-message">
            No results found for "<strong>{query}</strong>". Try a different
            search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="results-header">
        <h2 className="results-title">Search Results for "{query}"</h2>
        <span className="results-count">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="results-list">
        {results.map(result => (
          <SearchResultItem key={result.id} result={result} query={query} />
        ))}
      </div>
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
}

function SearchResultItem({ result, query }: SearchResultItemProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article className="search-result-item">
      <div className="result-content">
        <h3 className="result-title">{highlightText(result.title, query)}</h3>
        <p className="result-description">
          {highlightText(result.description, query)}
        </p>
        <div className="result-meta">
          <span className="result-category">{result.category}</span>
          <span className="result-author">by {result.author}</span>
          <span className="result-date">
            {new Date(result.date).toLocaleDateString()}
          </span>
        </div>
        <div className="result-tags">
          {result.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="result-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
