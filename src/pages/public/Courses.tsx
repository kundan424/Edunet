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
    { id: '', label: 'All Faculties', count: 450 },
    { id: 'Systems', label: 'Computer Science & Systems', count: 84 },
    { id: 'AI', label: 'Data Science & Foundational AI', count: 62 },
    { id: 'Distributed', label: 'Distributed Systems & Runtimes', count: 45 },
    { id: 'Security', label: 'Formal Verification & Security', count: 31 },
    { id: 'Cryptography', label: 'Applied Mathematics & Crypto', count: 38 },
  ];

  // Credential Tiers definitions
  const credentialTiers = [
    { id: '', label: 'All Program Types', icon: BookOpen },
    { id: 'Specialization', label: 'Specializations', icon: Award },
    { id: 'Degree', label: 'University Degrees', icon: GraduationCap },
    { id: 'Certificate', label: 'Professional Certificates', icon: Award },
    { id: 'MasterTrack', label: 'MasterTrack™ Credentials', icon: BookOpen },
  ];

  // Difficulty levels definitions
  const difficultyLevels = [
    { id: '', label: 'All Levels' },
    { id: 'BEGINNER', label: 'Foundational (Introductory)' },
    { id: 'INTERMEDIATE', label: 'Intermediate' },
    { id: 'ADVANCED', label: 'Advanced Research' },
  ];

  // Curated Lumina catalog programs directly from Stitch design specification
  const curatedCatalog = [
    {
      id: 'stanford-llm',
      title: 'Large Language Model Systems, Alignment & Reasoning Engines',
      description: 'Transformer math, speculative decoding, RLHF/DPO algorithms, and distributed inference orchestration on raw GPUs.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'Prof. Christopher Manning',
      rating: 4.9,
      studentCount: 18400,
      institution: 'Stanford AI Lab',
      duration: '3 months · 6 hrs/wk',
      credentialType: 'Specialization',
      tags: ['PyTorch', 'vLLM', 'TRL & DPO', 'MCTS'],
      category: 'AI'
    },
    {
      id: 'cambridge-consensus',
      title: 'Distributed Consensus, eBPF & Fault-Tolerant Microkernels',
      description: 'Build a production Raft consensus engine, instrument Linux kernel tracepoints, and audit distributed crash recovery.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'Prof. Elena Rostova, PhD',
      rating: 4.95,
      studentCount: 9120,
      institution: 'Univ. of Cambridge',
      duration: '4 months · 8 hrs/wk',
      credentialType: 'Degree Credit Eligible',
      tags: ['Rust', 'eBPF / Linux', 'Raft Consensus', 'Jepsen Tests'],
      category: 'Distributed'
    },
    {
      id: 'mit-formal-methods',
      title: 'Formal Methods, TLA+ Verification & Cryptographic Protocols',
      description: 'Rigorous specification of concurrent software architectures, state-space model checking, and zero-knowledge proof primitives.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'MIT CSAIL Research Faculty',
      rating: 4.92,
      studentCount: 7650,
      institution: 'MIT CSAIL',
      duration: '3 months · 6 hrs/wk',
      credentialType: 'Professional Certificate',
      tags: ['TLA+ / PlusCal', 'Coq Proofs', 'ZK-SNARKs', 'Protocol Security'],
      category: 'Security'
    },
    {
      id: 'cmu-msc-ai',
      title: 'Master of Science in Software Systems & Autonomous Intelligence',
      description: 'The identical diploma awarded on campus in Pittsburgh. Comprehensive curriculum spanning compiler engineering, distributed clusters, and embodied AI.',
      difficulty: 'ADVANCED',
      price: 1200,
      instructorName: 'Carnegie Mellon SCS Faculty',
      rating: 4.98,
      studentCount: 120,
      institution: 'Carnegie Mellon SCS',
      duration: '18-24 months · Flexible',
      credentialType: 'Full Master\'s Degree',
      tags: ['Accredited MSc', 'Compilers', 'HPC Systems', 'Thesis Option'],
      category: 'Degree'
    },
    {
      id: 'eth-quantum',
      title: 'Quantum Computing Primitives, Qiskit & Quantum Information',
      description: 'Linear algebraic foundations, quantum circuits, Grover and Shor algorithms, and simulated noisy intermediate-scale quantum devices.',
      difficulty: 'INTERMEDIATE',
      price: 0,
      instructorName: 'ETH Zürich D-INFK Faculty',
      rating: 4.88,
      studentCount: 6410,
      institution: 'ETH Zürich D-INFK',
      duration: '2 months · 5 hrs/wk',
      credentialType: 'Specialization',
      tags: ['Qiskit', 'Quantum Algorithms', 'Error Mitigation'],
      category: 'Quantum'
    },
    {
      id: 'oxford-type-theory',
      title: 'Applied Category Theory, Type Systems & Compiler Frontends',
      description: 'Monadic effects, dependent types, Hindley-Milner inference engines, and formally verified intermediate representations.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'Oxford Dept. of Computing',
      rating: 4.97,
      studentCount: 5320,
      institution: 'University of Oxford',
      duration: '3 months · 7 hrs/wk',
      credentialType: 'MasterTrack™ Certificate',
      tags: ['Haskell', 'Type Theory', 'LLVM IR', 'Compilers'],
      category: 'Systems'
    },
    {
      id: 'berkeley-compilers',
      title: 'Compiler Construction, Program Analysis & LLVM Code Generation',
      description: 'Control flow graphs, SSA conversion, register allocation, instruction scheduling, and JIT runtime architectures.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'UC Berkeley EECS Faculty',
      rating: 4.94,
      studentCount: 4210,
      institution: 'UC Berkeley EECS',
      duration: '3 months · 6 hrs/wk',
      credentialType: 'Professional Certificate',
      tags: ['C++', 'LLVM', 'SSA Form', 'Optimizations'],
      category: 'Systems'
    },
    {
      id: 'mit-zero-knowledge',
      title: 'Applied Cryptography, Zero-Knowledge Proofs & Protocol Security',
      description: 'Elliptic curve pairings, Plonk and Groth16 proof systems, polynomial commitments, and cryptographic circuit design.',
      difficulty: 'ADVANCED',
      price: 0,
      instructorName: 'MIT CSAIL Crypto Group',
      rating: 4.96,
      studentCount: 3890,
      institution: 'MIT CSAIL',
      duration: '3 months · 6 hrs/wk',
      credentialType: 'Specialization',
      tags: ['Circom', 'ZK-Rollups', 'Elliptic Curves', 'Halo2'],
      category: 'Cryptography'
    },
    {
      id: 'stanford-embodied-ai',
      title: 'Embodied Intelligence, Diffusion Policies & Sim-to-Real Robotics',
      description: 'Spatial representations, imitation learning, vision-language-action policies, and deployment on robotic manipulators.',
      difficulty: 'INTERMEDIATE',
      price: 0,
      instructorName: 'Stanford Robotics Lab',
      rating: 4.91,
      studentCount: 5120,
      institution: 'Stanford AI Institute',
      duration: '2.5 months · 5 hrs/wk',
      credentialType: 'MasterTrack™ Certificate',
      tags: ['Robotics', 'Isaac Gym', 'Diffusion Policy', 'PyBullet'],
      category: 'AI'
    }
  ];

  const hasBackendCourses = !isLoading && !error && data?.content && data.content.length > 0;

  // Filter curated programs
  const filteredCurated = curatedCatalog.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || 
                    p.description.toLowerCase().includes(q) || 
                    p.institution.toLowerCase().includes(q) ||
                    p.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (category && p.category.toLowerCase() !== category.toLowerCase()) {
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
    'Distributed Systems',
    'Applied LLMs',
    'Rust',
    'Formal Methods',
    'Quantum',
    'Compilers'
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-2.5 pb-6 border-b border-[#e7e6e1]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#7b7974] mb-1">
          <Link to="/" className="hover:text-[#121212] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#9c9a92]" />
          <span className="text-[#121212] font-medium">Browse Courses</span>
        </nav>

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efeeeb] text-[#7b7974] font-body text-xs tracking-wider uppercase self-start border border-[#e7e6e1]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] inline-block animate-pulse"></span>
          <span className="font-medium text-[#373734]">Academic Catalog · Fall 2026 Curriculum</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-[36px] text-[#121212] tracking-tight font-semibold">
          Browse Programs &amp; Masterclasses
        </h1>
        
        {/* Description */}
        <p className="font-body text-[#373734] text-base sm:text-[17px] max-w-3xl leading-relaxed">
          Explore university-accredited degrees, faculty specializations, and verified computing masterclasses from world-class research laboratories.
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] text-[#121212] text-sm font-medium shadow-xs"
        >
          <Filter className="w-4 h-4 text-[#d97757]" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-[#d97757] font-medium hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* 2. Main 2-Column Layout (Vertical Filters Sidebar on Left, Content on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Vertical Filter Sidebar */}
        <aside className={`lg:col-span-3 w-full ${isMobileFilterOpen ? 'block' : 'hidden lg:block'} sticky top-24`}>
          <div className="bg-[#ffffff] rounded-[20px] p-5 sm:p-6 border border-[#e7e6e1] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6">
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#d97757]" />
                <h3 className="font-heading text-lg text-[#121212] font-semibold">
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#121212] text-[#f8f8f6] font-mono text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[#d97757] font-medium hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Vertical Filter Group 1: Academic Faculties */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                Academic Faculties
              </h4>
              <div className="flex flex-col gap-1.5">
                {academicFaculties.map((fac) => {
                  const isSelected = category === fac.id;
                  return (
                    <button
                      key={fac.id || 'all'}
                      type="button"
                      onClick={() => handleCategorySelect(fac.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#121212] text-[#f8f8f6] font-medium' 
                          : 'text-[#373734] hover:bg-[#efeeeb] hover:text-[#121212]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                          isSelected ? 'border-[#f8f8f6] bg-[#f8f8f6] text-[#121212]' : 'border-[#b7b7b5]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className="truncate">{fac.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 ml-2 ${isSelected ? 'text-[#e7e6e1]' : 'text-[#7b7974]'}`}>
                        {fac.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Filter Group 2: Credential Tier */}
            <div className="flex flex-col gap-3 pt-4 border-t border-[#e7e6e1]">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                Program Tier
              </h4>
              <div className="flex flex-col gap-1.5">
                {credentialTiers.map((tier) => {
                  const isSelected = credentialType === tier.id;
                  const Icon = tier.icon;
                  return (
                    <button
                      key={tier.id || 'all'}
                      type="button"
                      onClick={() => handleCredentialSelect(tier.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#121212] text-[#f8f8f6] font-medium' 
                          : 'text-[#373734] hover:bg-[#efeeeb] hover:text-[#121212]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#d97757]' : 'text-[#7b7974]'}`} />
                        <span className="truncate">{tier.label}</span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 shrink-0 ml-1 text-[#f8f8f6]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Filter Group 3: Difficulty Level */}
            <div className="flex flex-col gap-3 pt-4 border-t border-[#e7e6e1]">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                Difficulty Level
              </h4>
              <div className="flex flex-col gap-1.5">
                {difficultyLevels.map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id || 'all'}
                      type="button"
                      onClick={() => handleDifficultySelect(lvl.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#121212] text-[#f8f8f6] font-medium' 
                          : 'text-[#373734] hover:bg-[#efeeeb] hover:text-[#121212]'
                      }`}
                    >
                      <span className="truncate">{lvl.label}</span>
                      {isSelected && <Check className="w-3 h-3 shrink-0 ml-1 text-[#f8f8f6]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning Notice */}
            <div className="p-3.5 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] text-xs text-[#373734] space-y-1.5 mt-2">
              <div className="font-semibold text-[#121212] text-[11px] font-mono uppercase tracking-wider">
                Course Standards
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#7b7974]">
                All courses include self-paced learning, interactive quizzes, community discussions, and certificates upon completion.
              </p>
            </div>

          </div>
        </aside>

        {/* Right Column: Search Toolbar, Course Grid, Pagination */}
        <main className="lg:col-span-9 w-full flex flex-col gap-6">
          
          {/* Top Search Input & Action Bar */}
          <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#e7e6e1] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b7974]" />
                <input 
                  type="text" 
                  placeholder="Search 450+ programs (e.g. Raft, PyTorch, Formal Invariants, eBPF)..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-[#efeeeb]/70 hover:bg-[#efeeeb] focus:bg-[#ffffff] text-[#121212] font-body text-sm pl-10 pr-10 py-2.5 rounded-xl border border-[#e7e6e1] focus:border-[#121212] outline-none transition-all placeholder:text-[#9c9a92]"
                />
                {searchInput && (
                  <button 
                    type="button" 
                    onClick={clearAllFilters} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b7974] hover:text-[#121212] p-1 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                className="shrink-0 px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-body text-sm font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Quick Filter Tag Pills */}
            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-[#e7e6e1]/80 text-xs">
              <span className="text-[#7b7974] font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#d97757]" />
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                      isTagActive
                        ? 'bg-[#121212] text-[#f8f8f6] border-[#121212]'
                        : 'bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#373734] hover:text-[#121212] border-[#e7e6e1]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary & Active Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#7b7974]">
            <div className="flex flex-wrap items-center gap-2">
              {hasBackendCourses ? (
                <span>Showing <strong className="text-[#121212]">{data.totalElements}</strong> accredited programs</span>
              ) : (
                <span>Showing <strong className="text-[#121212]">{filteredCurated.length}</strong> academic curriculum pathways</span>
              )}

              {/* Active Filter Badges */}
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#efeeeb] text-[#121212] text-xs font-medium border border-[#e7e6e1]">
                  <span>Faculty: {category}</span>
                  <button type="button" onClick={() => handleCategorySelect('')} className="hover:text-[#d97757] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {credentialType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#efeeeb] text-[#121212] text-xs font-medium border border-[#e7e6e1]">
                  <span>Tier: {credentialType}</span>
                  <button type="button" onClick={() => handleCredentialSelect('')} className="hover:text-[#d97757] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {difficulty && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#efeeeb] text-[#121212] text-xs font-medium border border-[#e7e6e1]">
                  <span>Level: {difficulty}</span>
                  <button type="button" onClick={() => handleDifficultySelect('')} className="hover:text-[#d97757] cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFiltersCount > 0 && (
                <button 
                  type="button" 
                  onClick={clearAllFilters} 
                  className="text-[#d97757] font-medium hover:underline text-xs ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7b7974]" />
              <span className="text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="bg-transparent text-[#121212] font-medium text-xs border-b border-[#b7b7b5] pb-0.5 outline-none cursor-pointer"
              >
                <option value="newest">Recently Published</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Course Cards Grid */}
          {isLoading ? (
            <LoadingState message="Loading catalog curriculum..." />
          ) : error ? (
            <ErrorState 
              title="Failed to connect to catalog database" 
              message="Displaying offline academic curriculum pathways. You can still review syllabi and program specifications." 
              onRetry={() => refetch()} 
            />
          ) : hasBackendCourses ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center mt-6 pt-8 border-t border-[#e7e6e1]">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={data.first}
                      className="px-4 py-2 rounded-lg border border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb] text-[#121212] text-sm font-medium transition-colors disabled:opacity-40 disabled:hover:bg-[#ffffff] cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="font-mono text-xs text-[#7b7974] px-2">
                      Page {data.number + 1} of {data.totalPages}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                      disabled={data.last}
                      className="px-4 py-2 rounded-lg border border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb] text-[#121212] text-sm font-medium transition-colors disabled:opacity-40 disabled:hover:bg-[#ffffff] cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : filteredCurated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  institution={program.institution}
                  duration={program.duration}
                  credentialType={program.credentialType}
                  tags={program.tags}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 sm:p-16 border border-[#e7e6e1] rounded-2xl bg-[#ffffff] text-center flex flex-col items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#7b7974]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl text-[#121212]">
                No matching programs found
              </h3>
              <p className="text-[#373734] text-sm max-w-md">
                We couldn't find any courses matching your active filter criteria. Try adjusting your query or resetting all filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 px-5 py-2.5 rounded-lg bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-medium text-xs transition-colors cursor-pointer"
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
