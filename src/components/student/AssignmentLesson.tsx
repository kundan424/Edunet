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

  if (assignLoading || subLoading) return <LoadingState message="Loading lab defense specification..." />;
  if (assignError || !assignment) return <ErrorState message="We couldn't retrieve the assignment specifications." />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    if (window.confirm("Submit your lab defense for peer and faculty review?")) {
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
      <div className="pb-4 border-b border-[#e7e6e1] flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Lab Defense &amp; Project Evaluation</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#121212] leading-snug">
          {assignment.title || title}
        </h2>

        {/* Evaluation Standards Row */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-[#e7e6e1]/80">
          <div className="p-3 rounded-xl bg-[#efeeeb]/50 border border-[#e7e6e1] flex flex-col gap-0.5">
            <span className="text-[10px] font-mono uppercase text-[#7b7974]">Max Defense Score</span>
            <span className="font-heading text-base font-bold text-[#121212]">{assignment.maxScore} points</span>
          </div>
          {assignment.dueAt && (
            <div className="p-3 rounded-xl bg-[#efeeeb]/50 border border-[#e7e6e1] flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase text-[#7b7974]">Milestone Due Date</span>
              <span className="font-heading text-base font-bold text-[#121212] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d97757]" />
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

      {/* Instructions Monograph */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#7b7974]">
          <FileText className="w-3.5 h-3.5" />
          <span>Defense Requirements &amp; Instructions</span>
        </div>
        <div className="p-5 sm:p-6 rounded-2xl bg-[#f8f8f6] border border-[#e7e6e1] font-body text-xs sm:text-sm text-[#373734] leading-relaxed whitespace-pre-wrap">
          {assignment.instructions}
        </div>
      </div>

      {/* Submission Status & Form */}
      <div className="pt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
          <span className="text-xs font-mono font-semibold uppercase text-[#7b7974]">
            Your Submission &amp; Defense Status
          </span>
          {submission && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold bg-[#efeeeb] px-2.5 py-0.5 rounded border border-[#e7e6e1]">
              Status: {submission.status}
            </span>
          )}
        </div>
        
        {submission ? (
          <div className="flex flex-col gap-4">
            <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${
              submission.status === 'GRADED' 
                ? 'bg-[#3c8254]/5 border-[#3c8254]/30' 
                : submission.status === 'RETURNED' 
                  ? 'bg-[#d97757]/5 border-[#d97757]/30' 
                  : 'bg-[#efeeeb]/50 border-[#e7e6e1]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {submission.status === 'GRADED' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3c8254]" />
                  ) : submission.status === 'RETURNED' ? (
                    <AlertCircle className="w-4 h-4 text-[#d97757]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d97757] animate-pulse" />
                  )}
                  <span className="font-heading text-sm font-semibold text-[#121212]">
                    {submission.status === 'GRADED' 
                      ? 'Evaluated by Faculty & Benchmarks' 
                      : submission.status === 'RETURNED' 
                        ? 'Returned for Revision' 
                        : 'Defense Submitted · Awaiting Faculty Review'}
                  </span>
                </div>

                {submission.status === 'GRADED' && (
                  <span className="font-mono text-sm font-bold text-[#3c8254] bg-[#3c8254]/10 px-2.5 py-1 rounded-md">
                    {submission.score} / {assignment.maxScore} pts
                  </span>
                )}
              </div>
              
              {submission.feedback && (
                <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] text-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7b7974] block mb-1">
                    Faculty Review Notes:
                  </span>
                  <p className="font-body text-[#373734] italic">
                    "{submission.feedback}"
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] text-xs font-mono text-[#373734] whitespace-pre-wrap">
                <span className="text-[10px] text-[#7b7974] uppercase block mb-1">Submitted Defense Output:</span>
                {submission.submissionText}
              </div>
            </div>
            
            {submission.status === 'RETURNED' && (
              <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
                <h4 className="font-heading text-sm font-semibold text-[#121212]">
                  Resubmit Revised Defense
                </h4>
                <textarea
                  required
                  rows={6}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Enter your revised code, defense notes, or benchmark traces..."
                  className="w-full rounded-xl border border-[#e7e6e1] bg-[#ffffff] p-4 font-mono text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] transition-all"
                />
                <button 
                  type="submit" 
                  disabled={submitAssignment.isPending} 
                  className="self-start px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{submitAssignment.isPending ? 'Resubmitting...' : 'Resubmit Defense'}</span>
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
              placeholder="Paste your defense implementation, benchmark logs, architectural explanations, or repository links..."
              className="w-full rounded-xl border border-[#e7e6e1] bg-[#ffffff] p-4 font-mono text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] transition-all placeholder:text-[#9c9a92]"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#7b7974] font-mono">
                Submissions are time-stamped and evaluated against automated CI benchmarks.
              </span>
              <button 
                type="submit" 
                disabled={submitAssignment.isPending} 
                className="self-end sm:self-auto px-6 py-2.5 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitAssignment.isPending ? 'Submitting Defense...' : 'Submit Defense for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
