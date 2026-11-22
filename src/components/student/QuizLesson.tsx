import { useState, useEffect } from 'react';
import { LoadingState } from '../ui/States';
import { 
  useStudentQuizDetails,
  useActiveAttempt,
  useAttemptHistory,
  useStartAttempt,
  useSubmitAttempt
} from '../../features/quiz/queries';
import type { QuizSubmitRequest } from '../../features/quiz/types';
import { 
  ListChecks, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Award,
  ChevronRight
} from 'lucide-react';

interface QuizLessonProps {
  courseId: string;
  quizId: string;
  title: string;
  onComplete: () => void;
}

export function QuizLesson({ courseId, quizId, title, onComplete }: QuizLessonProps) {
  const { data: quiz, isLoading: quizLoading } = useStudentQuizDetails(courseId, quizId);
  const { data: activeAttempt, isLoading: attemptLoading } = useActiveAttempt(courseId, quizId);
  const { data: history } = useAttemptHistory(courseId, quizId);
  
  const startAttempt = useStartAttempt(courseId, quizId);
  const submitAttempt = useSubmitAttempt(courseId, quizId, activeAttempt?.id || '');

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const effectiveQuiz = quiz;
  const effectiveAttempt = activeAttempt;
  const effectiveHistory = history || [];
  const hasPassed = effectiveHistory.some(h => h.passed);

  useEffect(() => {
    if (hasPassed) {
      onComplete();
    }
  }, [hasPassed, onComplete]);

  if (quizLoading || attemptLoading) return <LoadingState message="Loading knowledge assessment..." />;

  if (!effectiveQuiz || !effectiveQuiz.questions || effectiveQuiz.questions.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-4 bg-card border border-rule rounded-[10px] shadow-xs">
        <div className="w-12 h-12 rounded-full bg-wash flex items-center justify-center text-muted">
          <ListChecks className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="font-sans text-lg font-semibold text-foreground">{title || 'Graded Assessment'}</h3>
          <p className="font-body text-xs text-muted leading-relaxed">
            No graded quiz has been published for this lesson yet. When the instructor adds questions, they will appear here automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="mt-2 px-5 py-2 rounded-[10px] bg-card text-[#f8f8f6] text-xs font-medium hover:bg-black/80 transition-colors cursor-pointer"
        >
          Mark Lesson Complete
        </button>
      </div>
    );
  }

  const attemptsTaken = effectiveHistory?.length || 0;
  const attemptsRemaining = Math.max(0, effectiveQuiz.attemptsAllowed - attemptsTaken);
  const isOutOfAttempts = attemptsRemaining <= 0 && !effectiveAttempt;
  
  const lastAttempt = effectiveHistory?.[0];

  const handleStart = () => {
    setSubmissionError(null);
    startAttempt.mutate(undefined, {
      onError: (err: any) => {
        setSubmissionError(err.message || 'Failed to start quiz attempt.');
      }
    });
  };

  const handleToggleAnswer = (questionId: string, optionId: string, isMulti: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (!isMulti) {
        return { ...prev, [questionId]: [optionId] };
      } else {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      }
    });
  };

  const handleSubmit = () => {
    if (!effectiveAttempt) return;
    setSubmissionError(null);
    
    const submission: QuizSubmitRequest = {
      answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
        questionId,
        selectedOptionIds
      }))
    };

    if (window.confirm("Submit your verification answers for automated grading?")) {
      submitAttempt.mutate(submission, {
        onSuccess: (data) => {
          if (data.passed) {
            onComplete();
          }
          setAnswers({});
        },
        onError: (err: any) => {
          setSubmissionError(err.message || 'Failed to submit quiz attempt.');
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Assessment Header */}
      <div className="pb-4 border-b border-rule flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-ember font-semibold">
          <ListChecks className="w-3.5 h-3.5" />
          <span>Knowledge Verification Assessment</span>
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-semibold text-foreground leading-snug">
          {title}
        </h2>
        {effectiveQuiz.description && (
          <p className="font-body text-xs sm:text-sm text-muted leading-relaxed mt-1">
            {effectiveQuiz.description}
          </p>
        )}

        {/* Verification Standards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-rule/80">
          <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5">
            <span className="text-[10px] font-mono uppercase text-muted">Passing Benchmark</span>
            <span className="font-sans text-base font-bold text-foreground">{effectiveQuiz.passScore}%</span>
          </div>
          <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5">
            <span className="text-[10px] font-mono uppercase text-muted">Attempts Allowed</span>
            <span className="font-sans text-base font-bold text-foreground">{attemptsTaken} / {effectiveQuiz.attemptsAllowed}</span>
          </div>
          {effectiveQuiz.timeLimitSeconds ? (
            <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-muted">Time Limit</span>
              <span className="font-sans text-base font-bold text-foreground">{Math.floor(effectiveQuiz.timeLimitSeconds / 60)} minutes</span>
            </div>
          ) : (
            <div className="p-3 rounded-[10px] bg-wash/50 border border-rule flex flex-col gap-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-muted">Evaluation Pace</span>
              <span className="font-sans text-base font-bold text-[#3c8254]">Untimed</span>
            </div>
          )}
        </div>
      </div>

      {submissionError && (
        <div className="p-4 rounded-[10px] bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      {!effectiveAttempt ? (
        <div className="flex flex-col gap-5">
          {lastAttempt && (
            <div className={`p-4 rounded-[10px] border flex items-center justify-between gap-4 ${
              lastAttempt.passed 
                ? 'bg-[#3c8254]/5 border-[#3c8254]/30' 
                : 'bg-wash border-rule'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  lastAttempt.passed ? 'bg-[#3c8254]/10 text-[#3c8254]' : 'bg-card/10 text-foreground'
                }`}>
                  {lastAttempt.passed ? <CheckCircle2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-sans text-sm font-semibold text-foreground">
                    Previous Attempt: {lastAttempt.percentage}% Score
                  </div>
                  <div className="text-[11px] font-mono text-muted">
                    Status: <span className={lastAttempt.passed ? 'text-[#3c8254] font-semibold' : 'text-ember font-semibold'}>
                      {lastAttempt.passed ? 'PASSED · Verified' : 'DID NOT PASS · Revision Recommended'}
                    </span>
                  </div>
                </div>
              </div>

              {lastAttempt.passed && (
                <span className="text-xs font-mono text-[#3c8254] font-semibold bg-[#3c8254]/10 px-2.5 py-1 rounded-md border border-[#3c8254]/20">
                  Accredited
                </span>
              )}
            </div>
          )}
          
          {isOutOfAttempts ? (
            <div className="p-6 rounded-[10px] border border-rule bg-wash/50 text-center flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-ember" />
              <h4 className="font-sans text-base font-semibold text-foreground">Maximum Assessment Attempts Reached</h4>
              <p className="font-body text-xs text-muted max-w-md">
                You have exhausted all {effectiveQuiz.attemptsAllowed} attempts for this evaluation. Contact faculty office hours for guidance.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-[10px] border border-rule bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="font-sans text-base font-semibold text-foreground">
                  {attemptsTaken > 0 ? 'Ready for Re-evaluation?' : 'Begin Verification Assessment'}
                </h4>
                <p className="font-body text-xs text-muted">
                  {attemptsRemaining} of {effectiveQuiz.attemptsAllowed} attempts remaining. Answers are evaluated instantaneously.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStart}
                disabled={startAttempt.isPending}
                className="px-6 py-2.5 rounded-[10px] bg-card hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>{startAttempt.isPending ? 'Preparing Questions...' : (attemptsTaken > 0 ? 'Retry Assessment' : 'Start Assessment')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Active Banner */}
          <div className="p-3.5 rounded-[10px] bg-wash border border-rule flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-foreground">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse"></span>
              <span>Assessment In Progress · Select all correct options</span>
            </div>
            <span className="text-[10px] font-mono text-muted">
              {effectiveQuiz.questions.length} Questions
            </span>
          </div>

          {/* Questions Stack */}
          <div className="flex flex-col gap-5">
            {effectiveQuiz.questions.map((q, i) => {
              const isMulti = q.questionType === 'MULTI_SELECT';
              return (
                <div 
                  key={q.id} 
                  className="rounded-[10px] border border-rule bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sans text-base font-semibold text-foreground leading-snug">
                      <span className="text-ember font-mono mr-2">{i + 1}.</span>
                      {q.questionText}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-wash px-2 py-0.5 rounded border border-rule shrink-0">
                      {isMulti ? 'Multi-select' : 'Single Choice'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 pt-1">
                    {q.options.map(opt => {
                      const isSelected = (answers[q.id] || []).includes(opt.id);
                      return (
                        <label 
                          key={opt.id} 
                          className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-wash border-rule font-medium text-foreground' 
                              : 'bg-card border-rule hover:bg-wash/50 text-muted'
                          }`}
                        >
                          <input 
                            type={isMulti ? 'checkbox' : 'radio'}
                            name={q.id}
                            checked={isSelected}
                            onChange={() => handleToggleAnswer(q.id, opt.id, isMulti)}
                            className="w-4 h-4 accent-[#121212] border-rule"
                          />
                          <span className="text-xs font-body leading-relaxed">
                            {opt.optionText}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-muted font-mono">
              Review your answers before submitting. Automated evaluation will record immediately.
            </span>

            <button 
              type="button"
              onClick={handleSubmit} 
              disabled={submitAttempt.isPending} 
              className="px-6 py-3 rounded-[10px] bg-card hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{submitAttempt.isPending ? 'Grading Answers...' : 'Submit Answers for Verification'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
