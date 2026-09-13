import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearchSubmit} 
      className="relative w-full max-w-2xl mt-4 sm:mt-6 bg-white rounded-full border border-midnight-ink/20 shadow-md flex items-center p-2 focus-within:ring-2 focus-within:ring-signal-blue focus-within:border-signal-blue transition-all"
    >
      <div className="pl-4 pr-2 flex items-center justify-center text-midnight-ink/50">
        <Search className="w-5 h-5" />
      </div>
      <input 
        type="text" 
        placeholder="What do you want to learn today?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent py-3 px-2 font-usual text-base md:text-lg focus:outline-none placeholder:text-midnight-ink/50"
        aria-label="Search courses"
      />
      <button 
        type="submit" 
        className="bg-midnight-ink text-white font-usual font-bold px-6 py-3 rounded-full hover:bg-midnight-ink/80 transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
