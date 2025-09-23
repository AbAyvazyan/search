# Search App

A modern, responsive search application built with React, TypeScript, and Vite. Features real-time search with debouncing, request cancellation, URL synchronization, and excellent UX.

## Features

- **Real-time Search**: Search results update as you type with intelligent debouncing
- **Request Cancellation**: Prevents outdated responses from overwriting newer results
- **URL Synchronization**: Search queries are reflected in the URL for bookmarking and sharing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to user's system preferences
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Clear visual feedback during search operations
- **Error Handling**: Graceful error states with retry functionality

## Technical Implementation

### Architecture

- **Custom Hook Pattern**: `useSearch` encapsulates all search logic with debouncing and cancellation
- **Component Separation**: Clean separation between input, results, and business logic
- **TypeScript**: Full type safety throughout the application
- **Minimal Dependencies**: Uses only React and TypeScript with no external UI libraries

### Key Features

1. **Debounced Input**: 800ms debounce prevents excessive API calls
2. **Request Cancellation**: Uses AbortController to cancel outdated requests
3. **URL Synchronization**: Automatically syncs search state with browser URL
4. **Mock API**: Simulated network requests with realistic delays
5. **Optimistic UI**: Results remain visible while new searches are in progress

### Components

- `SearchInput`: Handles user input with clear functionality and URL sync
- `SearchResults`: Displays results with loading, error, and empty states
- `useSearch`: Custom hook managing all search logic and state

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Type in the search input to start searching
2. Results appear as you type (with 800ms debounce)
3. Use the clear button (×) to reset the search
4. Press Escape to clear the search
5. Search queries are automatically saved in the URL

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Development

This project uses:

- **React 19** with TypeScript
- **Vite** for fast development and building
- **ESLint** for code quality
- **CSS** for styling (no external UI libraries)

## Project Structure

```
src/
├── components/
│   ├── SearchInput.tsx      # Search input component
│   ├── SearchInput.css      # Input styling
│   ├── SearchResults.tsx    # Results display component
│   └── SearchResults.css    # Results styling
├── hooks/
│   └── useSearch.ts         # Custom search hook
├── services/
│   ├── api.ts               # API service for HTTP requests
│   └── logger.ts            # Production-ready logger service
├── data.json                 # Mock search data (20 realistic entries)
├── App.tsx                   # Main app component
├── App.css                   # App styling
├── index.css                 # Global styles
└── main.tsx                  # App entry point
```

## Key Technical Decisions

### Search Performance

- **Debouncing**: 800ms delay prevents excessive API calls while typing
- **Request Cancellation**: AbortController ensures only latest results are shown
- **Minimum Query Length**: 2 characters required to trigger search

### URL Management

- **Automatic Sync**: Search queries are reflected in URL parameters
- **Bookmarkable**: Direct URL access works (e.g., `/?q=react`)
- **Browser Navigation**: Back/forward buttons work correctly

### User Experience

- **Loading States**: Clear visual feedback during searches
- **Error Handling**: Graceful error states with retry options
- **Empty States**: Helpful messages for no results
- **Keyboard Support**: Escape key to clear search

### Code Quality

- **TypeScript**: Full type safety throughout
- **Custom Hooks**: Encapsulated business logic
- **Component Separation**: Clean, maintainable architecture
- **No External Dependencies**: Minimal bundle size

### Data Structure

- **JSON Data**: 20 realistic search entries with comprehensive metadata
- **Rich Content**: Each entry includes title, description, category, tags, author, date, and URL
- **Smart Filtering**: Searches across title, description, category, tags, and author
- **Relevance Sorting**: Results sorted by title matches, category relevance, and date
- **Result Limiting**: Dynamic result count based on query length (3-10 results)

### API Architecture

- **HTTP Requests**: Real API calls to fetch data from JSON file
- **Caching**: 5-minute cache for improved performance
- **Request Cancellation**: AbortController for canceling outdated requests
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Response Format**: Structured API responses with metadata (total count, query time, etc.)
- **Additional Features**: Search suggestions and trending categories
