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
  Layers, 
  Share2, 
  Bookmark, 
  ArrowRight,
  Play,
  Check,
  CheckCircle
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

  if (isLoading) return <LoadingState message="Loading course syllabus & academic curriculum..." />;
  if (error || !backendCourse) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 bg-canvas text-foreground">
        <ErrorState 
          title="Course Not Found" 
          message="We couldn't locate this course in the catalog. It may not exist or has not been published yet." 
          onRetry={() => window.location.reload()} 
        />
        <div className="mt-8 text-center">
          <Link 
            to="/courses" 
            className="btn-superset-primary"
          >
            ← Back to Course Catalog
          </Link>
        </div>
      </div>
    );
  }

  const course = backendCourse;
  const isFree = course.price === 0 || course.price === null;

  const keySkills = [
    {
      icon: Cpu,
      step: '01',
      title: 'Foundational Theory & Core Concepts',
      description: 'Master core principles through detailed video lectures, structured lecture notes, and downloadable study materials.'
    },
    {
      icon: Terminal,
      step: '02',
      title: 'Interactive Hands-on Practice',
      description: 'Apply concepts in real-world scenarios with project-based assignments, code exercises, and practical problem sets.'
    },
    {
      icon: Layers,
      step: '03',
      title: 'Knowledge Checks & Quizzes',
      description: 'Test your retention with modular quizzes, instant feedback on answers, and detailed explanations for every checkpoint.'
    },
    {
      icon: Award,
      step: '04',
      title: 'Verified Certificate of Completion',
      description: 'Earn a verified digital credential upon passing all assessments to showcase on your LinkedIn profile and resume.'
    }
  ];

  const relatedPathways = [
    {
      id: 'path-1',
      title: 'Applied Machine Learning & Neural Networks',
      faculty: 'Edunet Faculty',
      badge: 'Specialization',
      description: 'Deep learning foundations, transformer models, feature engineering, and model deployment pipelines.',
      tags: ['Python', 'PyTorch', 'Data Science'],
      rating: 4.90,
      enrolled: '14,200',
      duration: '8 weeks · 6 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Artificial+Intelligence'
    },
    {
      id: 'path-2',
      title: 'Full-Stack Modern Web Engineering',
      faculty: 'Edunet Faculty',
      badge: 'Popular',
      description: 'Production-ready full-stack architectures, TypeScript, state management, RESTful APIs, and secure deployment.',
      tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      rating: 4.92,
      enrolled: '19,100',
      duration: '10 weeks · 8 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Software+Engineering'
    },
    {
      id: 'path-3',
      title: 'Data Structures, Algorithms & System Design',
      faculty: 'Edunet Faculty',
      badge: 'Foundations',
      description: 'Master computational complexity, tree traversal, dynamic programming, and scalable architecture fundamentals.',
      tags: ['Algorithms', 'Data Structures', 'System Design'],
      rating: 4.95,
      enrolled: '22,400',
      duration: '6 weeks · 5 hrs/wk',
      credits: '100% Online · Certificate',
      link: '/courses?category=Computer+Science'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-16 pb-24 text-foreground bg-canvas transition-colors duration-150">
      
      {/* ===================================================================== */}
      {/* 1. EDITORIAL COURSE HERO STAGE                                         */}
      {/* ===================================================================== */}
      <section className="w-full bg-card border-b border-rule pt-6 pb-12 sm:pb-16 shadow-none">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col gap-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Edunet</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <Link to="/courses" className="hover:text-foreground transition-colors">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-foreground font-medium truncate max-w-sm">{course.title}</span>
          </nav>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-wash text-ember text-xs font-mono uppercase tracking-wider border border-rule">
              <span>{course.category || 'Academic Program'}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-none bg-wash text-foreground text-xs font-mono uppercase tracking-wider border border-rule">
              {course.difficulty} Level
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-wash text-emerald-400 text-xs font-mono uppercase tracking-wider border border-rule">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Verified Certificate</span>
            </span>
          </div>

          {/* Course Title Headline: Inter 500 */}
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-[44px] text-foreground leading-[1.15] tracking-[-0.025em] font-medium max-w-3xl">
            {course.title}
          </h1>

          {/* Course Overview Support */}
          <p className="font-sans text-[16px] sm:text-[18px] text-muted leading-[1.5] max-w-3xl font-normal">
            {course.description}
          </p>

          {/* Academic Meta Details Row */}
          <div className="pt-6 border-t border-rule flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted font-sans">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-sans text-foreground font-medium tracking-tight">
                <Star className="w-4 h-4 fill-ember text-ember" />
                <span>{course.rating ? course.rating.toFixed(2) : '4.95'}</span>
              </span>
              <span className="font-mono text-muted">({course.studentCount ? course.studentCount.toLocaleString() : '14,280'} enrolled)</span>
            </div>

            <div className="flex items-center gap-2 text-muted font-mono text-xs">
              <Clock className="w-4 h-4 text-muted" />
              <span>8 Weeks · 6–8 hrs/week</span>
            </div>

            <div className="flex items-center gap-2 text-muted font-mono text-xs">
              <Globe className="w-4 h-4 text-muted" />
              <span>100% Online · Self-Paced Labs</span>
            </div>

            <div className="flex items-center gap-2 text-foreground font-medium">
              <Award className="w-4 h-4 text-ember" />
              <span>Accredited Certificate Included</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. MAIN 2-COLUMN STAGE: SYLLABUS (LEFT) + STICKY ENROLLMENT (RIGHT)    */}
      {/* ===================================================================== */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start w-full">
          
          {/* ── LEFT COLUMN: CURRICULUM, LEARNING PILLARS & REVIEWS (8 COLS) ── */}
          <div className="lg:col-span-8 flex flex-col gap-12 sm:gap-16 w-full">
            
            {/* ── PILLAR 1: What You Will Build & Master ── */}
            <div className="flex flex-col gap-6 pb-12 border-b border-rule">
              <div className="flex flex-col gap-1.5">
                <div className="superset-eyebrow">
                  <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                  <span>LEARNING OBJECTIVES // CORE COMPETENCIES</span>
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-medium tracking-[-0.025em] leading-[1.25]">
                  What you will build &amp; master
                </h2>
                <p className="font-sans text-sm sm:text-[15px] text-muted leading-relaxed max-w-2xl">
                  A structured four-pillar curriculum moving from theoretical depth into production-grade project execution and verifiable credentials.
                </p>
              </div>

              {/* 4 Cards Grid - 10px radius per Superset specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {keySkills.map((skill, idx) => {
                  const Icon = skill.icon;
                  return (
                    <div 
                      key={idx} 
                      className="group bg-card rounded-[10px] p-6 border border-rule hover:border-ember/50 shadow-none transition-colors duration-150 flex flex-col justify-between gap-5 relative"
                    >
                      {/* Top Header with Receptacle Icon & Step Index */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-10 h-10 rounded-none bg-wash border border-rule flex items-center justify-center text-ember group-hover:border-ember transition-colors duration-150">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-muted tracking-wider">
                          {skill.step}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans text-base sm:text-[17px] font-medium text-foreground group-hover:text-ember transition-colors leading-[1.3]">
                          {skill.title}
                        </h3>
                        <p className="font-sans text-[13.5px] text-muted leading-[1.55] font-normal">
                          {skill.description}
                        </p>
                      </div>

                      {/* Clean Minimal Hairline Indicator */}
                      <div className="h-0.5 w-full bg-rule group-hover:bg-ember transition-colors duration-150" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PILLAR 2: Curriculum & Modular Syllabus Breakdown ── */}
            <div id="syllabus" className="flex flex-col gap-6 scroll-mt-28 pb-12 border-b border-rule">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-rule">
                <div>
                  <div className="superset-eyebrow mb-1">
                    <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                    <span>SYLLABUS BREAKDOWN</span>
                  </div>
                  <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-medium tracking-[-0.025em] leading-[1.25]">
                    Curriculum &amp; Interactive Labs
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted bg-wash px-3 py-1 rounded-none border border-rule">
                    {course.sections?.length || 4} Modules · Fully Self-Paced
                  </span>
                </div>
              </div>

              {course.sections && course.sections.length > 0 ? (
                <div className="max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
                  <Curriculum sections={course.sections} />
                </div>
              ) : (
                <div className="p-8 rounded-[10px] bg-card border border-rule text-center text-sm text-muted font-sans font-normal shadow-none">
                  The curriculum syllabus is currently being finalized by the academic faculty.
                </div>
              )}
            </div>

            {/* ── PILLAR 3: Faculty & Lead Instructor Profile ── */}
            <div className="flex flex-col gap-6 pb-12 border-b border-rule">
              <div className="pb-4 border-b border-rule">
                <div className="superset-eyebrow mb-1">
                  <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                  <span>FACULTY &amp; MENTORSHIP</span>
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-medium tracking-[-0.025em] leading-[1.25]">
                  Meet your lead instructor
                </h2>
              </div>

              <div className="p-6 sm:p-7 rounded-[10px] bg-card border border-rule shadow-none flex flex-col sm:flex-row items-start gap-6">
                <img 
                  src="/images/elena.jpg"
                  alt={course.instructorName || 'Lead Professor'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-[10px] object-cover border border-rule shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-sans text-xl font-medium text-foreground leading-[1.3]">
                      {course.instructorName || 'Prof. Elena Rostova, PhD'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-none text-xs font-mono uppercase bg-wash text-ember border border-rule">
                      Verified Faculty
                    </span>
                  </div>
                  
                  <div className="text-xs font-mono text-muted">
                    Lead Instructor · Edunet Faculty
                  </div>
                  
                  <p className="font-sans text-sm text-muted leading-relaxed mt-1 font-normal">
                    {course.instructorBio || 'Senior educational instructor and curriculum architect with extensive industry experience teaching and mentoring thousands of engineers worldwide.'}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap font-mono text-xs">
                    {(course.instructorExpertise || ['Curriculum Design', 'Practical Projects', 'Student Mentorship']).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-none bg-wash text-muted border border-rule">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── PILLAR 4: Verified Student Reviews & Ratings ── */}
            <div className="flex flex-col gap-6 pb-12 border-b border-rule">
              <div className="pb-4 border-b border-rule">
                <div className="superset-eyebrow mb-1">
                  <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                  <span>PEER FEEDBACK</span>
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-medium tracking-[-0.025em] leading-[1.25]">
                  Student Reviews &amp; Ratings
                </h2>
                <p className="font-sans text-sm text-muted mt-1 leading-relaxed font-normal">
                  Authentic ratings submitted directly by enrolled students who completed this coursework.
                </p>
              </div>

              <ReviewList courseId={course.id} isEnrolled={!!isEnrolled} />
            </div>

            {/* ── PILLAR 5: Related Academic Pathways ── */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                  <div className="superset-eyebrow mb-1">
                    <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                    <span>CONTINUING SPECIALIZATIONS</span>
                  </div>
                  <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-medium tracking-[-0.025em] leading-[1.25]">
                    Related Academic Pathways
                  </h2>
                </div>
                <p className="font-sans text-xs sm:text-sm text-muted max-w-sm font-normal">
                  Recommended programs designed to complement this master track.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPathways.map((path) => (
                  <div
                    key={path.id}
                    className="bg-card rounded-[10px] p-5 border border-rule shadow-none hover:border-ember/50 flex flex-col justify-between transition-colors duration-150"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-none bg-wash text-ember border border-rule">
                          {path.badge}
                        </span>
                        <span className="text-xs font-mono text-muted">{path.faculty}</span>
                      </div>

                      <h3 className="font-sans text-base font-medium text-foreground leading-[1.35] mb-2">
                        {path.title}
                      </h3>

                      <p className="font-sans text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                        {path.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3 font-mono text-[10px]">
                        {path.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-none bg-wash text-muted border border-rule">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rule space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Star className="w-3.5 h-3.5 fill-ember text-ember" />
                          <span>{path.rating.toFixed(2)}</span>
                          <span className="text-muted font-mono font-normal">({path.enrolled})</span>
                        </span>
                        <span className="text-xs font-mono text-muted">{path.duration}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-mono text-muted">{path.credits}</span>
                        <Link
                          to={path.link}
                          className="inline-flex items-center gap-1 text-xs font-mono uppercase text-foreground hover:text-ember transition-colors"
                        >
                          <span>Explore Track</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: SLEEK STICKY ENROLLMENT DOCK (4 COLS) ── */}
          <aside className="lg:col-span-4 w-full sticky top-20 z-20">
            {/* Plan Card surface per Superset: 10px radius, 1px rule border */}
            <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
              
              {/* Thumbnail / Video Teaser Preview */}
              <div className="relative aspect-video rounded-[6px] bg-muted-surface border border-rule overflow-hidden group">
                <img 
                  src={course.thumbnailUrl || '/images/courses/web-dev.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/courses/web-dev.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity group-hover:bg-black/25">
                  <div className="w-10 h-10 rounded-none bg-foreground text-canvas flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-none bg-black/85 backdrop-blur-md text-[10px] font-mono text-white">
                  Preview // 3 min
                </div>
              </div>

              {/* Program Accreditation Pill */}
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-none bg-muted-surface flex items-center justify-center font-mono text-xs font-bold text-foreground border border-rule">
                    {(course.category || 'CS').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-ember uppercase tracking-wider leading-tight">
                      {course.category || 'Specialization'}
                    </div>
                    <div className="text-[13px] font-sans font-medium text-foreground leading-tight">
                      {course.difficulty ? `${course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()} Track` : 'Accredited Pathway'}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-none text-[10px] font-mono uppercase bg-wash text-foreground border border-rule">
                  Verified
                </span>
              </div>

              {/* Tuition & Pricing Block */}
              <div className="flex items-baseline justify-between pt-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-3xl font-medium text-foreground leading-none tracking-[-0.025em]">
                    {course.price !== null && course.price !== undefined ? (isFree ? 'Free' : `$${course.price.toFixed(2)}`) : 'Free'}
                  </span>
                  {isFree && (
                    <span className="text-xs text-muted line-through font-mono">
                      $1,450
                    </span>
                  )}
                  <span className="text-xs text-muted font-mono">
                    {isFree ? 'Free Audit' : 'Complete Track'}
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Aid Eligible</span>
                </span>
              </div>

              {/* Cohort Status Indicator */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-none bg-wash border border-rule text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-ember" />
                  <span className="text-foreground">Spring 2026 Cohort</span>
                </div>
                <span className="text-ember">Instant Access</span>
              </div>

              {/* Primary Enrollment Action (Superset Flat Button) */}
              <div className="flex flex-col gap-2.5 pt-1">
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn-superset-primary w-full"
                  >
                    <span>Sign In to Enroll (Free)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
                  <div className="p-3 bg-wash rounded-none text-center text-xs text-foreground border border-rule font-mono">
                    Faculty &amp; Admin accounts have catalog auditing rights.
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAction}
                      disabled={enrollMutation.isPending || checkoutMutation.isPending}
                      className="btn-superset-primary w-full"
                    >
                      <span>
                        {isEnrolled ? 'Go to Learning Workspace' :
                         enrollMutation.isPending || checkoutMutation.isPending ? 'Processing...' :
                         isFree ? 'Enroll in MasterTrack (Free)' : `Enroll Now — $${course.price?.toFixed(2)}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {enrollMutation.isError && (
                      <div className="text-red-500 text-xs text-center font-mono">
                        Failed to complete enrollment. Please try again.
                      </div>
                    )}
                    {checkoutMutation.isError && (
                      <div className="text-red-500 text-xs text-center font-mono">
                        Checkout initiation failed. Please try again.
                      </div>
                    )}
                  </>
                )}

                {/* Secondary Actions: Bookmark & Share */}
                <div className="flex items-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex-1 h-9 rounded-none border text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isBookmarked 
                        ? 'border-ember bg-wash text-ember' 
                        : 'border-rule bg-card hover:bg-wash text-foreground'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-ember' : ''}`} />
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="h-9 px-4 rounded-none border border-rule bg-card hover:bg-wash text-foreground text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Copy syllabus link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Key Inclusions */}
              <div className="pt-3 border-t border-rule flex flex-col gap-2">
                <div className="text-xs font-medium text-foreground">
                  Included with enrollment
                </div>
                <ul className="text-xs text-muted space-y-2 font-sans font-normal">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ember shrink-0" />
                    <span>Full access to video lectures &amp; lesson transcripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ember shrink-0" />
                    <span>Interactive concept retention quizzes &amp; exercises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ember shrink-0" />
                    <span>Verified digital Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ember shrink-0" />
                    <span>Cross-device progress syncing &amp; lifetime access</span>
                  </li>
                </ul>
              </div>

              {/* Quality Guarantee Seal */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-muted font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Checkout · Academic Guarantee</span>
              </div>

            </div>
          </aside>

        </div>
      </section>

    </div>
  );
}
