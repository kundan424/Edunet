import { useState, useEffect } from 'react';
import { SectionHeading, BodyText } from '../ui/Typography';
import { PillButton } from '../ui/Button';
import { LoadingState, ErrorState } from '../ui/States';
import { 
  useStudentQuizDetails,
  useActiveAttempt,
  useAttemptHistory,
  useStartAttempt,
  useSubmitAttempt
} from '../../features/quiz/queries';
import type { QuizSubmitRequest } from '../../features/quiz/types';

interface QuizLessonProps {
  courseId: string;
  quizId: string;
  title: string;
  onComplete: () => void;
}

export function QuizLesson({ courseId, quizId, title, onComplete }: QuizLessonProps) {
  const { data: quiz, isLoading: quizLoading, error: quizError } = useStudentQuizDetails(courseId, quizId);
  const { data: activeAttempt, isLoading: attemptLoading } = useActiveAttempt(courseId, quizId);
  const { data: history } = useAttemptHistory(courseId, quizId);
  
  const startAttempt = useStartAttempt(courseId, quizId);
  const submitAttempt = useSubmitAttempt(courseId, quizId, activeAttempt?.id || '');

  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Check if passed, trigger onComplete
    if (history && history.some(h => h.passed)) {
      onComplete();
    }
  }, [history, onComplete]);

  if (quizLoading || attemptLoading) return <LoadingState message="Loading quiz..." />;
  if (quizError || !quiz) return <ErrorState message="Failed to load quiz content." />;

  const attemptsTaken = history?.length || 0;
  const attemptsRemaining = quiz.attemptsAllowed - attemptsTaken;
  const isOutOfAttempts = attemptsRemaining <= 0 && !activeAttempt;
  
  const lastAttempt = history?.[0]; // Assuming history is sorted desc by date, or we just find the highest score.

  const handleStart = () => {
    startAttempt.mutate();
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
    if (!activeAttempt) return;
    
    // Convert to submission format
    const submission: QuizSubmitRequest = {
      answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
        questionId,
        selectedOptionIds
      }))
    };

    if (window.confirm("Ready to submit your answers?")) {
      submitAttempt.mutate(submission, {
        onSuccess: (data) => {
          if (data.passed) {
            onComplete();
          }
          setAnswers({});
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-midnight-ink bg-cream-paper p-6 md:p-8 flex flex-col gap-4">
        <SectionHeading>{title}</SectionHeading>
        {quiz.description && <BodyText>{quiz.description}</BodyText>}
        
        <div className="flex flex-wrap gap-4 mt-4 py-4 border-y border-midnight-ink/20">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-gray-500">Passing Score</span>
            <span className="font-bold">{quiz.passScore}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-gray-500">Attempts</span>
            <span className="font-bold">{attemptsTaken} / {quiz.attemptsAllowed}</span>
          </div>
          {quiz.timeLimitSeconds && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase text-gray-500">Time Limit</span>
              <span className="font-bold">{Math.floor(quiz.timeLimitSeconds / 60)} minutes</span>
            </div>
          )}
        </div>

        {!activeAttempt ? (
          <div className="flex flex-col gap-4 mt-4">
            {lastAttempt && (
              <div className={`p-4 border-l-4 ${lastAttempt.passed ? 'border-signal-blue bg-signal-blue/10' : 'border-ember-red bg-ember-red/10'}`}>
                <h4 className="font-bold">Last Attempt</h4>
                <p>Score: {lastAttempt.percentage}% ({lastAttempt.passed ? 'Passed' : 'Failed'})</p>
              </div>
            )}
            
            {isOutOfAttempts ? (
              <div className="p-4 border-2 border-midnight-ink bg-saffron-yellow/20 font-bold text-center">
                No attempts remaining.
              </div>
            ) : (
              <PillButton onClick={handleStart} disabled={startAttempt.isPending} className="self-start">
                {startAttempt.isPending ? 'Starting...' : (attemptsTaken > 0 ? 'Retry Quiz' : 'Start Quiz')}
              </PillButton>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8 mt-6">
            <div className="p-4 border-2 border-signal-blue bg-white font-bold sticky top-4 z-10 shadow-sm flex justify-between items-center">
              <span>Attempt in progress</span>
            </div>

            <div className="flex flex-col gap-8">
              {quiz.questions.map((q, i) => {
                const isMulti = q.questionType === 'MULTI_SELECT';
                return (
                  <div key={q.id} className="border border-midnight-ink bg-white p-6 flex flex-col gap-4">
                    <h3 className="font-bold text-lg"><span className="text-signal-blue mr-2">{i + 1}.</span> {q.questionText}</h3>
                    <div className="text-xs font-bold uppercase text-gray-500 mb-2">
                      {isMulti ? 'Select all that apply' : 'Select one'}
                    </div>
                    
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-black/10">
                      {q.options.map(opt => {
                        const isSelected = (answers[q.id] || []).includes(opt.id);
                        return (
                          <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type={isMulti ? 'checkbox' : 'radio'}
                              name={q.id}
                              checked={isSelected}
                              onChange={() => handleToggleAnswer(q.id, opt.id, isMulti)}
                              className="w-5 h-5 accent-signal-blue border-midnight-ink"
                            />
                            <span className={`transition-colors ${isSelected ? 'font-bold' : 'group-hover:text-signal-blue'}`}>
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

            <div className="pt-6 border-t border-midnight-ink">
              <PillButton onClick={handleSubmit} disabled={submitAttempt.isPending} className="w-full justify-center !py-4 text-lg">
                {submitAttempt.isPending ? 'Submitting...' : 'Submit Answers'}
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
