import { useState } from 'react';
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export function EnterpriseSection() {
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [financialAidOpen, setFinancialAidOpen] = useState(false);

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
                  onClick={() => setFinancialAidOpen(!financialAidOpen)}
                  className="px-5 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-[14px] font-medium transition-colors border border-[#e7e6e1] cursor-pointer"
                >
                  Apply for Financial Aid (Individuals)
                </button>
              </div>

              {consultationSubmitted && (
                <div className="mt-4 p-3 rounded-lg bg-[#efeeeb] border border-[#e7e6e1] text-xs text-[#373734] max-w-md">
                  Thank you! An enterprise academic advisor will contact your team within 24 hours.
                </div>
              )}

              {financialAidOpen && (
                <div className="mt-4 p-4 rounded-xl bg-[#efeeeb] border border-[#e7e6e1] text-xs text-[#373734] max-w-md space-y-2">
                  <div className="font-semibold text-[#121212]">Need-Based Financial Aid Application</div>
                  <p>All Lumina programs offer up to 90% tuition reduction. Submit a brief statement on course selection to receive rolling decision within 48 hours.</p>
                </div>
              )}
            </div>

            {/* Right Column: Standards & Financial Access */}
            <div className="lg:col-span-5 bg-[#efeeeb]/70 rounded-2xl p-6 sm:p-7 border border-[#e7e6e1]">
              <h4 className="font-heading text-[19px] text-[#121212] mb-3 font-semibold">
                Academic Standards &amp; Financial Access
              </h4>
              <p className="text-[13px] text-[#373734] mb-4 leading-relaxed">
                We believe top-tier engineering education should be globally accessible:
              </p>
              <ul className="text-[12.5px] text-[#373734] space-y-3">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">100% Free to Audit:</strong> Learn freely with complete access to lecture readings and monographs without fee.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Need-Based Financial Aid:</strong> Up to 90% tuition reduction for qualifying applicants worldwide.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#d97757] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">European Credit Transfer (ECTS):</strong> Fully verifiable university transcript and credits upon graduation.
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
