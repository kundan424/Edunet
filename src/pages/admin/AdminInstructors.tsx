import { useState } from 'react';
import { SectionHeading } from '../../components/ui/Typography';
import { AdminNav } from '../../layouts/components/AdminNav';
import { usePendingInstructors, useVerifyInstructor, useRejectInstructor } from '../../features/admin/queries';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { PillButton } from '../../components/ui/Button';

export function AdminInstructors() {
  const { data: instructors, isLoading, error } = usePendingInstructors();
  const verifyMutation = useVerifyInstructor();
  const rejectMutation = useRejectInstructor();
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  if (isLoading) return <LoadingState message="Loading pending verifications..." />;
  if (error || !instructors) return <ErrorState message="Failed to load instructor profiles." />;

  const handleVerify = (id: string) => {
    if (window.confirm('Approve this instructor profile?')) {
      verifyMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm('Reject this instructor profile?')) {
      rejectMutation.mutate(id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionHeading>Instructor Verifications</SectionHeading>
      <AdminNav />

      {instructors.length === 0 ? (
        <EmptyState 
          title="All Caught Up" 
          message="No instructor verifications waiting for review." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(instructor => (
            <div key={instructor.id} className="border border-midnight-ink p-6 bg-white flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl">{instructor.name}</h3>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-saffron-yellow text-midnight-ink border border-midnight-ink rounded-full">
                  {instructor.verificationStatus}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Expertise</span>
                <p className="font-usual text-sm font-semibold text-midnight-ink">
                  {instructor.expertise || 'Not specified'}
                </p>
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Biography</span>
                <p className="font-usual text-sm text-midnight-ink/80 line-clamp-4">
                  {instructor.bio || 'No biography provided.'}
                </p>
              </div>

              {selectedInstructorId === instructor.id ? (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-midnight-ink">
                  <div className="max-h-[150px] overflow-y-auto mb-4 p-2 bg-cream-paper border border-midnight-ink/20 text-sm">
                    {instructor.bio}
                  </div>
                  <div className="flex gap-2">
                    <PillButton 
                      className="flex-1 justify-center bg-midnight-ink text-white"
                      onClick={() => handleVerify(instructor.userId)}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                    >
                      Approve
                    </PillButton>
                    <button 
                      className="flex-1 font-bold text-sm border-2 border-ember-red text-ember-red hover:bg-ember-red hover:text-white transition-colors"
                      onClick={() => handleReject(instructor.userId)}
                      disabled={verifyMutation.isPending || rejectMutation.isPending}
                    >
                      Reject
                    </button>
                  </div>
                  <button 
                    className="mt-2 text-xs font-bold text-gray-500 hover:underline"
                    onClick={() => setSelectedInstructorId(null)}
                  >
                    Close Details
                  </button>
                </div>
              ) : (
                <PillButton 
                  className="mt-4 w-full justify-center"
                  onClick={() => setSelectedInstructorId(instructor.id)}
                >
                  View Details
                </PillButton>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
