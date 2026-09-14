import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { api } from '../../lib/api';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { CourseCard } from '../../components/course/CourseCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import type { Page, CourseSummaryResponse } from '../../features/courses/types';

export function Courses() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 9;

  // Real backend query
  const { data, isLoading, error, refetch } = useQuery<Page<CourseSummaryResponse>>({
    queryKey: ['courses', searchQuery, category, difficulty, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        sort: 'newest'
      });
      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      
      return api.get(`/api/v1/courses?${params.toString()}`);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(0);
  };

  const handleFilterChange = () => {
    setPage(0); // Reset page on filter change
  };

  return (
    <div className="flex flex-col gap-12 md:gap-16 w-full">
      <div className="flex flex-col gap-4 md:gap-6 max-w-2xl">
        <SectionHeading>Discover Courses</SectionHeading>
        <BodyText>
          Browse our curated catalog of technical and creative courses. 
          Find the perfect fit for your skill level.
        </BodyText>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row flex-wrap gap-4 items-stretch lg:items-center border-y border-midnight-ink py-6">
        <div className="relative grow sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
          <input 
            type="text" 
            placeholder="Search courses (e.g. Java, Design)..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-midnight-ink bg-transparent pl-12 pr-10 py-3 sm:py-2 w-full focus:outline-none focus:ring-1 focus:ring-signal-blue font-usual text-sm font-bold placeholder:font-normal"
          />
          {searchInput && (
            <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight-ink hover:text-ember-red transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <select 
          value={category}
          onChange={(e) => { setCategory(e.target.value); handleFilterChange(); }}
          className="border border-midnight-ink bg-transparent px-4 py-3 sm:py-2 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-signal-blue font-usual text-sm font-bold appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
        </select>
        
        <select 
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); handleFilterChange(); }}
          className="border border-midnight-ink bg-transparent px-4 py-3 sm:py-2 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-signal-blue font-usual text-sm font-bold appearance-none cursor-pointer"
        >
          <option value="">Any Difficulty</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        
        <PillButton type="submit" className="py-3 sm:py-2 px-8 w-full sm:w-auto lg:ml-auto justify-center bg-midnight-ink text-cream-paper hover:bg-signal-blue">
          Search
        </PillButton>
      </form>

      {/* Results Rendering */}
      {isLoading ? (
        <LoadingState message="Loading courses..." />
      ) : error ? (
        <ErrorState title="Failed to load courses" message="We couldn't connect to the database. Please try again." onRetry={() => refetch()} />
      ) : data?.content && data.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.content.map(course => (
              <CourseCard 
                key={course.id}
                id={course.id} 
                title={course.title} 
                description={course.description}
                difficulty={course.difficulty}
                price={course.price}
                instructorName={course.instructorName}
                rating={course.rating}
                studentCount={course.studentCount}
              />
            ))}
          </div>

          {/* Real Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center mt-4 md:mt-8 border-t border-midnight-ink pt-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={data.first}
                  className="px-6 py-2 border border-midnight-ink font-bold hover:bg-midnight-ink hover:text-cream-paper transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-midnight-ink"
                >
                  Previous
                </button>
                <span className="font-usual text-sm font-bold opacity-70">
                  Page {data.number + 1} of {data.totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                  disabled={data.last}
                  className="px-6 py-2 border border-midnight-ink font-bold hover:bg-midnight-ink hover:text-cream-paper transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-midnight-ink"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState 
          title={searchQuery || category || difficulty ? "No matching courses found" : "No courses available"} 
          message={searchQuery || category || difficulty ? "Try adjusting your search criteria or clearing filters." : "We are currently preparing our course catalog. Check back later!"}
          actionLabel={searchQuery || category || difficulty ? "Clear Filters" : undefined}
          onAction={clearSearch}
        />
      )}
    </div>
  );
}
