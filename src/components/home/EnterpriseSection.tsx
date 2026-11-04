import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Award, ArrowRight } from 'lucide-react';

export function EnterpriseSection() {
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [curriculumGuideOpen, setCurriculumGuideOpen] = useState(false);

  return (
    <section className="py-16 lg:py-20 border-b border-[#e7e6e1] w-full" id="enterprise-section">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ffffff] rounded-[24px] p-8 sm:p-12 border border-[#e7e6e1] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#d97757] bg-[#efeeeb] px-3 py-1 rounded-full mb-4">
                <span>Lumina for Enterprise &amp; Higher Education</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#121212] leading-tight mb-3 font-semibold">
                Transform your engineering workforce with accredited academic curriculums
              </h2>
              <p className="text-xs sm:text-sm text-[#373734] leading-relaxed mb-6 max-w-[560px]">
                Equip your engineers with verified certifications from world-class computer science faculties. Seamless integration with Single Sign-On (SSO), LMS integrations (Canvas, Blackboard), and unified team licensing.
              </p>
              
              <div className="flex flex-wrap gap-3.5 items-center">
                <button
                  type="button"
                  onClick={() => setConsultationSubmitted(!consultationSubmitted)}
                  className="px-5 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] text-[14px] font-medium hover:bg-[#000000] transition-colors shadow-sm cursor-pointer"
                >
                  {consultationSubmitted ? 'Consultation Request Sent ✓' : 'Request Enterprise Consultation'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurriculumGuideOpen(!curriculumGuideOpen)}
                  className="px-5 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-[14px] font-medium transition-colors border border-[#e7e6e1] cursor-pointer"
                >
                  {curriculumGuideOpen ? 'Close Curriculum Guide' : 'Explore Curriculum Syllabus Guide'}
                </button>
              </div>

              {consultationSubmitted && (
                <div className="mt-4 p-3 rounded-lg bg-[#efeeeb] border border-[#e7e6e1] text-xs text-[#373734] max-w-md">
                  Thank you! An enterprise academic advisor will contact your team within 24 hours.
                </div>
              )}

              {curriculumGuideOpen && (
                <div className="mt-4 p-5 rounded-xl bg-[#efeeeb] border border-[#e7e6e1] text-xs text-[#373734] max-w-lg space-y-2.5">
                  <div className="font-semibold text-sm text-[#121212] flex items-center justify-between">
                    <span>Curriculum Syllabi &amp; Prerequisite Roadmaps</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffffff] border border-[#e7e6e1] text-[#d97757]">
                      Academic Edition
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    Access in-depth course outlines, module prerequisites, required readings, and laboratory milestones across all Computer Science and AI tracks.
                  </p>
                  <div className="pt-1.5 flex items-center gap-3">
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1.5 font-medium text-xs text-[#121212] hover:text-[#d97757] transition-colors font-mono"
                    >
                      <span>Browse Full Course Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Standards & Learning Access */}
            <div className="lg:col-span-5 bg-[#efeeeb]/70 rounded-2xl p-6 sm:p-7 border border-[#e7e6e1]">
              <h4 className="font-heading text-[19px] text-[#121212] mb-3 font-semibold">
                Academic Standards &amp; Learning Access
              </h4>
              <p className="text-[13px] text-[#373734] mb-4 leading-relaxed">
                We believe top-tier computer science education should be open, rigorous, and verifiable:
              </p>
              <ul className="text-[12.5px] text-[#373734] space-y-3">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">100% Free Course Audit:</strong> Learn freely with complete access to lecture readings, course materials, and syllabi without fee.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Self-Paced Flexible Access:</strong> Study on your schedule with lifetime access to enrolled content, structured quizzes, and updates.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">European Credit Transfer (ECTS):</strong> Fully verifiable university transcript and credits upon course completion.
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
