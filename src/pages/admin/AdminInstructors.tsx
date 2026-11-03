import { useState, useMemo } from 'react';
import { AdminNav } from '../../layouts/components/AdminNav';
import { usePendingInstructors, useVerifyInstructor, useRejectInstructor } from '../../features/admin/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { InstructorProfileResponse } from '../../features/admin/types';
import {
  UserCheck,
  UserX,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

export function AdminInstructors() {
  const { data: instructors, isLoading, error, refetch } = usePendingInstructors();
  const verifyMutation = useVerifyInstructor();
  const rejectMutation = useRejectInstructor();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [inspectCandidate, setInspectCandidate] = useState<InstructorProfileResponse | null>(null);

  // Confirmation Modals State
  const [actionConfirm, setActionConfirm] = useState<{
    type: 'APPROVE' | 'REJECT';
    candidate: InstructorProfileResponse;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Extract unique disciplines for filtering
  const allDisciplines = useMemo(() => {
    if (!instructors) return [];
    const set = new Set<string>();
    instructors.forEach(inst => {
      if (inst.expertise) {
        inst.expertise.split(',').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set);
  }, [instructors]);

  // Filtered instructors
  const filteredInstructors = useMemo(() => {
    if (!instructors) return [];
    return instructors.filter(inst => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inst.expertise && inst.expertise.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inst.bio && inst.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDiscipline =
        selectedDiscipline === 'ALL' ||
        (inst.expertise && inst.expertise.toLowerCase().includes(selectedDiscipline.toLowerCase()));

      return matchesSearch && matchesDiscipline;
    });
  }, [instructors, searchQuery, selectedDiscipline]);

  if (isLoading) return <LoadingState message="Accessing Consortium Academic Senate Docket..." />;
  if (error || !instructors) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6 space-y-6 font-sans">
        <AdminNav />
        <ErrorState
          title="Senate Docket Inaccessible"
          message="Unable to load pending faculty dossiers from the credentials registry."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Handlers
  const handleConfirmAction = () => {
    if (!actionConfirm) return;
    const { type, candidate } = actionConfirm;

    if (type === 'APPROVE') {
      verifyMutation.mutate(candidate.userId, {
        onSuccess: () => {
          setActionConfirm(null);
          setInspectCandidate(null);
        }
      });
    } else {
      rejectMutation.mutate(candidate.userId, {
        onSuccess: () => {
          setActionConfirm(null);
          setInspectCandidate(null);
          setRejectReason('');
        }
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 space-y-8 font-sans">
      <AdminNav />

      {/* ── A. Senate Governance Header & Metrics ── */}
      <section className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#121212] text-[#ffffff] font-semibold tracking-wider uppercase">
                Academic Senate
              </span>
              <span className="text-xs font-mono text-[#7b7974] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d97757]" />
                Docket Active • 2026 Term
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
              Faculty Credentials &amp; Verification Senate
            </h1>
            <p className="text-xs sm:text-sm text-[#7b7974] leading-relaxed">
              Review candidate dossiers, evaluate disciplinary expertise, and grant formal Consortium tenure to prospective instructors.
            </p>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto shrink-0 flex-wrap">
            <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col min-w-[120px]">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">
                Pending Review
              </span>
              <span className="font-serif text-2xl font-normal text-[#d97757] mt-0.5">
                {instructors.length}
              </span>
              <span className="text-[10px] font-mono text-[#9c9a92]">Dossiers Staged</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col min-w-[120px]">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">
                Senate Quorum
              </span>
              <span className="font-serif text-2xl font-normal text-[#121212] mt-0.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4b7a47]"></span>
                In Session
              </span>
              <span className="text-[10px] font-mono text-[#9c9a92]">Consortium Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Search & Disciplinary Filters Bar ── */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9a92]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter candidates by name, expertise, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] text-xs font-mono text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:border-[#121212] transition-colors"
          />
        </div>

        {/* Discipline Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedDiscipline('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              selectedDiscipline === 'ALL'
                ? 'bg-[#121212] text-[#ffffff] font-semibold'
                : 'bg-[#f8f8f6] text-[#7b7974] hover:bg-[#efeeeb] hover:text-[#121212] border border-[#e7e6e1]'
            }`}
          >
            All Disciplines ({instructors.length})
          </button>
          {allDisciplines.slice(0, 4).map(disc => (
            <button
              key={disc}
              type="button"
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-[#121212] text-[#ffffff] font-semibold'
                  : 'bg-[#f8f8f6] text-[#7b7974] hover:bg-[#efeeeb] hover:text-[#121212] border border-[#e7e6e1]'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </section>

      {/* ── C. Candidates Dossier List / Grid ── */}
      {filteredInstructors.length === 0 ? (
        <div className="bg-[#ffffff] rounded-2xl p-12 text-center border border-[#e7e6e1] flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#f8f8f6] border border-[#e7e6e1] flex items-center justify-center text-[#7b7974]">
            <CheckCircle2 className="w-7 h-7 text-[#4b7a47]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-serif text-xl text-[#121212]">
              {searchQuery ? 'No Matching Candidates' : 'Senate Docket Clear'}
            </h3>
            <p className="text-xs text-[#7b7974] leading-relaxed">
              {searchQuery
                ? 'No prospective instructors matched your search criteria. Try modifying your search query.'
                : 'All faculty accreditation requests have been reviewed and verified by the Academic Senate.'}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] font-mono text-xs transition-colors cursor-pointer"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map(candidate => {
            const initials = getInitials(candidate.name);
            const isPending = candidate.verificationStatus === 'PENDING';

            return (
              <div
                key={candidate.id}
                className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] hover:border-[#b7b7b5] transition-all p-6 flex flex-col justify-between gap-5 shadow-xs group"
              >
                {/* Candidate Monogram & Academic Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-center justify-center font-mono font-bold text-sm text-[#121212] tracking-wider shrink-0 shadow-2xs">
                        {initials}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-serif text-lg font-medium text-[#121212] truncate group-hover:text-[#d97757] transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="font-mono text-[11px] text-[#7b7974] block truncate">
                          ID: #{candidate.userId.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                        isPending
                          ? 'bg-[#fff5f0] text-[#d97757] border-[#d97757]/30'
                          : candidate.verificationStatus === 'VERIFIED'
                          ? 'bg-[#eaf4ea] text-[#245222] border-[#4b7a47]/30'
                          : 'bg-[#ffdad6]/40 text-[#ba1a1a] border-[#ba1a1a]/30'
                      }`}
                    >
                      {candidate.verificationStatus}
                    </span>
                  </div>

                  {/* Disciplinary Specialization */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold tracking-wider">
                      Academic Specialization
                    </span>
                    <p className="font-body text-xs text-[#121212] font-medium line-clamp-1">
                      {candidate.expertise || 'General Scholastic Discipline'}
                    </p>
                  </div>

                  {/* Biography Statement */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold tracking-wider">
                      Scholastic Dossier Excerpt
                    </span>
                    <p className="font-serif text-xs text-[#373734] leading-relaxed line-clamp-3 italic">
                      "{candidate.bio || 'Candidate has submitted credentials awaiting full monograph statement.'}"
                    </p>
                  </div>
                </div>

                {/* Senate Review Actions */}
                <div className="pt-4 border-t border-[#e7e6e1] space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setInspectCandidate(candidate)}
                    className="w-full py-2 px-3 rounded-xl bg-[#f8f8f6] hover:bg-[#efeeeb] text-[#121212] font-mono text-xs font-medium border border-[#e7e6e1] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#7b7974]" />
                    <span>Inspect Full Dossier</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActionConfirm({ type: 'APPROVE', candidate })}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                      className="py-2 px-3 rounded-xl bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#4b7a47]" />
                      <span>Admit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionConfirm({ type: 'REJECT', candidate })}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                      className="py-2 px-3 rounded-xl bg-[#ffffff] hover:bg-[#ffdad6]/20 text-[#ba1a1a] border border-[#e7e6e1] hover:border-[#ba1a1a]/40 font-mono text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserX className="w-3.5 h-3.5 text-[#ba1a1a]" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── D. Inspect Candidate Dossier Modal ── */}
      {inspectCandidate && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#e7e6e1] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-[#e7e6e1]">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-center justify-center font-mono font-bold text-base text-[#121212] shadow-2xs">
                  {getInitials(inspectCandidate.name)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#121212]">{inspectCandidate.name}</h2>
                  <span className="font-mono text-xs text-[#7b7974]">
                    Candidate ID: #{inspectCandidate.userId}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="w-8 h-8 rounded-lg bg-[#f8f8f6] hover:bg-[#efeeeb] flex items-center justify-center text-[#7b7974] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Specialization & Bio Section */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold block mb-1">
                  Primary Academic Disciplines
                </span>
                <p className="font-body text-sm font-semibold text-[#121212]">
                  {inspectCandidate.expertise || 'Scholastic Curriculum Fellow'}
                </p>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold block mb-1.5">
                  Curriculum Statement &amp; Biography
                </span>
                <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] font-serif text-sm text-[#373734] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {inspectCandidate.bio || 'No formal biography submitted with application.'}
                </div>
              </div>

              {/* Senate Verification Rubric */}
              <div className="p-4 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] space-y-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#121212] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d97757]" />
                  Consortium Accreditation Standard Compliance
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#373734]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                    <span>Academic Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                    <span>Pedagogical Standards Clear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                    <span>Conflict of Interest Audit Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                    <span>Eligible for Curriculum Authoring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e6e1]">
              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-mono text-[#7b7974] hover:bg-[#efeeeb] cursor-pointer"
              >
                Close Dossier
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionConfirm({ type: 'REJECT', candidate: inspectCandidate });
                }}
                className="px-4 py-2.5 rounded-xl border border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/20 font-mono text-xs font-medium cursor-pointer"
              >
                Decline Candidacy
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionConfirm({ type: 'APPROVE', candidate: inspectCandidate });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium shadow-xs cursor-pointer"
              >
                Admit to Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── E. Confirmation Dialogue Modal (Approve or Reject) ── */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 border border-[#e7e6e1] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-[#eaf4ea] text-[#4b7a47]'
                    : 'bg-[#ffdad6]/50 text-[#ba1a1a]'
                }`}
              >
                {actionConfirm.type === 'APPROVE' ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-[#121212]">
                  {actionConfirm.type === 'APPROVE'
                    ? 'Confirm Faculty Admission'
                    : 'Decline Candidate Dossier'}
                </h3>
                <p className="text-xs text-[#7b7974] leading-relaxed">
                  {actionConfirm.type === 'APPROVE'
                    ? `Are you sure you wish to admit ${actionConfirm.candidate.name} into the Consortium Faculty? They will be granted full authoring, testing, and grading authority.`
                    : `Are you sure you wish to decline the faculty candidacy for ${actionConfirm.candidate.name}?`}
                </p>
              </div>
            </div>

            {actionConfirm.type === 'REJECT' && (
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-[#121212] font-semibold">
                  Reason for Senate Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Incomplete curriculum statement, unverified institutional affiliation..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] text-xs font-mono text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:border-[#ba1a1a]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e7e6e1]">
              <button
                type="button"
                onClick={() => setActionConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#7b7974] hover:bg-[#efeeeb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={verifyMutation.isPending || rejectMutation.isPending}
                className={`px-5 py-2 rounded-xl font-mono text-xs font-medium text-[#ffffff] shadow-xs cursor-pointer ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-[#121212] hover:bg-black'
                    : 'bg-[#ba1a1a] hover:bg-[#93000a]'
                }`}
              >
                {actionConfirm.type === 'APPROVE'
                  ? verifyMutation.isPending
                    ? 'Admitting...'
                    : 'Confirm Admission'
                  : rejectMutation.isPending
                  ? 'Declining...'
                  : 'Decline Candidacy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
