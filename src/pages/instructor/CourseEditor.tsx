import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useCourseCurriculum, 
  useUpdateCourse, 
  useSubmitCourse 
} from '../../features/instructor/queries';
import { CurriculumBuilder } from '../../components/instructor/CurriculumBuilder';
import type { CourseDifficulty, PublishStatus } from '../../features/courses/types';
import {
  ArrowLeft,
  CheckCircle,
  Cloud,
  BookOpen,
  Layers,
  ShieldCheck,
  AlertCircle,
  Gavel,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: curriculum, isLoading, error } = useCourseCurriculum(courseId!);
  const updateCourse = useUpdateCourse(courseId!);
  const submitCourse = useSubmitCourse(courseId!);

  // Tab State: default to 'curriculum' as in the Lumina Studio template
  const [activeTab, setActiveTab] = useState<'curriculum' | 'info'>('curriculum');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Form State for Basic Information Tab
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'INTERMEDIATE' as CourseDifficulty,
    price: '',
    thumbnailUrl: '',
  });

  const [tags, setTags] = useState<string[]>(['MCTS', 'Tree Search', 'RL', 'Heuristics']);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (curriculum?.course) {
      setFormData({
        title: curriculum.course.title || '',
        description: curriculum.course.description || '',
        category: curriculum.course.category || '',
        difficulty: curriculum.course.difficulty || 'INTERMEDIATE',
        price: curriculum.course.price !== null && curriculum.course.price !== undefined ? curriculum.course.price.toString() : '',
        thumbnailUrl: curriculum.course.thumbnailUrl || '',
      });
    }
  }, [curriculum]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-rule/20 border-t-[#121212] rounded-full animate-spin" />
        <span className="font-sans text-lg text-foreground">Opening Course Studio...</span>
        <span className="font-mono text-xs text-muted">LUM-STUDIO-{courseId?.slice(0, 6).toUpperCase()}</span>
      </div>
    );
  }

  if (error || !curriculum) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-16 px-4">
        <div className="bg-card rounded-[10px] p-8 border border-[#ba1a1a]/30 shadow-xs max-w-xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xl text-foreground">Failed to load course studio</h2>
          <p className="font-body text-xs text-muted leading-relaxed">
            The course could not be found, or you lack authoring permission.
          </p>
          <div className="flex gap-2 pt-2">
            <Link
              to="/instructor/courses"
              className="px-4 py-2 rounded-lg bg-wash hover:bg-[#e7e6e1] text-xs font-medium text-foreground"
            >
              Back to My Courses
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-card hover:bg-black text-xs font-medium text-[#f8f8f6]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const course = curriculum.course;
  const sections = curriculum.sections || [];
  const isEditable = course.publishStatus === 'DRAFT' || course.publishStatus === 'PENDING_APPROVAL';

  // Aggregate metrics
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const quizOrAssignmentCount = sections.reduce((acc, s) => {
    return acc + s.lessons.filter(l => l.lessonType === 'QUIZ' || l.lessonType === 'ASSIGNMENT').length;
  }, 0);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    updateCourse.mutate(
      {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category.trim() || undefined,
        difficulty: formData.difficulty,
        price: formData.price ? parseFloat(formData.price) : 0,
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        },
      }
    );
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newTagInput.trim().replace(/^,+|,+$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setNewTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleConfirmApprovalSubmission = () => {
    submitCourse.mutate(undefined, {
      onSuccess: () => {
        setShowApprovalModal(false);
      }
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: PublishStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf4ea] text-[#245222] font-mono text-[10px] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4b7a47]" />
            PUBLISHED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-mono text-[10px] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            PENDING REVIEW
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-wash text-muted font-mono text-[10px] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7b7974]" />
            ARCHIVED
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faecd8] text-[#8c501e] font-mono text-[10px] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            DRAFT
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Studio Breadcrumb & Context Header Bar ── */}
      <section className="w-full bg-wash/90 border-b border-rule py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-3">
          {/* Breadcrumb Row */}
          <div className="flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/instructor" className="hover:text-foreground transition-colors">Instructor Studio</Link>
              <span>/</span>
              <Link to="/instructor/courses" className="hover:text-foreground transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-muted font-medium">{course.id.slice(0, 8)}</span>
              <span>/</span>
              <span className="text-foreground font-semibold">Course Studio</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-muted">
              <span>Course Ref:</span>
              <span className="bg-[#e7e6e1] text-foreground px-2 py-0.5 rounded text-[10px] tracking-wide font-semibold">
                LUM-COURSE-{course.id.slice(0, 6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Headline & Quick Status */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-sans text-2xl sm:text-3xl text-foreground tracking-tight font-normal">
                  {course.title}
                </h1>
                {renderStatusBadge(course.publishStatus)}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-muted flex-wrap">
                <span>Created {new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-muted">
                  <Cloud className="w-3.5 h-3.5 text-muted" />
                  <span>All changes saved</span>
                </span>
                <span>•</span>
                <span className="text-ember font-medium">{totalLessons} Lessons Total</span>
              </div>
            </div>

            {/* Studio Header Action Buttons */}
            <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
              <Link
                to="/instructor/courses"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-card hover:bg-wash text-foreground text-xs font-medium transition-colors border border-rule shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-muted" />
                <span>Back to Courses</span>
              </Link>

              <Link
                to={`/courses/${course.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-card hover:bg-wash text-foreground text-xs font-medium transition-colors border border-rule shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted" />
                <span>Public Preview</span>
              </Link>

              {course.publishStatus === 'DRAFT' && (
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-black text-[#f8f8f6] text-xs font-medium transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                  <span>Submit for Approval</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial Navigation Tabs Bar ── */}
      <section className="w-full bg-wash">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-3">
          <div className="flex items-center gap-1.5 bg-wash p-1 rounded-[10px] max-w-fit border border-rule/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-card/50'
              }`}
            >
              <Layers className="w-4 h-4 text-foreground" />
              <span>Curriculum Builder</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-wash text-muted font-mono text-[10px]">
                {totalLessons}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-card/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-muted" />
              <span>Basic Information</span>
              <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content Stage ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full py-6">
        {/* ============================================== */}
        {/* TAB 1: CURRICULUM BUILDER (PRIMARY VIEW)      */}
        {/* ============================================== */}
        {activeTab === 'curriculum' && (
          <CurriculumBuilder
            courseId={course.id}
            sections={sections}
            isEditable={isEditable}
            onOpenBasicInfo={() => setActiveTab('info')}
          />
        )}

        {/* ============================================== */}
        {/* TAB 2: BASIC INFORMATION CONTENT               */}
        {/* ============================================== */}
        {activeTab === 'info' && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Success Banner */}
            {saveSuccess && (
              <div className="p-4 rounded-[10px] bg-[#eaf4ea] text-[#245222] border border-[#4b7a47]/20 flex items-center justify-between shadow-2xs animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#4b7a47] shrink-0" />
                  <span className="font-body text-xs sm:text-sm font-medium">
                    Course changes saved successfully.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#4b7a47] uppercase font-bold tracking-wider">Saved</span>
              </div>
            )}

            {/* Error Banner */}
            {updateCourse.isError && (
              <div className="p-4 rounded-[10px] bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                  <span className="font-body text-xs sm:text-sm font-medium">
                    Failed to save course changes: {(updateCourse.error as any)?.message || 'Check network connection.'}
                  </span>
                </div>
              </div>
            )}

            {/* Main Form Paper Surface */}
            <form onSubmit={handleSaveInfo} className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-xs flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1 pb-4 border-b border-rule">
                <h2 className="font-sans text-xl sm:text-2xl text-foreground font-normal">
                  Course Details &amp; Settings
                </h2>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Update course title, description, category, difficulty level, and pricing.
                </p>
              </div>

              {/* Field 1: Course Title */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Course Title *
                  </label>
                  <span className="font-mono text-[10px] text-muted">
                    {isEditable ? 'Editable in DRAFT' : 'Locked (Published Course)'}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  disabled={!isEditable}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Course title..."
                  className="w-full px-4 py-2.5 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              {/* Field 2: Description & Markdown */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Course Description
                  </label>
                  <span className="font-mono text-[10px] text-muted">
                    Markdown &amp; LaTeX ($...$) supported
                  </span>
                </div>
                <textarea
                  rows={5}
                  disabled={!isEditable}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline course objectives, prerequisites, topics covered, and skills students will gain..."
                  className="w-full px-4 py-3 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none transition-colors leading-relaxed disabled:opacity-60 resize-y"
                />
                <div className="flex items-center justify-between font-mono text-[11px] text-muted pt-0.5">
                  <span>Supports KaTeX formulas and GitHub Flavored Markdown.</span>
                  <span>{formData.description.length} / 1,000 characters</span>
                </div>
              </div>

              {/* Field 3: Category & Subject Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <input
                    type="text"
                    disabled={!isEditable}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Computer Science, Artificial Intelligence"
                    className="w-full px-4 py-2.5 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Course Tags &amp; Keywords
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-[10px] bg-wash border border-rule min-h-[44px]">
                    {tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-card border border-rule text-foreground font-mono text-[11px] flex items-center gap-1 shadow-2xs">
                        {t}
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-muted hover:text-[#ba1a1a] cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditable && (
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={e => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="+ tag (press Enter)"
                        className="bg-transparent font-mono text-[11px] text-foreground outline-none px-1 w-28 placeholder:text-muted"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Field 4: Difficulty Level & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Difficulty Level *
                  </label>
                  <div className="relative">
                    <select
                      required
                      disabled={!isEditable}
                      value={formData.difficulty}
                      onChange={e => setFormData({ ...formData, difficulty: e.target.value as CourseDifficulty })}
                      className="w-full appearance-none px-4 py-2.5 pr-10 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Course Price (USD)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs sm:text-sm text-muted font-semibold pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={!isEditable}
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none transition-colors disabled:opacity-60"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted pt-0.5">
                    Leave blank or 0.00 for free course enrollment.
                  </span>
                </div>
              </div>

              {/* Field 5: Course Cover Image (16:9) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Course Cover Image (16:9)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-[10px] bg-wash border border-rule items-start sm:items-center">
                  <div className="relative w-44 h-24 rounded-lg overflow-hidden shrink-0 shadow-2xs bg-card border border-rule">
                    {formData.thumbnailUrl ? (
                      <img
                        src={formData.thumbnailUrl}
                        alt="Course cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted p-2 text-center">
                        <span className="font-sans text-lg italic text-[#e7e6e1]">Lumina</span>
                        <span className="font-mono text-[9px] text-muted">Course Thumbnail</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-card/90 text-[#f8f8f6] font-mono text-[9px] px-1 rounded">
                      16:9 Ratio
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <p className="font-body text-xs font-semibold text-foreground">
                      Recommended 16:9 Aspect Ratio
                    </p>
                    <p className="font-mono text-[11px] text-muted">
                      Provide an image URL (PNG, JPG, or WebP) for the course catalog thumbnail.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="url"
                        disabled={!isEditable}
                        value={formData.thumbnailUrl}
                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="https://example.com/cover-image.jpg"
                        className="px-3 py-1.5 rounded-lg bg-card text-foreground text-xs font-body border border-rule focus:outline-none focus:border-rule flex-1 disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-rule">
                <span className="font-mono text-[11px] text-muted self-start sm:self-auto">
                  Course ID: {course.id}
                </span>

                {isEditable && (
                  <button
                    type="submit"
                    disabled={updateCourse.isPending}
                    className="px-6 py-2.5 rounded-lg bg-card hover:bg-black text-[#f8f8f6] font-body text-xs font-medium transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {updateCourse.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ============================================== */}
      {/* MODAL: SUBMIT COURSE FOR APPROVAL              */}
      {/* ============================================== */}
      {showApprovalModal && (
        <div 
          className="fixed inset-0 z-50 bg-card/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowApprovalModal(false);
          }}
        >
          <div className="bg-card rounded-[10px] shadow-xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-5 relative border border-rule animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-wash flex items-center justify-center text-ember shrink-0">
                  <Gavel className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-sans text-lg sm:text-xl text-foreground font-normal">
                    Submit Course for Review
                  </h3>
                  <span className="font-mono text-[10px] text-muted">
                    Course ID: LUM-{course.id.slice(0, 6).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="text-muted hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body text-xs text-muted leading-relaxed">
              Submitting this course sends it to the moderation team. Once reviewed and approved, it will be published to the public catalog.
            </p>

            {/* Pre-flight Validation Checklist */}
            <div className="bg-wash/70 rounded-[10px] p-4 flex flex-col gap-2.5 border border-rule">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                Course Readiness Checklist
              </span>

              {/* Check 1 */}
              <div className="flex items-center gap-2 text-xs font-body text-foreground">
                <CheckCircle className="w-4 h-4 text-[#4b7a47] shrink-0" />
                <span>Course Title &amp; Description complete</span>
              </div>

              {/* Check 2 */}
              <div className="flex items-center gap-2 text-xs font-body text-foreground">
                {sections.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-[#4b7a47] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                )}
                <span>
                  {sections.length} {sections.length === 1 ? 'section' : 'sections'} in curriculum
                </span>
              </div>

              {/* Check 3 */}
              <div className="flex items-center gap-2 text-xs font-body text-foreground">
                {quizOrAssignmentCount > 0 ? (
                  <CheckCircle className="w-4 h-4 text-[#4b7a47] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-ember shrink-0" />
                )}
                <span>
                  {quizOrAssignmentCount > 0 
                    ? `${quizOrAssignmentCount} assessments (Quizzes / Assignments) included` 
                    : 'Notice: No quizzes or assignments added yet'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-rule">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-muted hover:bg-wash transition-colors cursor-pointer"
              >
                Cancel &amp; Continue Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmApprovalSubmission}
                disabled={submitCourse.isPending}
                className="px-5 py-2 rounded-lg bg-card hover:bg-black text-[#f8f8f6] font-body text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitCourse.isPending ? 'Submitting...' : 'Confirm & Submit for Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
