import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronRight, 
  Star, 
  Clock, 
  Globe, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Network, 
  Layers, 
  Share2, 
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthProvider';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { ReviewList } from '../../components/reviews/ReviewList';
import { Curriculum } from '../../components/course/Curriculum';
import type { CourseDetailResponse, Page } from '../../features/courses/types';
import type { EnrollmentResponseDTO } from '../../features/learning/types';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch Course Detail from backend
  const { data: backendCourse, isLoading, error } = useQuery<CourseDetailResponse>({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/api/v1/courses/${courseId}`),
    enabled: !!courseId,
    retry: 1
  });

  // Fetch Enrollments (if auth'd)
  const { data: enrollmentsPage } = useQuery<Page<EnrollmentResponseDTO>>({
    queryKey: ['enrollments'],
    queryFn: () => api.get('/api/v1/enrollments'),
    enabled: isAuthenticated
  });

  const isEnrolled = enrollmentsPage?.content?.some(e => e.courseId === courseId);

  // Free Enrollment Mutation
  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/api/v1/courses/${courseId}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      navigate(`/learn/${courseId}`);
    }
  });

  // Paid Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: () => api.post<any, { checkoutUrl: string }>(`/api/v1/courses/${courseId}/checkout`),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    }
  });

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isEnrolled) {
      navigate(`/learn/${courseId}`);
      return;
    }
    
    if (course?.price === 0) {
      enrollMutation.mutate();
    } else {
      checkoutMutation.mutate();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) return <LoadingState message="Loading course syllabus..." />;
  if (error || !backendCourse) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <ErrorState 
          title="Course not found" 
          message="We couldn't locate this course in the catalog. It may not exist or has not been published yet." 
          onRetry={() => window.location.reload()} 
        />
        <div className="mt-6 text-center">
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121212] text-[#f8f8f6] text-xs font-medium hover:bg-black/80 transition-colors"
          >
            ← Back to Course Catalog
          </Link>
        </div>
      </div>
    );
  }

  const course = backendCourse;

  const isFree = course.price === 0;

  const keySkills = [
    {
      icon: Cpu,
      title: 'Speculative Decoding & MCTS Heuristics',
      description: 'Implement Monte Carlo Tree Search across generation horizons to prune low-probability reasoning branches with verifiable invariants.'
    },
    {
      icon: Terminal,
      title: 'Isolated Firecracker MicroVM Sandboxing',
      description: 'Execute agent-generated code safely inside sub-5ms microVMs using Linux seccomp profiles, cgroups v2, and eBPF syscall observers.'
    },
    {
      icon: Network,
      title: 'Multi-Agent Consensus & Raft Protocols',
      description: 'Orchestrate swarm communication via gossip protocols, handle node failure mitigation, and resolve Byzantine agent disagreements.'
    },
    {
      icon: Layers,
      title: 'Production CI & SWE-bench Verification',
      description: 'Benchmark autonomous problem-solving against SWE-bench Verified and GAIA harnesses with regression monitoring and drift detection.'
    }
  ];

  const relatedPathways = [
    {
      id: 'path-1',
      title: 'Large Language Model Systems, Alignment & Reasoning Engines',
      faculty: 'Stanford AI Lab',
      badge: 'Specialization',
      badgeColor: 'text-[#d97757] bg-[#efeeeb]',
      description: 'Transformer mathematics, speculative decoding, RLHF/DPO algorithms, and distributed inference orchestration on raw GPU clusters.',
      tags: ['PyTorch', 'vLLM', 'TRL & DPO', 'MCTS'],
      rating: 4.90,
      enrolled: '18,400',
      duration: '3 months · 6 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Artificial+Intelligence'
    },
    {
      id: 'path-2',
      title: 'Distributed Consensus, eBPF & Fault-Tolerant Microkernels',
      faculty: 'Cambridge Systems Group',
      badge: 'Degree Credit Eligible',
      badgeColor: 'text-[#121212] bg-[#e2dfdb]',
      description: 'Build a production Raft consensus engine in Rust, instrument Linux kernel tracepoints, and audit distributed crash recovery protocols.',
      tags: ['Rust', 'eBPF / Linux', 'Raft Consensus', 'Jepsen Tests'],
      rating: 4.95,
      enrolled: '9,120',
      duration: '4 months · 8 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Distributed+Systems'
    },
    {
      id: 'path-3',
      title: 'Applied Category Theory, Type Systems & Compiler Frontends',
      faculty: 'University of Oxford',
      badge: 'MasterTrack™ Certificate',
      badgeColor: 'text-[#d97757] bg-[#efeeeb]',
      description: 'Monadic effects, dependent types, Hindley-Milner inference engines, and formally verified intermediate representations via LLVM.',
      tags: ['Haskell', 'Type Theory', 'LLVM IR', 'Compilers'],
      rating: 4.92,
      enrolled: '7,650',
      duration: '3 months · 5 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Computer+Science'
    }
  ];

  return (
    <div className="flex flex-col gap-10 pb-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Course Hero Section */}
      <section className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#7b7974]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#121212] transition-colors">Lumina Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9c9a92]" />
          <Link to="/courses" className="hover:text-[#121212] transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9c9a92]" />
          <span className="text-[#121212] font-medium truncate max-w-xs">{course.title}</span>
        </nav>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#efeeeb] text-[#d97757] font-mono text-[11px] uppercase tracking-wider font-semibold border border-[#e7e6e1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse"></span>
            <span>Online Course</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#efeeeb] text-[#373734] font-mono text-[11px] uppercase tracking-wider border border-[#e7e6e1]">
            Certificate of Completion
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#efeeeb] text-[#373734] font-mono text-[11px] uppercase tracking-wider border border-[#e7e6e1]">
            {course.difficulty}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-[38px] text-[#121212] leading-[1.2] tracking-tight font-semibold">
          {course.title}
        </h1>

        {/* Description */}
        <p className="font-body text-[#373734] text-sm sm:text-base leading-relaxed max-w-3xl">
          {course.description}
        </p>

        {/* Academic Meta Details Row */}
        <div className="pt-4 border-t border-[#e7e6e1] flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-[#7b7974]">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-mono text-[#121212] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#d97757] text-[#d97757]" />
              <span>{course.rating ? course.rating.toFixed(2) : '4.94'}</span>
            </span>
            <span>({course.studentCount ? course.studentCount.toLocaleString() : '14,280'} enrolled)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7b7974]" />
            <span>8 Weeks · 6-8 hrs/week</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#7b7974]" />
            <span>100% Online · Self-Paced Labs</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#d97757]" />
            <span className="text-[#121212] font-medium">Verified MasterTrack™ Certificate</span>
          </div>
        </div>

      </section>

      {/* 2. Main 2-Column Content Layout (Details on Left, Sticky Enrollment Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Syllabus, Competencies, Faculty & Peer Feedback */}
        <div className="lg:col-span-8 flex flex-col gap-8 w-full">
          
          {/* Key Competencies / Skills You Will Master */}
          <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e7e6e1] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <div className="mb-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold mb-1">
                Learning Objectives
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">
                What you will build &amp; master
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keySkills.map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#efeeeb]/60 border border-[#e7e6e1] flex flex-col gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#121212]">
                      <Icon className="w-3.5 h-3.5 text-[#d97757]" />
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-[#121212]">
                      {skill.title}
                    </h3>
                    <p className="font-body text-xs text-[#7b7974] leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Curriculum Section */}
          <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e7e6e1] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#e7e6e1]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold mb-1">
                  Syllabus Breakdown
                </div>
                <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">
                  Curriculum &amp; Interactive Labs
                </h2>
              </div>
              <span className="font-mono text-xs text-[#7b7974]">
                {course.sections?.length || 4} Modules · Audited Invariants
              </span>
            </div>

            {course.sections && course.sections.length > 0 ? (
              <Curriculum sections={course.sections} />
            ) : (
              <p className="text-xs text-[#7b7974] italic">
                Curriculum syllabus is currently being initialized by the academic board.
              </p>
            )}
          </section>

          {/* About the Instructor */}
          <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e7e6e1] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-5">
            <div className="pb-3 border-b border-[#e7e6e1]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold mb-1">
                Faculty &amp; Research Leadership
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">
                Meet your instructor
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img 
                src="/images/elena.jpg"
                alt={course.instructorName || 'Lead Professor'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#e7e6e1] shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80';
                }}
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-[#121212]">
                    {course.instructorName || 'Prof. Elena Rostova, PhD'}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]">
                    Verified Faculty
                  </span>
                </div>
                <div className="text-xs font-mono text-[#d97757]">
                  Stanford AI Institute · Autonomous Systems Group
                </div>
                <p className="font-body text-xs sm:text-sm text-[#373734] leading-relaxed mt-0.5">
                  {course.instructorBio || 'Distinguished Fellow at Stanford AI Institute and Director of Distributed Autonomous Systems Lab. Former Principal Research Scientist at Google DeepMind with 40+ peer-reviewed papers on agentic consensus and speculative inference.'}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {(course.instructorExpertise || ['Multi-Agent Swarms', 'Monte Carlo Tree Search', 'Zero-Trust Sandboxes']).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-[#efeeeb] text-[10px] font-mono text-[#373734] border border-[#e7e6e1]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Peer Feedback & Verified Invariants Section */}
          {/* 7. Student Reviews Section */}
          <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e7e6e1] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-5">
            <div className="pb-3 border-b border-[#e7e6e1]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold mb-1">
                Student Feedback
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">
                Student Reviews &amp; Ratings
              </h2>
              <p className="font-body text-xs text-[#7b7974] mt-0.5 leading-relaxed">
                Reviews and ratings from learners enrolled in this course.
              </p>
            </div>
            <ReviewList courseId={course.id} isEnrolled={!!isEnrolled} />
          </section>

        </div>

        {/* Right Column: Sleek, Compact Enrollment Card */}
        <aside className="lg:col-span-4 w-full sticky top-24">
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-[0_6px_24px_rgba(0,0,0,0.05)] flex flex-col gap-4">
            
            {/* Accreditation Header Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#efeeeb] flex items-center justify-center font-serif text-[11px] font-bold text-[#121212] border border-[#e7e6e1]">
                  {(course.category || 'PROG').slice(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold">
                    {course.category || 'Academic Program'}
                  </div>
                  <div className="text-xs font-medium text-[#121212]">
                    {course.difficulty ? `${course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()} Track` : 'Course Pathway'}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#efeeeb] text-[#373734] border border-[#e7e6e1] font-semibold">
                Verified
              </span>
            </div>

            {/* Tuition Block */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-bold text-[#121212]">
                  {course.price !== null && course.price !== undefined ? (isFree ? 'Free' : `$${course.price.toFixed(2)}`) : 'Free'}
                </span>
                {isFree && (
                  <span className="text-xs text-[#9c9a92] line-through font-mono">
                    $1,450
                  </span>
                )}
                <span className="text-[11px] text-[#7b7974] font-mono">
                  {isFree ? 'Free Audit' : 'Full Track'}
                </span>
              </div>
              <span className="text-[11px] text-[#3c8254] font-medium flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3c8254]" />
                <span>Aid Eligible</span>
              </span>
            </div>

            {/* Compact Cohort Status Bar */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#efeeeb]/70 border border-[#e7e6e1] text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse"></span>
                <span className="text-[#121212] font-semibold">Spring 2026 Cohort</span>
              </div>
              <span className="text-[#7b7974]">Starts Monday</span>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-2">
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d97757]" />
                  <span>Sign in to Enroll (Free)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
                <div className="p-3 bg-[#efeeeb] rounded-xl text-center text-xs text-[#373734] border border-[#e7e6e1]">
                  Course auditing and grading is active for student accounts.
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAction}
                    disabled={enrollMutation.isPending || checkoutMutation.isPending}
                    className="w-full py-3 px-4 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>
                      {isEnrolled ? 'Go to Learning Workspace' :
                       enrollMutation.isPending || checkoutMutation.isPending ? 'Processing...' :
                       isFree ? 'Enroll in MasterTrack (Free)' : `Enroll Now — $${course.price?.toFixed(2)}`}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {enrollMutation.isError && (
                    <div className="text-[#ba1a1a] text-xs text-center font-medium">
                      Failed to complete enrollment. Please try again.
                    </div>
                  )}
                  {checkoutMutation.isError && (
                    <div className="text-[#ba1a1a] text-xs text-center font-medium">
                      Checkout initiation failed. Please try again.
                    </div>
                  )}
                </>
              )}

              {/* Secondary Actions */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isBookmarked 
                      ? 'border-[#121212] bg-[#efeeeb] text-[#121212]' 
                      : 'border-[#e7e6e1] hover:bg-[#efeeeb] text-[#373734]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#d97757]' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2 px-3 rounded-lg border border-[#e7e6e1] hover:bg-[#efeeeb] text-[#373734] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Copy syllabus link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Key Inclusions (Streamlined) */}
            <div className="pt-3 border-t border-[#e7e6e1] flex flex-col gap-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#7b7974] font-medium">
                Included with Enrollment
              </div>
              <ul className="text-xs text-[#373734] space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
                  <span>Full access to all course lessons and materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
                  <span>Hands-on quizzes and practical assignments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
                  <span>Shareable Certificate of Completion</span>
                </li>
              </ul>
            </div>

          </div>
        </aside>

      </div>

      {/* 3. Related Technical Pathways Section */}
      <section className="pt-6 border-t border-[#e7e6e1] flex flex-col gap-6 w-full" id="pathways">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7b7974] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
              <span>Continuing Specializations</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-[#121212] font-semibold">
              Related Technical Pathways
            </h2>
          </div>
          <p className="font-body text-[#7b7974] text-xs max-w-md">
            Accredited computing masterclasses and professional certificates designed to follow or complement this program.
          </p>
        </div>

        {/* 3-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedPathways.map((path) => (
            <div
              key={path.id}
              className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#e7e6e1] flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${path.badgeColor}`}>
                    {path.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#7b7974]">{path.faculty}</span>
                </div>

                <h3 className="font-heading text-base sm:text-lg text-[#121212] leading-snug mb-1.5 font-semibold">
                  {path.title}
                </h3>

                <p className="text-xs text-[#7b7974] leading-relaxed mb-3">
                  {path.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {path.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734] text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7e6e1] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7b7974]">
                  <span className="flex items-center gap-1 font-mono text-[#121212] font-semibold text-[11px]">
                    <span className="text-[#d97757]">★ {path.rating.toFixed(2)}</span> ({path.enrolled})
                  </span>
                  <span className="text-[11px] font-mono">{path.duration}</span>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] text-[#7b7974] font-mono">{path.credits}</span>
                  <Link
                    to={path.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#121212] hover:text-[#d97757] transition-colors"
                  >
                    <span>Explore Track</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
