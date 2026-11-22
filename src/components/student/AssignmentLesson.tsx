import { useState, useEffect } from 'react';
import { LoadingState, ErrorState } from '../ui/States';
import { 
  useStudentAssignment,
  useMySubmission,
  useSubmitAssignment
} from '../../features/assignment/queries';
import { 
  Award, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  RotateCcw
} from 'lucide-react';

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
    if (submission && submission.status === 'GRADED') {
      onComplete();
    }
  }, [submission, onComplete]);

  if (assignLoading || subLoading) return <LoadingState message="Loading assignment specifications..." />;
  if (assignError || !assignment) return <ErrorState message="We couldn't retrieve the assignment specifications." />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    if (window.confirm("Submit your assignment for review?")) {
      submitAssignment.mutate({ submissionText }, {
        onSuccess: () => {
          setSubmissionText('');
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Assignment Header */}
      <div className="pb-4 border-b border-rule flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-ember font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Assignment &amp; Project Evaluation</span>
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-semibold text-foreground leading-snug">
          {assignment.title || title}
        </h2>

        {/* Evaluation Standards Row */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-rule/80">
          <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5">
            <span className="text-[10px] font-mono uppercase text-muted">Max Points</span>
            <span className="font-sans text-base font-bold text-foreground">{assignment.maxScore} points</span>
          </div>
          {assignment.dueAt && (
            <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase text-muted">Due Date</span>
              <span className="font-sans text-base font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-ember" />
                {new Date(assignment.dueAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-muted">
          <FileText className="w-3.5 h-3.5" />
          <span>Assignment Requirements &amp; Instructions</span>
        </div>
        <div className="p-5 sm:p-6 rounded-[10px] bg-wash border border-rule font-body text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-wrap">
          {assignment.instructions}
        </div>
      </div>

      {/* Submission Status & Form */}
      <div className="pt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-rule">
          <span className="text-xs font-mono font-semibold uppercase text-muted">
            Your Submission &amp; Status
          </span>
          {submission && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-ember font-semibold bg-wash px-2.5 py-0.5 rounded border border-rule">
              Status: {submission.status}
            </span>
          )}
        </div>
        
        {submission ? (
          <div className="flex flex-col gap-4">
            <div className={`p-5 rounded-[10px] border flex flex-col gap-3.5 ${
              submission.status === 'GRADED' 
                ? 'bg-[#3c8254]/5 border-[#3c8254]/30' 
                : submission.status === 'RETURNED' 
                  ? 'bg-ember/5 border-ember/30' 
                  : 'bg-wash/50 border-rule'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {submission.status === 'GRADED' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3c8254]" />
                  ) : submission.status === 'RETURNED' ? (
                    <AlertCircle className="w-4 h-4 text-ember" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-ember animate-pulse" />
                  )}
                  <span className="font-sans text-sm font-semibold text-foreground">
                    {submission.status === 'GRADED' 
                      ? 'Graded by Instructor' 
                      : submission.status === 'RETURNED' 
                        ? 'Returned for Revision' 
                        : 'Assignment Submitted · Awaiting Review'}
                  </span>
                </div>

                {submission.status === 'GRADED' && (
                  <span className="font-mono text-sm font-bold text-[#3c8254] bg-[#3c8254]/10 px-2.5 py-1 rounded-md">
                    {submission.score} / {assignment.maxScore} pts
                  </span>
                )}
              </div>
              
              {submission.feedback && (
                <div className="p-3.5 rounded-[10px] bg-card border border-rule text-xs">
                  <span className="font-mono text-[10px] uppercase text-muted block mb-1">
                    Instructor Feedback:
                  </span>
                  <p className="font-body text-muted italic">
                    "{submission.feedback}"
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-[10px] bg-card border border-rule text-xs font-mono text-muted whitespace-pre-wrap">
                <span className="text-[10px] text-muted uppercase block mb-1">Your Submission:</span>
                {submission.submissionText}
              </div>
            </div>
            
            {submission.status === 'RETURNED' && (
              <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
                <h4 className="font-sans text-sm font-semibold text-foreground">
                  Resubmit Assignment
                </h4>
                <textarea
                  required
                  rows={6}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Enter your revised code, notes, or answers..."
                  className="w-full rounded-[10px] border border-rule bg-card p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#121212] transition-all"
                />
                <button 
                  type="submit" 
                  disabled={submitAssignment.isPending} 
                  className="self-start px-5 py-2.5 rounded-[10px] bg-card hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{submitAssignment.isPending ? 'Resubmitting...' : 'Resubmit Assignment'}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <textarea
              required
              rows={8}
              value={submissionText}
              onChange={e => setSubmissionText(e.target.value)}
              placeholder="Paste your submission, code solutions, explanations, or project repository links..."
              className="w-full rounded-[10px] border border-rule bg-card p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#121212] transition-all placeholder:text-muted"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-muted font-mono">
                Submissions are time-stamped and evaluated by the course instructor.
              </span>
              <button 
                type="submit" 
                disabled={submitAssignment.isPending} 
                className="self-end sm:self-auto px-6 py-2.5 rounded-[10px] bg-card hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitAssignment.isPending ? 'Submitting...' : 'Submit Assignment'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
