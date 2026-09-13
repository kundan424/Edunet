import { useState, useEffect } from 'react';
import { SectionHeading } from '../ui/Typography';
import { PillButton } from '../ui/Button';
import { LoadingState, ErrorState } from '../ui/States';
import { 
  useStudentAssignment,
  useMySubmission,
  useSubmitAssignment
} from '../../features/assignment/queries';

interface AssignmentLessonProps {
  courseId: string;
  lessonId: string;
  title: string;
  onComplete: () => void;
}

export function AssignmentLesson({ courseId, lessonId, title, onComplete }: AssignmentLessonProps) {
  const { data: assignment, isLoading: assignLoading, error: assignError } = useStudentAssignment(courseId, lessonId);
  const { data: submission, isLoading: subLoading } = useMySubmission(courseId, lessonId);
  
  const submitAssignment = useSubmitAssignment(courseId, lessonId);
  
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    // If graded and score > 0 (or whatever logic), we can trigger onComplete
    // For now, if it's graded, we consider the lesson completed.
    if (submission && submission.status === 'GRADED') {
      onComplete();
    }
  }, [submission, onComplete]);

  if (assignLoading || subLoading) return <LoadingState message="Loading assignment..." />;
  if (assignError || !assignment) return <ErrorState message="Failed to load assignment details." />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    if (window.confirm("Are you sure you want to submit? You may not be able to edit this later.")) {
      submitAssignment.mutate({ submissionText }, {
        onSuccess: () => {
          setSubmissionText('');
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-midnight-ink bg-white flex flex-col">
        <div className="p-6 md:p-8 border-b border-midnight-ink bg-cream-paper">
          <SectionHeading>{assignment.title || title}</SectionHeading>
          
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-midnight-ink/20">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase text-gray-500">Max Score</span>
              <span className="font-bold">{assignment.maxScore} pts</span>
            </div>
            {assignment.dueAt && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-gray-500">Due Date</span>
                <span className="font-bold">{new Date(assignment.dueAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h3 className="font-bold uppercase text-xs mb-3 text-gray-500">Instructions</h3>
            <div className="whitespace-pre-wrap font-usual text-midnight-ink">
              {assignment.instructions}
            </div>
          </div>

          <div className="border-t border-midnight-ink pt-6 mt-2">
            <h3 className="font-bold uppercase text-xs mb-4 text-gray-500">Your Submission</h3>
            
            {submission ? (
              <div className="flex flex-col gap-4">
                <div className={`p-4 border-l-4 ${
                  submission.status === 'GRADED' ? 'border-signal-blue bg-signal-blue/5' :
                  submission.status === 'RETURNED' ? 'border-ember-red bg-ember-red/5' :
                  'border-saffron-yellow bg-saffron-yellow/5'
                }`}>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/10">
                    <span className="font-bold uppercase text-sm tracking-wider">{submission.status}</span>
                    {submission.status === 'GRADED' && (
                      <span className="font-bold font-degular-display text-2xl">{submission.score} / {assignment.maxScore}</span>
                    )}
                  </div>
                  
                  {submission.feedback && (
                    <div className="mb-4">
                      <span className="font-bold text-xs uppercase block mb-1">Instructor Feedback:</span>
                      <p className="italic text-sm">{submission.feedback}</p>
                    </div>
                  )}

                  <div className="bg-white p-4 border border-midnight-ink/20 whitespace-pre-wrap text-sm">
                    {submission.submissionText}
                  </div>
                </div>
                
                {/* If backend allows resubmitting returned assignments, you'd check status === 'RETURNED' here */}
                {submission.status === 'RETURNED' && (
                  <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <h4 className="font-bold text-sm">Resubmit Assignment</h4>
                    <textarea
                      required
                      rows={6}
                      value={submissionText}
                      onChange={e => setSubmissionText(e.target.value)}
                      placeholder="Enter your revised submission here..."
                      className="w-full border border-midnight-ink p-4 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                    />
                    <PillButton type="submit" disabled={submitAssignment.isPending} className="self-start">
                      {submitAssignment.isPending ? 'Submitting...' : 'Resubmit'}
                    </PillButton>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  required
                  rows={8}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Enter your submission here..."
                  className="w-full border border-midnight-ink p-4 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                />
                <PillButton type="submit" disabled={submitAssignment.isPending} className="self-start">
                  {submitAssignment.isPending ? 'Submitting...' : 'Submit Assignment'}
                </PillButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
