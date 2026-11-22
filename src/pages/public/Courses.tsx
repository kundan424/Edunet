import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  X, 
  ChevronRight, 
  Filter, 
  ArrowUpDown, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Award, 
  SlidersHorizontal 
} from 'lucide-react';
import { api } from '../../lib/api';
import { CourseCard } from '../../components/course/CourseCard';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { Page, CourseSummaryResponse } from '../../features/courses/types';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlDifficulty = searchParams.get('difficulty') || '';
  const urlTier = searchParams.get('tier') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [credentialType, setCredentialType] = useState(urlTier);
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 9;

  // Single source of truth from searchParams
  const searchQuery = urlSearch;
  const category = urlCategory;
  const difficulty = urlDifficulty;

  // Real backend query
  const { data, isLoading, error, refetch } = useQuery<Page<CourseSummaryResponse>>({
    queryKey: ['courses', searchQuery, category, difficulty, page, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        sort: sortBy === 'rating' ? 'rating,desc' : 'newest'
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
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (searchInput.trim()) {
        next.set('search', searchInput.trim());
      } else {
        next.delete('search');
      }
      return next;
    });
  };

  const handleCategorySelect = (catValue: string) => {
    setPage(0);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (category === catValue || !catValue) {
        next.delete('category');
      } else {
        next.set('category', catValue);
      }
      return next;
    });
  };

  const handleDifficultySelect = (diffValue: string) => {
    setPage(0);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (difficulty === diffValue || !diffValue) {
        next.delete('difficulty');
      } else {
        next.set('difficulty', diffValue);
      }
      return next;
    });
  };

  const handleCredentialSelect = (tierValue: string) => {
    setPage(0);
    setCredentialType(prev => (prev === tierValue ? '' : tierValue));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setCredentialType('');
    setPage(0);
    setSearchParams({});
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    setPage(0);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('search', tag);
      return next;
    });
  };

  // Academic Faculties definitions
  const academicFaculties = [
    { id: '', label: 'All Fields', count: 450 },
    { id: 'Development', label: 'Web & Software Engineering', count: 94 },
    { id: 'AI', label: 'Artificial Intelligence & ML', count: 68 },
    { id: 'Systems', label: 'Computer Science & Architecture', count: 82 },
    { id: 'Distributed', label: 'Distributed Systems & Cloud', count: 54 },
    { id: 'Security', label: 'Cybersecurity & Verification', count: 36 },
  ];

  // Credential Tiers definitions
  const credentialTiers = [
    { id: '', label: 'All Program Types', icon: BookOpen },
    { id: 'Certificate', label: 'Verified Certificates', icon: Award },
    { id: 'Specialization', label: 'Specialization Tracks', icon: Award },
    { id: 'Degree', label: 'University Degree Pathways', icon: GraduationCap },
  ];

  // Difficulty levels definitions
  const difficultyLevels = [
    { id: '', label: 'All Skill Levels' },
    { id: 'BEGINNER', label: 'Foundational (Introductory)' },
    { id: 'INTERMEDIATE', label: 'Intermediate' },
    { id: 'ADVANCED', label: 'Advanced Masterclasses' },
  ];

  // Curated fallback catalog courses when backend is unpopulated
  const curatedCatalog = [
    {
      id: 'fullstack-web-bootcamp',
      title: 'Full-Stack Web Architecture with React & Spring Boot',
      description: 'Design production-grade web systems with modular React components, Spring Boot microservices, database transactions, and Docker.',
      difficulty: 'INTERMEDIATE',
      price: 0,
      instructorName: 'Dr. Sarah Lin',
      rating: 4.92,
      studentCount: 14200,
      duration: '8 weeks · Self-paced',
      credentialType: 'Professional Certificate',
      tags: ['React', 'Spring Boot', 'PostgreSQL', 'Docker'],
      category: 'Development'
    },
    {
      id: 'stanford-llm',
      title: 'Large Language Models, Transformer Systems & Alignment',
      description: 'Transformer mechanics, tokenization, fine-tuning, prompt orchestration, and distributed model evaluation on real datasets.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'Prof. Christopher Manning',
      rating: 4.95,
      studentCount: 18400,
      duration: '10 weeks · Masterclass',
      credentialType: 'Specialization Track',
      tags: ['PyTorch', 'LLMs', 'Transformers', 'Fine-Tuning'],
      category: 'AI'
    },
    {
      id: 'cambridge-consensus',
      title: 'Distributed Consensus, Raft Protocols & Microservices',
      description: 'Implement distributed state machines, leader election, log replication, partition tolerance, and service discovery.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'Prof. Elena Rostova, PhD',
      rating: 4.96,
      studentCount: 9120,
      duration: '12 weeks · Masterclass',
      credentialType: 'Degree Pathway',
      tags: ['Rust', 'Distributed Systems', 'Raft Consensus'],
      category: 'Distributed'
    },
    {
      id: 'mit-algorithms',
      title: 'Foundations of Computer Science, Data Structures & Complexity',
      description: 'Rigorous algorithmic analysis, graph traversal, dynamic programming, tree balancing, and computational complexity theory.',
      difficulty: 'BEGINNER',
      price: 49.00,
      instructorName: 'Prof. David Thorne',
      rating: 4.93,
      studentCount: 22100,
      duration: '6 weeks · 4 hrs/wk',
      credentialType: 'Verified Certificate',
      tags: ['Algorithms', 'Data Structures', 'Python', 'Big-O'],
      category: 'Systems'
    },
    {
      id: 'cloud-devops-k8s',
      title: 'Cloud Infrastructure, Kubernetes Orchestration & CI/CD',
      description: 'Build enterprise deployment pipelines with containerization, Terraform infrastructure as code, service meshes, and observability.',
      difficulty: 'INTERMEDIATE',
      price: 0,
      instructorName: 'Marcus Vance',
      rating: 4.88,
      studentCount: 8430,
      duration: '6 weeks · Self-paced',
      credentialType: 'Professional Certificate',
      tags: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
      category: 'Development'
    },
    {
      id: 'applied-cybersecurity',
      title: 'Applied Application Security, Cryptography & Penetration Testing',
      description: 'Modern application vulnerability auditing, zero-trust network protocols, cryptographic signing, and threat modeling.',
      difficulty: 'INTERMEDIATE',
      price: 69.00,
      instructorName: 'Amina Chen',
      rating: 4.91,
      studentCount: 6540,
      duration: '8 weeks · 5 hrs/wk',
      credentialType: 'Verified Certificate',
      tags: ['AppSec', 'Cryptography', 'Zero-Trust', 'Auditing'],
      category: 'Security'
    }
  ];

  const hasBackendCourses = !isLoading && !error && data && data.content && data.content.length > 0;

  // Filter fallback curated programs
  const filteredCurated = curatedCatalog.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    if (category && p.category !== category) {
      return false;
    }
    if (difficulty && p.difficulty !== difficulty) {
      return false;
    }
    if (credentialType && !p.credentialType.toLowerCase().includes(credentialType.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeFiltersCount = (category ? 1 : 0) + (difficulty ? 1 : 0) + (credentialType ? 1 : 0) + (searchQuery ? 1 : 0);

  const popularQuickFilters = [
    'All Programs',
    'Full-Stack',
    'Distributed Systems',
    'AI & Machine Learning',
    'Algorithms',
    'Rust',
    'Kubernetes'
  ];

  return (
    <div className="w-full flex flex-col gap-10 bg-canvas text-foreground transition-colors duration-150">
      
      {/* 1. Header Chapter */}
      <div className="flex flex-col gap-3 pb-8 border-b border-rule">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-muted" />
          <span className="text-foreground font-medium">Course Catalog</span>
        </nav>

        {/* Category Eyebrow with Burnt Orange Accent */}
        <div className="superset-eyebrow">
          <span className="w-1.5 h-1.5 rounded-none bg-ember" />
          <span>CURRICULUM PATHWAYS &amp; CERTIFICATIONS</span>
        </div>

        {/* Main Display Heading */}
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-[42px] text-foreground tracking-[-0.025em] font-medium leading-tight">
          Explore all accredited courses and specializations.
        </h1>
        
        {/* Support Paragraph */}
        <p className="font-sans text-muted text-base sm:text-[17px] max-w-3xl leading-relaxed">
          Search over 450+ courses, modular video lessons, and verified completion certificates taught by leading university faculty and software practitioners.
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-card border border-rule text-foreground text-xs font-mono uppercase tracking-wider"
        >
          <Filter className="w-4 h-4 text-ember" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-mono uppercase tracking-wider text-ember hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      {/* 2. Main 2-Column Catalog Layout: Filter Sidebar Left, Course Grid Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
        
        {/* Left Column: Filter Sidebar */}
        <aside className={`lg:col-span-3 w-full ${isMobileFilterOpen ? 'block' : 'hidden lg:block'} sticky top-20`}>
          <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule flex flex-col gap-6 shadow-none">
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-rule">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-ember" />
                <h3 className="font-sans text-base text-foreground font-medium">
                  Catalog Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-none bg-muted-surface text-ember font-mono text-[10px] font-bold border border-rule flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-mono uppercase tracking-wider text-ember hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Group 1: Fields / Faculties */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ember font-normal">
                Fields of Study
              </h4>
              <div className="flex flex-col gap-1">
                {academicFaculties.map((fac) => {
                  const isSelected = category === fac.id;
                  return (
                    <button
                      key={fac.id || 'all'}
                      type="button"
                      onClick={() => handleCategorySelect(fac.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-left text-xs transition-colors cursor-pointer border ${
                        isSelected 
                          ? 'bg-action-bg text-action-text border-action-border font-medium' 
                          : 'text-foreground border-transparent hover:bg-wash hover:border-rule'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-3.5 h-3.5 rounded-none flex items-center justify-center border text-[10px] ${
                          isSelected ? 'border-action-text bg-action-text text-action-bg' : 'border-rule'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className="truncate">{fac.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 ml-2 ${isSelected ? 'opacity-80' : 'text-muted'}`}>
                        {fac.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 2: Program Tier */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-rule">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ember font-normal">
                Credential Type
              </h4>
              <div className="flex flex-col gap-1">
                {credentialTiers.map((tier) => {
                  const isSelected = credentialType === tier.id;
                  const Icon = tier.icon;
                  return (
                    <button
                      key={tier.id || 'all'}
                      type="button"
                      onClick={() => handleCredentialSelect(tier.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-left text-xs transition-colors cursor-pointer border ${
                        isSelected 
                          ? 'bg-action-bg text-action-text border-action-border font-medium' 
                          : 'text-foreground border-transparent hover:bg-wash hover:border-rule'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-ember' : 'text-muted'}`} />
                        <span className="truncate">{tier.label}</span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 shrink-0 ml-1 text-action-text" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 3: Difficulty Level */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-rule">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ember font-normal">
                Skill Level
              </h4>
              <div className="flex flex-col gap-1">
                {difficultyLevels.map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id || 'all'}
                      type="button"
                      onClick={() => handleDifficultySelect(lvl.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-left text-xs transition-colors cursor-pointer border ${
                        isSelected 
                          ? 'bg-action-bg text-action-text border-action-border font-medium' 
                          : 'text-foreground border-transparent hover:bg-wash hover:border-rule'
                      }`}
                    >
                      <span className="truncate">{lvl.label}</span>
                      {isSelected && <Check className="w-3 h-3 shrink-0 ml-1 text-action-text" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Educational Assurance Notice: 2px radius */}
            <div className="p-3.5 rounded-[2px] bg-wash border border-rule text-xs text-foreground space-y-1 mt-2">
              <div className="font-medium text-ember text-[11px] font-mono uppercase tracking-wider">
                Verifiable Quality
              </div>
              <p className="text-[11px] leading-relaxed text-muted">
                All courses include lifetime video access, interactive knowledge check quizzes, and authenticated completion certificates.
              </p>
            </div>

          </div>
        </aside>

        {/* Right Column: Search Toolbar, Course Grid, Pagination */}
        <main className="lg:col-span-9 w-full flex flex-col gap-6">
          
          {/* Top Search Input & Action Bar */}
          <div className="bg-card rounded-[10px] p-4 sm:p-5 border border-rule shadow-none flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search courses, instructors, or topics (e.g. React, Distributed Systems, Python)..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-wash text-foreground font-sans text-sm pl-10 pr-10 py-2.5 rounded-none border border-rule focus:border-ember outline-none transition-colors placeholder:text-muted"
                />
                {searchInput && (
                  <button 
                    type="button" 
                    onClick={clearAllFilters} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                className="shrink-0 h-[42px] px-5 rounded-none bg-action-bg hover:bg-ember text-action-text hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Quick Filter Tag Pills */}
            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-rule text-xs">
              <span className="text-muted font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-ember" />
                <span>Trending:</span>
              </span>
              {popularQuickFilters.map((tag) => {
                const isTagActive = (tag === 'All Programs' && !searchQuery) || (searchQuery === tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (tag === 'All Programs') clearAllFilters();
                      else handleQuickTagClick(tag);
                    }}
                    className={`px-3 py-1 rounded-none text-xs font-mono transition-colors cursor-pointer border ${
                      isTagActive
                        ? 'bg-action-bg text-action-text border-action-border font-medium'
                        : 'bg-wash hover:bg-muted-surface text-foreground border-rule hover:border-ember'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary & Active Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-muted">
            <div className="flex flex-wrap items-center gap-2">
              {hasBackendCourses ? (
                <span>Showing <strong className="text-foreground font-medium">{data.totalElements}</strong> programs</span>
              ) : (
                <span>Showing <strong className="text-foreground font-medium">{filteredCurated.length}</strong> academic curriculums</span>
              )}

              {/* Active Filter Badges */}
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-wash text-ember text-xs font-mono uppercase tracking-wider border border-rule">
                  <span>Field: {category}</span>
                  <button type="button" onClick={() => handleCategorySelect('')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {credentialType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-wash text-ember text-xs font-mono uppercase tracking-wider border border-rule">
                  <span>Tier: {credentialType}</span>
                  <button type="button" onClick={() => handleCredentialSelect('')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {difficulty && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-wash text-ember text-xs font-mono uppercase tracking-wider border border-rule">
                  <span>Level: {difficulty}</span>
                  <button type="button" onClick={() => handleDifficultySelect('')} className="hover:text-foreground cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFiltersCount > 0 && (
                <button 
                  type="button" 
                  onClick={clearAllFilters} 
                  className="text-ember font-mono uppercase tracking-wider hover:underline text-xs ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs font-mono uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="bg-transparent text-foreground font-medium text-xs border-b border-rule pb-0.5 outline-none cursor-pointer"
              >
                <option value="newest" className="bg-card text-foreground">Recently Published</option>
                <option value="rating" className="bg-card text-foreground">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Course Cards Grid */}
          {isLoading ? (
            <LoadingState message="Loading catalog programs..." />
          ) : error ? (
            <ErrorState 
              title="Unable to connect to course database" 
              message="Displaying offline accredited curriculum pathways. You can still explore syllabi and course specifications." 
              onRetry={() => refetch()} 
            />
          ) : hasBackendCourses ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {data.content.map(course => (
                  <CourseCard 
                    key={course.id}
                    id={course.id} 
                    title={course.title} 
                    description={course.description}
                    difficulty={course.difficulty}
                    price={course.price}
                    thumbnailUrl={course.thumbnailUrl}
                    instructorName={course.instructorName}
                    rating={course.rating}
                    studentCount={course.studentCount}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center mt-6 pt-8 border-t border-rule">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={data.first}
                      className="px-4 py-2 rounded-none border border-rule bg-card hover:bg-wash text-foreground text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer shadow-none"
                    >
                      ← Previous
                    </button>
                    <span className="font-mono text-xs text-muted px-2">
                      Page {data.number + 1} of {data.totalPages}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                      disabled={data.last}
                      className="px-4 py-2 rounded-none border border-rule bg-card hover:bg-wash text-foreground text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer shadow-none"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : filteredCurated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {filteredCurated.map(program => (
                <CourseCard 
                  key={program.id}
                  id={program.id}
                  title={program.title}
                  description={program.description}
                  difficulty={program.difficulty}
                  price={program.price}
                  instructorName={program.instructorName}
                  rating={program.rating}
                  studentCount={program.studentCount}
                  duration={program.duration}
                  credentialType={program.credentialType}
                  tags={program.tags}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 sm:p-16 border border-rule rounded-[10px] bg-card text-center flex flex-col items-center gap-4 shadow-none">
              <div className="w-12 h-12 rounded-none bg-wash border border-rule flex items-center justify-center text-ember">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-xl text-foreground font-medium">
                No matching programs found
              </h3>
              <p className="text-muted text-xs sm:text-sm max-w-md font-sans leading-relaxed">
                We couldn't find any courses matching your active filter criteria. Try adjusting your query or resetting all filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn-superset-primary mt-2"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

