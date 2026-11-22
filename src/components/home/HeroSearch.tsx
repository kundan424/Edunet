import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';

interface HeroSearchProps {
  onCategorySelect?: (category: string) => void;
}

export function HeroSearch({ onCategorySelect }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const trendingCategories = [
    { label: 'Distributed Systems', query: 'Distributed' },
    { label: 'Applied LLMs', query: 'AI' },
    { label: 'Formal Methods', query: 'Formal' },
    { label: 'Rust Microkernels', query: 'Rust' },
    { label: 'Quantum Computing', query: 'Quantum' },
  ];

  const handlePillClick = (query: string) => {
    setSearchQuery(query);
    if (onCategorySelect) {
      onCategorySelect(query);
    }
    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Search Input adhering to Lumina Warm Editorial tokens */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="relative w-full flex items-center bg-card border border-rule rounded-[10px] p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:border-rule focus-within:ring-1 focus-within:ring-[#121212]/20 transition-all duration-150"
      >
        <div className="pl-3 pr-2 text-muted flex items-center justify-center">
          <Search className="w-4 h-4 text-muted" />
        </div>

        <input 
          type="text" 
          placeholder="Search 450+ university programs, specializations, degrees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent py-2.5 px-1 font-body text-sm text-foreground placeholder:text-muted focus:outline-none"
          aria-label="Search programs and courses"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-muted hover:text-foreground rounded transition-colors mr-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Filled Dark Button (#121212 background, #f8f8f6 text, 8px radius) */}
        <button 
          type="submit" 
          className="shrink-0 bg-card hover:bg-[#000000] active:bg-card text-[#f8f8f6] font-body text-sm font-medium px-4 h-9 rounded-lg transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Trending Tracks */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        <span className="text-muted font-medium">Trending tracks:</span>
        <div className="flex items-center flex-wrap gap-1.5">
          {trendingCategories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => handlePillClick(cat.query)}
              className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-wash hover:bg-[#e7e6e1] text-muted hover:text-foreground border border-rule transition-colors cursor-pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
