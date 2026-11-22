import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function CapabilitySelector() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const workflows = [
    {
      title: 'Master skills with structured, self-paced video modules',
      category: 'STUDENT LEARNING WORKSPACE',
      description: 'Engage with step-by-step modular curriculums designed by industry practitioners. Learn at your own pace with high-definition videos, speed controls, downloadable notes, and lesson bookmarks.',
      bullets: [
        'Organized modules from foundational principles to advanced capstones',
        'Downloadable slide decks, code examples, and study guides',
        'Cross-device progress syncing across desktop, tablet, and mobile'
      ],
      linkText: 'Explore student workspace',
      linkUrl: '/courses',
      visual: {
        badge: 'STUDENT WORKSPACE ',
        title: 'Active Session: Module 04',
        items: [
          { label: 'Current Module', val: 'Enterprise REST & GraphQL Architecture' },
          { label: 'Playback Position', val: '14:20 of 22:45 (HD 1080p · 1.25x)' },
          { label: 'Completed Lessons', val: '16 of 20 Lessons Passed (80%)' },
          { label: 'Lesson Notes', val: '3 Personal Bookmarks Added' }
        ]
      }
    },
    {
      title: 'Cement understanding with instant quizzes and assignments',
      category: 'KNOWLEDGE EVALUATION',
      description: 'Validate your comprehension immediately after each lesson. Take interactive quizzes with automated instant feedback and submit project assignments reviewed against rigorous rubric standards.',
      bullets: [
        'Instant scoring and detailed explanation for every question',
        'Unlimited review attempts to ensure thorough topic mastery',
        'Real-world assignment briefs evaluated by instructors'
      ],
      linkText: 'Learn about course assessments',
      linkUrl: '/courses?search=Certificate',
      visual: {
        badge: 'ASSESSMENT SUITE ',
        title: 'Quiz Results Checkpoint',
        items: [
          { label: 'Quiz Evaluation', val: 'Module 3 Checkpoint: 100% Score' },
          { label: 'Total Questions', val: '10 Questions Evaluated' },
          { label: 'Review Feedback', val: 'All Concepts Correctly Answered' },
          { label: 'Certificate Milestone', val: 'Criteria Satisfied ✓' }
        ]
      }
    },
    {
      title: 'Empower educators with comprehensive course authoring tools',
      category: 'INSTRUCTOR STUDIO',
      description: 'Easily build, publish, and manage world-class courses. The instructor studio provides an intuitive curriculum editor, video management, interactive quiz creator, and student enrollment analytics.',
      bullets: [
        'Drag-and-drop section and lesson hierarchy organizer',
        'Built-in quiz builder with custom answer options and point values',
        'Student enrollment tracking, ratings, and course review moderation'
      ],
      linkText: 'Discover instructor studio',
      linkUrl: '/instructor/courses',
      visual: {
        badge: 'INSTRUCTOR PORTAL',
        title: 'Curriculum Builder & Analytics',
        items: [
          { label: 'Course Title', val: 'Full-Stack Web Development Bootcamp' },
          { label: 'Published Sections', val: '8 Sections · 42 Video Lessons' },
          { label: 'Enrolled Students', val: '2,480 Active Learners' },
          { label: 'Student Rating', val: '4.9 / 5.0 (340 Reviews)' }
        ]
      }
    }
  ];

  return (
    <section className="w-full bg-canvas py-24 lg:py-32 border-b border-rule transition-colors duration-150">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Section Heading */}
        <div className="max-w-[800px] mb-16">
          <div className="superset-eyebrow mb-3">
            <span className="w-1.5 h-1.5 rounded-none bg-ember" />
            <span>PLATFORM WORKFLOWS</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-foreground font-medium">
            Designed for learners and educators alike.
          </h2>
        </div>

        {/* Split Capability Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Product Window (Code Section with Transparent White & Black Gradient BG) */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Ambient Lighting Glow */}
            <div 
              className="absolute inset-0 -m-8 pointer-events-none rounded-full blur-2xl opacity-75 dark:opacity-30"
              style={{
                background: 'radial-gradient(55% 45% at 50% 40%, rgba(255, 255, 255, 0.95), rgba(220, 232, 255, 0.55) 50%, rgba(0, 0, 0, 0) 75%)'
              }}
            />

            {/* 14px Glass Card with Transparent White and Black Gradient Background */}
            <div 
              className="relative z-10 w-full rounded-[14px] overflow-hidden backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.005] bg-gradient-to-br from-white/95 via-[#f9fbff]/90 to-[#ecf2fc]/80 dark:bg-gradient-to-b dark:from-white/[0.12] dark:via-[#14151a]/95 dark:to-[#08090c] border border-white/90 dark:border-white/15 shadow-[0_22px_48px_-12px_rgba(25,35,60,0.08),_inset_0_1px_2px_rgba(255,255,255,0.95),_inset_0_-1px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] p-6 sm:p-8 flex flex-col justify-between min-h-[440px]"
            >
              <div>
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.06] dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-ember" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-white/60 font-medium">
                      {workflows[selectedIdx].visual.badge}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-900 dark:text-white/90 font-medium">
                    {workflows[selectedIdx].visual.title}
                  </span>
                </div>

                {/* Workflow Details Inner Container */}
                <div className="space-y-3 font-mono text-xs bg-gradient-to-b from-white/30 to-[#eef3fb]/40 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-black/50 p-5 sm:p-6 rounded-[10px] border border-black/[0.05] dark:border-white/10 backdrop-blur-sm">
                  {workflows[selectedIdx].visual.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-gradient-to-r dark:from-white/[0.08] dark:to-white/[0.02] border border-black/[0.05] dark:border-white/10 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-ember/40 transition-colors"
                    >
                      <span className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider font-semibold">
                        {item.label}
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium text-xs sm:text-[13px] font-sans">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-5 mt-5 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-white/50 font-mono">
                <span>EDUNET WORKFLOW ENGINE</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>
          </div>

          {/* Right: Accordion with Burnt Orange Active Edge */}
          <div className="lg:col-span-5 w-full flex flex-col divide-y divide-rule">
            {workflows.map((wf, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <div
                  key={idx}
                  className={`py-6 transition-all ${
                    isSelected ? 'border-t-2 border-t-ember' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className="w-full text-left cursor-pointer group focus:outline-none"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ember mb-1.5">
                      {wf.category}
                    </div>
                    <h3 className="font-sans text-xl leading-[1.3] text-foreground font-medium group-hover:text-ember transition-colors">
                      {wf.title}
                    </h3>
                  </button>

                  {/* Expanded Content */}
                  {isSelected && (
                    <div className="mt-4 space-y-4 animate-in fade-in duration-200">
                      <p className="font-sans text-[15px] leading-[1.625] text-muted">
                        {wf.description}
                      </p>

                      <ul className="space-y-2">
                        {wf.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-[14px] text-foreground font-sans">
                            <CheckCircle2 className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2">
                        <Link
                          to={wf.linkUrl}
                          className="inline-flex items-center gap-1.5 font-mono text-[13px] text-foreground hover:text-ember transition-colors group"
                        >
                          <span>{wf.linkText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
