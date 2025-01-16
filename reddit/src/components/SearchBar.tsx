import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import "../styles/SearchBar.css";

// let's define a searchResultinterface of what it looks like

interface SearchResult {
  _id: string;
  type: string;
  title: string;
  name: string;
}

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // if we're in the subreddit i will make search for posts and if we're inside of a homepage page or something we'll search for a subreddit.
  const subredditMatch = location.pathname.match(/^\/r\/([^/]+)/);
  const currentSubreddit = subredditMatch ? subredditMatch[1] : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const results: SearchResult[] = [];
  //perform search query
  const handleFocus = () => {
    setIsActive(true);
  };
  const handleBlur = () => setTimeout(() => setIsActive(false), 200);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleResultClick = (result: SearchResult) => {
    if (result.type === "post") {
      navigate(`/post/${result._id}`);
    } else {
      navigate(`/r/${result.name}`);
    }
    setIsActive(false);
    setSearchQuery("");
  };
  const getIconForType = (type: string) => {
    switch (type) {
      case "community":
        return "🌐";
      case "post":
        return "📝";
      default:
        return "•";
    }
  };
  return (
    <div className="search-wrapper">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={
            currentSubreddit
              ? `Search r/${currentSubreddit}`
              : "Search for a community"
          }
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentSubreddit && (
          <div className="search-scope">
            <span>in r/{currentSubreddit}</span>
          </div>
        )}
      </div>
      {isActive && (
        <div className="search-results">
          {searchQuery === "" ? (
            <div className="empty-state">
              <p>Try searching for posts or communities.</p>
            </div>
          ) : results && results.length > 0 ? (
            <ul className="results-list">
              {results.map((result) => (
                <li
                  key={result._id}
                  className="result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <span className="result-icon">
                    {getIconForType(result.type)}
                  </span>
                  <div className="result-container">
                    <span className="result-title">{result.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No results found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
