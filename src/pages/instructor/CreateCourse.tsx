import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateCourse } from '../../features/instructor/queries';
import type { CourseDifficulty } from '../../features/courses/types';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  Tag,
  ChevronDown,
  Layers,
  BookOpen,
  Terminal,
  Award
} from 'lucide-react';

const QUICK_DISCIPLINES = [
  'AI Systems',
  'Distributed Systems',
  'Formal Verification',
  'Cloud & DevOps',
  'Kernel Engineering',
];

export function CreateCourse() {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Distributed Systems',
    difficulty: 'ADVANCED' as CourseDifficulty,
    price: '',
  });

  const [error, setError] = useState('');
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (formData.title.trim().length < 3) {
      setError('Course title must be at least 3 characters in length to register with the Faculty Guild.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    createCourse.mutate(
      {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category.trim() || undefined,
        difficulty: formData.difficulty,
        price: formData.price ? parseFloat(formData.price) : 0,
      },
      {
        onSuccess: (data) => {
          navigate(`/instructor/courses/${data.id}`);
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to initialize curriculum monograph. Please check your network and try again.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-16">
      {/* ── Breadcrumb & Stepper Header ── */}
      <div className="max-w-3xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[#7b7974]">
            <Link to="/instructor" className="hover:text-[#121212] transition-colors">Instructor Guild</Link>
            <span className="text-[#b7b7b5]">/</span>
            <Link to="/instructor/courses" className="hover:text-[#121212] transition-colors">Curriculum Registry</Link>
            <span className="text-[#b7b7b5]">/</span>
            <span className="text-[#121212] font-semibold">Initialize Course</span>
          </nav>
          <Link
            to="/instructor/courses"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#373734] hover:text-[#121212] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Courses</span>
          </Link>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-[#efeeeb]/70 p-3.5 rounded-xl border border-[#e7e6e1] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#121212] text-[#f8f8f6] flex items-center justify-center text-xs font-mono font-bold shrink-0">
              1
            </span>
            <div className="flex flex-col">
              <span className="font-body text-xs sm:text-sm font-semibold text-[#121212] leading-none">
                Curriculum Monograph &amp; Metadata
              </span>
              <span className="text-[11px] font-mono text-[#7b7974] leading-tight mt-0.5">
                Foundational monograph record &amp; tuition schema
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#9c9a92]">
            <span className="text-[#d97757] font-semibold">Step 1 of 3</span>
            <span>•</span>
            <span>Studio Layout Next</span>
          </div>
        </div>
      </div>

      {/* ── Main Editorial Creation Card ── */}
      <div className="max-w-3xl mx-auto w-full bg-[#ffffff] rounded-2xl p-6 sm:p-9 border border-[#e7e6e1] shadow-xs">
        {/* Header Area */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#e7e6e1]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#efeeeb] text-[10px] font-mono text-[#373734] tracking-wide uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
              Onboarding Step 1 of 3 • Curriculum Registry
            </span>
            <span className="text-[11px] font-mono text-[#9c9a92] hidden sm:inline">LUM-SPEC-2026</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#121212] tracking-tight font-normal pt-1">
            Initialize Curriculum Record
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] leading-relaxed max-w-2xl">
            Set up the fundamental monograph identity and syllabus metadata before opening the interactive curriculum studio.
          </p>
        </div>

        {/* ── Live Alerts & Rules Area ── */}
        <div className="flex flex-col gap-3 my-6">
          {/* Advisory Rule Banner */}
          {showInfoBanner && (
            <div className="p-3.5 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] flex items-start justify-between gap-3 transition-all duration-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#121212] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#121212]">Academic Protocol Standards</span>
                  <span className="text-[11px] font-body text-[#7b7974] leading-relaxed">
                    Course title must be between 3 and 150 characters. Pricing may be zero or left blank for open consortium distribution under the Lumina Open-Archive Commons.
                  </span>
                </div>
              </div>
              <button 
                type="button"
                aria-label="Dismiss banner"
                onClick={() => setShowInfoBanner(false)}
                className="text-[#9c9a92] hover:text-[#121212] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Error Notification Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ba1a1a] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#ba1a1a]">Form Incomplete</span>
                  <span className="text-[11px] leading-relaxed">{error}</span>
                </div>
              </div>
              <button 
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError('')}
                className="text-[#ba1a1a] hover:opacity-80 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Editorial Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Field 1: Course Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-[#121212] flex items-center gap-1" htmlFor="courseTitle">
                <span>Course Title</span>
                <span className="text-[#d97757] font-bold">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#7b7974] px-2 py-0.5 bg-[#efeeeb] rounded">
                Required (3–150 characters)
              </span>
            </div>
            <div className="relative">
              <input 
                id="courseTitle"
                type="text"
                required
                maxLength={150}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Autonomous Reasoning & Multi-Agent Swarms: Verifiable MicroVM Kernels"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm placeholder:text-[#9c9a92] border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-between pt-0.5 text-[11px]">
              <p className="text-[#7b7974]">
                A concise, descriptive title for the monograph catalog and peer-reviewed syllabus.
              </p>
              <span className="font-mono text-[#373734] font-medium whitespace-nowrap pl-2">
                {formData.title.length} / 150 characters
              </span>
            </div>
          </div>

          {/* Field 2: Curriculum Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-[#121212] flex items-center gap-1" htmlFor="courseDescription">
                <span>Curriculum Description</span>
              </label>
              <span className="text-[10px] font-mono text-[#7b7974] px-2 py-0.5 bg-[#efeeeb] rounded">
                Recommended • Markdown Supported
              </span>
            </div>
            <textarea 
              id="courseDescription"
              rows={4}
              maxLength={500}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="What will students learn in this curriculum? Outline core invariant proofs, architectural deliverables, and lab milestones..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm placeholder:text-[#9c9a92] border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none transition-colors resize-y leading-relaxed"
            />
            <div className="flex items-center justify-between pt-0.5 text-[11px]">
              <p className="text-[#7b7974]">
                Provide a high-level syllabus overview (up to 500 characters). You can enrich this with TeX formulas in the full editor later.
              </p>
              <span className="font-mono text-[#373734] font-medium whitespace-nowrap pl-2">
                {formData.description.length} / 500 characters
              </span>
            </div>
          </div>

          {/* Field 3: Category & Academic Discipline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-[#121212]" htmlFor="disciplineInput">
              Category &amp; Academic Discipline
            </label>
            <div className="relative flex items-center">
              <input 
                id="disciplineInput"
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Programming, AI Systems, Cloud & DevOps"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm placeholder:text-[#9c9a92] border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none transition-colors"
              />
              <Tag className="w-4 h-4 text-[#9c9a92] absolute right-3 pointer-events-none" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-[#7b7974] mr-1">Quick Select:</span>
              {QUICK_DISCIPLINES.map((discipline) => {
                const isSelected = formData.category.toLowerCase() === discipline.toLowerCase();
                return (
                  <button
                    key={discipline}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: discipline })}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-[#121212] text-[#f8f8f6]'
                        : 'bg-[#efeeeb] text-[#373734] hover:bg-[#e7e6e1]'
                    }`}
                  >
                    {discipline}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 4: Two-Column Row (Difficulty & Price) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column A: Difficulty Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-[#121212] flex items-center gap-1" htmlFor="difficultyLevel">
                <span>Difficulty Level</span>
                <span className="text-[#d97757] font-bold">*</span>
              </label>
              <div className="relative">
                <select 
                  id="difficultyLevel"
                  required
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value as CourseDifficulty })}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="BEGINNER">Beginner — Introductory Foundations</option>
                  <option value="INTERMEDIATE">Intermediate — Applied Systems &amp; Labs</option>
                  <option value="ADVANCED">Advanced — Distributed Invariants &amp; Kernels</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#9c9a92] absolute right-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-[#7b7974] pt-0.5">
                Calibrates automated prerequisite checking across student folios.
              </p>
            </div>

            {/* Column B: Tuition / Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-[#121212]" htmlFor="tuitionPrice">
                Tuition / Monograph Price (USD)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs sm:text-sm text-[#373734] font-semibold pointer-events-none">$</span>
                <input 
                  id="tuitionPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00 (Leave blank for Free)"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm placeholder:text-[#9c9a92] border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#7b7974] pt-0.5">
                Leave blank or 0 for open access. Faculty receives 95% net monograph royalties.
              </p>
            </div>
          </div>

          {/* ── Interactive Scaffold Auto-Configuration Box ── */}
          <div className="p-4 rounded-xl bg-[#efeeeb]/60 border border-[#e7e6e1] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-[#121212] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#d97757]" />
                <span>Curriculum Scaffold Auto-Configuration</span>
              </span>
              <span className="text-[10px] font-mono text-[#7b7974] uppercase bg-[#ffffff] px-2 py-0.5 rounded border border-[#e7e6e1]">
                Auto-provisioned
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center gap-2.5 shadow-xs">
                <BookOpen className="w-4 h-4 text-[#373734] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#121212] leading-tight">Monograph Leaf</span>
                  <span className="text-[10px] font-mono text-[#9c9a92]">TeTeX &amp; Markdown</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center gap-2.5 shadow-xs">
                <Terminal className="w-4 h-4 text-[#373734] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#121212] leading-tight">Kernel Sandboxes</span>
                  <span className="text-[10px] font-mono text-[#9c9a92]">Wasm &amp; MicroVMs</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center gap-2.5 shadow-xs">
                <Award className="w-4 h-4 text-[#373734] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#121212] leading-tight">Peer Invariants</span>
                  <span className="text-[10px] font-mono text-[#9c9a92]">Consortium Rubric</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Footer Area ── */}
          <div className="pt-5 border-t border-[#e7e6e1] flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link 
                to="/instructor/courses"
                className="text-xs text-[#7b7974] hover:text-[#121212] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel &amp; Return to Courses</span>
              </Link>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button 
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={createCourse.isPending}
                  className="px-4 py-2.5 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] font-body text-xs font-medium transition-colors border border-[#e7e6e1] cursor-pointer disabled:opacity-50"
                >
                  Save as Inactive Draft
                </button>
                <button 
                  type="submit"
                  disabled={createCourse.isPending}
                  className="px-5 py-2.5 rounded-lg bg-[#121212] text-[#f8f8f6] font-body text-xs font-medium hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {createCourse.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#f8f8f6]/30 border-t-[#f8f8f6] rounded-full animate-spin" />
                      <span>Initializing Monograph...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Course &amp; Open Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-[#7b7974] pt-1">
              <span>
                Upon creation, you will immediately route to the curriculum studio (<code className="bg-[#efeeeb] px-1 py-0.5 rounded text-[#121212]">/instructor/courses/:newCourseId</code>).
              </span>
              <span className="whitespace-nowrap text-[#9c9a92]">POST /api/v1/instructors/courses</span>
            </div>
          </div>
        </form>
      </div>

      {/* Auxiliary Consortium Footnote */}
      <div className="max-w-3xl mx-auto w-full mt-6 text-center">
        <span className="text-[11px] font-mono text-[#9c9a92]">
          Faculty Fellow ID: <strong className="text-[#373734] font-normal">OX-8842-EV</strong> • Lumina Academic Consortium Syllabus Charter §14.b
        </span>
      </div>
    </div>
  );
}
