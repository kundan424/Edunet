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

  if (isLoading) return <LoadingState message="Loading instructor verification requests..." />;
  if (error || !instructors) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6 space-y-6 font-sans">
        <AdminNav />
        <ErrorState
          title="Instructor Requests Inaccessible"
          message="Unable to load pending instructor applications."
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

      {/* ── A. Instructor Verification Header & Metrics ── */}
      <section className="bg-white rounded-[10px] p-6 sm:p-7 border border-rule shadow-none relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule font-semibold tracking-wider uppercase">
                Instructor Verification
              </span>
              <span className="text-xs font-sans text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-ember" />
                Pending Applications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight">
              Instructor Verification &amp; Approvals
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
              Review instructor applications, evaluate expertise, and approve instructors to create and publish courses.
            </p>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto shrink-0 flex-wrap">
            <div className="p-4 rounded-[10px] bg-canvas border border-rule shadow-none flex flex-col min-w-[120px]">
              <span className="font-mono text-[10px] uppercase text-muted font-semibold">
                Pending Review
              </span>
              <span className="font-sans text-2xl font-bold text-ember mt-0.5">
                {instructors.length}
              </span>
              <span className="text-[10px] font-mono text-muted">Applications Pending</span>
            </div>

            <div className="p-4 rounded-[10px] bg-canvas border border-rule shadow-none flex flex-col min-w-[120px]">
              <span className="font-mono text-[10px] uppercase text-muted font-semibold">
                Status
              </span>
              <span className="font-sans text-2xl font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                Active
              </span>
              <span className="text-[10px] font-mono text-muted">Platform Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Search & Disciplinary Filters Bar ── */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter candidates by name, expertise, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-rule text-xs font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
          />
        </div>

        {/* Discipline Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedDiscipline('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all shrink-0 cursor-pointer ${
              selectedDiscipline === 'ALL'
                ? 'bg-ember text-white font-medium shadow-none'
                : 'bg-card text-muted hover:bg-canvas hover:text-foreground border border-rule'
            }`}
          >
            All Disciplines ({instructors.length})
          </button>
          {allDisciplines.slice(0, 4).map(disc => (
            <button
              key={disc}
              type="button"
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all shrink-0 cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-ember text-white font-medium shadow-none'
                  : 'bg-card text-muted hover:bg-canvas hover:text-foreground border border-rule'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </section>

      {/* ── C. Candidates Dossier List / Grid ── */}
      {filteredInstructors.length === 0 ? (
        <div className="bg-card rounded-[10px] p-12 text-center border border-rule flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-wash border border-rule flex items-center justify-center text-muted">
            <CheckCircle2 className="w-7 h-7 text-[#4b7a47]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-serif text-xl text-foreground">
              {searchQuery ? 'No Matching Instructors' : 'No Pending Applications'}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {searchQuery
                ? 'No prospective instructors matched your search criteria. Try modifying your search query.'
                : 'All instructor applications have been reviewed and verified.'}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-wash hover:bg-[#e7e6e1] text-foreground font-mono text-xs transition-colors cursor-pointer"
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
                className="bg-card rounded-[10px] border border-rule hover:border-ember/40 transition-all p-6 flex flex-col justify-between gap-5 shadow-none group"
              >
                {/* Candidate Monogram & Academic Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-wash border border-rule flex items-center justify-center font-sans font-bold text-sm text-ember tracking-wider shrink-0 shadow-none">
                        {initials}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-sans text-lg font-bold text-foreground truncate group-hover:text-ember transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="font-mono text-[11px] text-muted block truncate">
                          ID: #{candidate.userId.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                        isPending
                          ? 'bg-wash text-[#D97706] border-[#FDE68A]'
                          : candidate.verificationStatus === 'VERIFIED'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                      }`}
                    >
                      {candidate.verificationStatus}
                    </span>
                  </div>

                  {/* Disciplinary Specialization */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase text-muted font-semibold tracking-wider">
                      Academic Specialization
                    </span>
                    <p className="font-sans text-xs text-foreground font-semibold line-clamp-1">
                      {candidate.expertise || 'General Scholastic Discipline'}
                    </p>
                  </div>

                  {/* Biography Statement */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase text-muted font-semibold tracking-wider">
                      Biography Excerpt
                    </span>
                    <p className="font-sans text-xs text-muted leading-relaxed line-clamp-3">
                      "{candidate.bio || 'Candidate has not provided a biography yet.'}"
                    </p>
                  </div>
                </div>

                {/* Review Actions */}
                <div className="pt-4 border-t border-rule space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setInspectCandidate(candidate)}
                    className="w-full py-2 px-3 rounded-lg bg-card hover:bg-canvas text-foreground font-sans text-xs font-medium border border-rule transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
                  >
                    <Eye className="w-3.5 h-3.5 text-muted" />
                    <span>View Profile</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActionConfirm({ type: 'APPROVE', candidate })}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                      className="py-2 px-3 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium transition-colors shadow-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-white" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionConfirm({ type: 'REJECT', candidate })}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                      className="py-2 px-3 rounded-lg bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-sans text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-none"
                    >
                      <UserX className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── D. View Instructor Profile Modal ── */}
      {inspectCandidate && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] max-w-2xl w-full p-6 sm:p-8 border border-rule shadow-xl relative max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-rule">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-lg bg-wash border border-rule flex items-center justify-center font-sans font-bold text-base text-ember shadow-none">
                  {getInitials(inspectCandidate.name)}
                </div>
                <div>
                  <h2 className="font-sans text-xl font-bold text-foreground">{inspectCandidate.name}</h2>
                  <span className="font-mono text-xs text-muted">
                    Candidate ID: #{inspectCandidate.userId}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="w-8 h-8 rounded-lg bg-card border border-rule hover:bg-canvas flex items-center justify-center text-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Specialization & Bio Section */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold block mb-1">
                  Areas of Expertise
                </span>
                <p className="font-sans text-sm font-semibold text-foreground">
                  {inspectCandidate.expertise || 'Instructor'}
                </p>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold block mb-1.5">
                  Instructor Biography
                </span>
                <div className="p-4 rounded-[10px] bg-canvas border border-rule font-sans text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {inspectCandidate.bio || 'No formal biography submitted with application.'}
                </div>
              </div>

              {/* Instructor Verification Standards */}
              <div className="p-4 rounded-[10px] bg-wash border border-rule space-y-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ember font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-ember" />
                  Instructor Verification Standards
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Teaching Standards Met</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Background Verification Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Eligible for Course Authoring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2.5 rounded-lg text-xs font-sans text-muted hover:bg-canvas cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionConfirm({ type: 'REJECT', candidate: inspectCandidate });
                }}
                className="px-4 py-2.5 rounded-lg border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] font-sans text-xs font-medium cursor-pointer shadow-none"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionConfirm({ type: 'APPROVE', candidate: inspectCandidate });
                }}
                className="px-5 py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium shadow-none cursor-pointer"
              >
                Approve Instructor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── E. Confirmation Dialogue Modal (Approve or Reject) ── */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] max-w-md w-full p-6 border border-rule shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-wash text-ember'
                    : 'bg-[#FEF2F2] text-[#DC2626]'
                }`}
              >
                {actionConfirm.type === 'APPROVE' ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-foreground">
                  {actionConfirm.type === 'APPROVE'
                    ? 'Approve Instructor Application'
                    : 'Reject Instructor Application'}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {actionConfirm.type === 'APPROVE'
                    ? `Are you sure you wish to approve ${actionConfirm.candidate.name} as an instructor? They will be granted permissions to create, publish, and manage courses.`
                    : `Are you sure you wish to reject the instructor application for ${actionConfirm.candidate.name}?`}
                </p>
              </div>
            </div>

            {actionConfirm.type === 'REJECT' && (
              <div className="space-y-1.5">
                <label className="font-sans text-xs text-foreground font-semibold">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Incomplete profile details, insufficient information..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-card border border-rule text-xs font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rule">
              <button
                type="button"
                onClick={() => setActionConfirm(null)}
                className="px-4 py-2 rounded-lg text-xs font-sans text-muted hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={verifyMutation.isPending || rejectMutation.isPending}
                className={`px-5 py-2 rounded-lg font-sans text-xs font-medium text-white shadow-none cursor-pointer ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-ember hover:bg-ember/90'
                    : 'bg-[#DC2626] hover:bg-[#B91C1C]'
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
