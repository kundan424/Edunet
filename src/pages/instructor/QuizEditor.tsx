import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  useInstructorQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion
} from '../../features/quiz/queries';
import type { QuestionType, InstructorQuestionResponse, OptionCreateRequest } from '../../features/quiz/types';
import {
  ArrowLeft,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileQuestion,
  ChevronDown,
  X
} from 'lucide-react';

export function QuizEditor() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useInstructorQuiz(courseId!, lessonId!);
  const createQuiz = useCreateQuiz(courseId!, lessonId!);
  const updateQuiz = useUpdateQuiz(courseId!, lessonId!);

  const is404 = Boolean(
    (error as any)?.status === 404 ||
    (error as any)?.code === 'RESOURCE_NOT_FOUND' ||
    (error as any)?.code === 'NOT_FOUND' ||
    error?.message?.includes('404') ||
    error?.message?.toLowerCase().includes('not found')
  );

  const isNew = (!quiz && !isLoading) && (!error || is404);
  const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    passScore: '70',
    attemptsAllowed: '1',
    timeLimitSeconds: '',
  });

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        passScore: quiz.passScore ? quiz.passScore.toString() : '70',
        attemptsAllowed: quiz.attemptsAllowed ? quiz.attemptsAllowed.toString() : '1',
        timeLimitSeconds: quiz.timeLimitSeconds ? Math.round(quiz.timeLimitSeconds / 60).toString() : '',
      });
    }
  }, [quiz]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#121212]/20 border-t-[#121212] rounded-full animate-spin" />
        <span className="font-heading text-lg text-[#121212]">Loading Quiz...</span>
        <span className="font-mono text-xs text-[#7b7974]">QUIZ-{lessonId?.slice(0, 6).toUpperCase()}</span>
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-16 px-4">
        <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#ba1a1a]/30 shadow-xs max-w-xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl text-[#121212]">Failed to load quiz</h2>
          <p className="font-body text-xs text-[#7b7974] leading-relaxed">
            {(error as any)?.message || 'Quiz not found or unauthorized.'}
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => navigate(`/instructor/courses/${courseId}`)}
              className="px-4 py-2 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-xs font-medium text-[#121212]"
            >
              Back to Course
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#121212] hover:bg-black text-xs font-medium text-[#f8f8f6]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const timeInSeconds = formData.timeLimitSeconds ? parseInt(formData.timeLimitSeconds, 10) * 60 : undefined;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      passScore: parseInt(formData.passScore, 10),
      attemptsAllowed: parseInt(formData.attemptsAllowed, 10),
      timeLimitSeconds: timeInSeconds,
    };

    if (isNew) {
      createQuiz.mutate(payload, {
        onSuccess: () => {
          setActiveTab('questions');
          setSaveSuccess(true);
        }
      });
    } else {
      updateQuiz.mutate(payload, {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Breadcrumb & Quiz Header Bar ── */}
      <section className="w-full bg-[#f8f8f6]/90 border-b border-[#e7e6e1] py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-3">
          {/* Breadcrumb Row */}
          <div className="flex items-center justify-between text-xs font-mono text-[#7b7974]">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/instructor" className="hover:text-[#121212] transition-colors">Instructor Studio</Link>
              <span>/</span>
              <Link to="/instructor/courses" className="hover:text-[#121212] transition-colors">Courses</Link>
              <span>/</span>
              <Link to={`/instructor/courses/${courseId}`} className="hover:text-[#121212] transition-colors">
                Course Studio
              </Link>
              <span>/</span>
              <span className="text-[#121212] font-semibold">Quiz</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#9c9a92]">
              <span>Quiz ID:</span>
              <span className="bg-[#e7e6e1] text-[#121212] px-2 py-0.5 rounded text-[10px] tracking-wide font-semibold">
                QUIZ-{lessonId?.slice(0, 6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Headline & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-2xl sm:text-3xl text-[#121212] font-normal">
                  {isNew ? 'Create New Quiz' : (quiz?.title || 'Edit Quiz')}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faecd8] text-[#8c501e] font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
                  {isNew ? 'NEW DRAFT' : 'QUIZ BUILDER'}
                </span>
              </div>
              <p className="font-body text-xs text-[#7b7974]">
                Add questions, set the passing score, and configure quiz settings.
              </p>
            </div>

            <Link
              to={`/instructor/courses/${courseId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ffffff] hover:bg-[#efeeeb] text-[#121212] text-xs font-medium transition-colors border border-[#e7e6e1] shadow-2xs self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#7b7974]" />
              <span>Back to Course</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tabs Bar ── */}
      {!isNew && (
        <section className="w-full bg-[#f8f8f6]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-3">
            <div className="flex items-center gap-1.5 bg-[#efeeeb] p-1 rounded-xl max-w-fit border border-[#e7e6e1]/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#ffffff] text-[#121212] shadow-xs'
                    : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
                }`}
              >
                <Settings className="w-4 h-4 text-[#7b7974]" />
                <span>Quiz Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                  activeTab === 'questions'
                    ? 'bg-[#ffffff] text-[#121212] shadow-xs'
                    : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#121212]" />
                <span>Questions</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#efeeeb] text-[#373734] font-mono text-[10px]">
                  {quiz?.questions?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Stage ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full py-6">
        {/* TAB 1: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {saveSuccess && (
              <div className="p-4 rounded-xl bg-[#eaf4ea] text-[#245222] border border-[#4b7a47]/20 flex items-center justify-between shadow-2xs animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4b7a47] shrink-0" />
                  <span className="font-body text-xs font-medium">
                    Quiz settings successfully saved.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#4b7a47] uppercase font-bold tracking-wider">Saved</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs flex flex-col gap-6">
              <div className="flex flex-col gap-1 pb-4 border-b border-[#e7e6e1]">
                <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                  Quiz Settings &amp; Grading
                </h2>
                <p className="font-body text-xs text-[#7b7974]">
                  Configure passing threshold, attempt limits, and test duration.
                </p>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#121212]">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Chapter 1 Knowledge Check"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#121212]">
                  Quiz Instructions &amp; Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline quiz instructions, guidelines, and what students should know..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none leading-relaxed"
                />
              </div>

              {/* 3-Column Grid: Pass Score, Attempts, Time Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#121212]">
                    Passing Score (%) *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={formData.passScore}
                      onChange={e => setFormData({ ...formData, passScore: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                    />
                    <span className="absolute right-3 text-xs font-mono text-[#9c9a92] pointer-events-none">%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#121212]">
                    Allowed Attempts *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.attemptsAllowed}
                    onChange={e => setFormData({ ...formData, attemptsAllowed: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#121212]">
                    Time Limit (Minutes)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min={0}
                      value={formData.timeLimitSeconds}
                      onChange={e => setFormData({ ...formData, timeLimitSeconds: e.target.value })}
                      placeholder="e.g., 30"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                    />
                    <Clock className="w-3.5 h-3.5 text-[#9c9a92] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-4 border-t border-[#e7e6e1]">
                <span className="font-mono text-[11px] text-[#9c9a92]">
                  {isNew ? 'Creates quiz for this lesson' : 'Saved to course'}
                </span>
                <button
                  type="submit"
                  disabled={createQuiz.isPending || updateQuiz.isPending}
                  className="px-6 py-2.5 rounded-lg bg-[#121212] hover:bg-black text-[#f8f8f6] font-body text-xs font-medium transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {createQuiz.isPending || updateQuiz.isPending ? 'Saving...' : (isNew ? 'Create Quiz & Open Questions Bank →' : 'Save Quiz Settings')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: QUESTIONS MANAGER */}
        {activeTab === 'questions' && quiz && (
          <QuestionManager
            courseId={courseId!}
            lessonId={lessonId!}
            questions={quiz.questions || []}
          />
        )}
      </div>
    </div>
  );
}

function QuestionManager({
  courseId,
  lessonId,
  questions
}: {
  courseId: string;
  lessonId: string;
  questions: InstructorQuestionResponse[];
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs">
        <div className="flex flex-col">
          <h3 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
            Quiz Questions
          </h3>
          <span className="font-mono text-xs text-[#7b7974]">
            {questions.length} {questions.length === 1 ? 'Question' : 'Questions'} added
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#121212] hover:bg-black text-[#f8f8f6] text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5 text-[#d97757]" />
          <span>+ Add Question</span>
        </button>
      </div>

      {/* Inline New Question Form */}
      {isAdding && (
        <div className="bg-[#ffffff] rounded-2xl p-6 border-2 border-[#121212] shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1] mb-4">
            <h4 className="font-heading text-base text-[#121212]">Add New Question</h4>
            <span className="font-mono text-xs text-[#7b7974]">Question #{questions.length + 1}</span>
          </div>

          <QuestionForm
            courseId={courseId}
            lessonId={lessonId}
            defaultOrder={questions.length + 1}
            onCancel={() => setIsAdding(false)}
            onComplete={() => setIsAdding(false)}
          />
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isAdding && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-[#e7e6e1] bg-[#ffffff] flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#efeeeb] flex items-center justify-center text-[#9c9a92]">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="font-heading text-lg text-[#121212]">No Questions Added Yet</span>
            <p className="font-body text-xs text-[#7b7974] leading-relaxed">
              Add your first multiple choice, single select, or true/false question for this quiz.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-1 px-4 py-2 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d97757]" />
            <span>+ Add First Question</span>
          </button>
        </div>
      )}

      {/* Question List */}
      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <QuestionRow
            key={q.id}
            courseId={courseId}
            lessonId={lessonId}
            question={q}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionRow({
  courseId,
  lessonId,
  question,
  index
}: {
  courseId: string;
  lessonId: string;
  question: InstructorQuestionResponse;
  index: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteQ = useDeleteQuestion(courseId, lessonId);

  if (isEditing) {
    return (
      <div className="bg-[#ffffff] rounded-2xl p-6 border-2 border-[#121212] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1] mb-4">
          <h4 className="font-heading text-base text-[#121212]">Edit Question {index + 1}</h4>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[#9c9a92] hover:text-[#121212]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <QuestionForm
          courseId={courseId}
          lessonId={lessonId}
          existingQuestion={question}
          onCancel={() => setIsEditing(false)}
          onComplete={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-2xs flex flex-col gap-4">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-full bg-[#efeeeb] text-[#373734] font-mono text-xs font-semibold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <h4 className="font-body text-sm font-semibold text-[#121212] leading-snug">
              {question.questionText}
            </h4>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#7b7974] uppercase">
              <span>{question.questionType.replace('_', ' ')}</span>
              <span>•</span>
              <span className="text-[#373734] font-medium">{question.points} {question.points === 1 ? 'Point' : 'Points'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors cursor-pointer"
            title="Edit question"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this question?')) {
                deleteQ.mutate(question.id);
              }
            }}
            disabled={deleteQ.isPending}
            className="p-1.5 rounded-lg text-[#9c9a92] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer disabled:opacity-50"
            title="Delete question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Options Stack */}
      <div className="pl-10 flex flex-col gap-2">
        {question.options.map(opt => (
          <div
            key={opt.id}
            className={`px-3 py-2 rounded-xl text-xs font-body border flex items-center justify-between ${
              opt.isCorrect
                ? 'border-[#4b7a47]/30 bg-[#eaf4ea] text-[#245222]'
                : 'border-[#e7e6e1] bg-[#f8f8f6] text-[#373734]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${opt.isCorrect ? 'bg-[#4b7a47]' : 'bg-[#9c9a92]'}`} />
              <span>{opt.optionText}</span>
            </div>
            {opt.isCorrect && (
              <span className="font-mono text-[10px] uppercase font-bold text-[#4b7a47] tracking-wider">
                ✓ Correct Answer
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionForm({
  courseId,
  lessonId,
  existingQuestion,
  defaultOrder,
  onCancel,
  onComplete
}: {
  courseId: string;
  lessonId: string;
  existingQuestion?: InstructorQuestionResponse;
  defaultOrder?: number;
  onCancel: () => void;
  onComplete: () => void;
}) {
  const addQ = useAddQuestion(courseId, lessonId);
  const updateQ = useUpdateQuestion(courseId, lessonId, existingQuestion?.id || '');

  const [text, setText] = useState(existingQuestion?.questionText || '');
  const [type, setType] = useState<QuestionType>(existingQuestion?.questionType || 'MCQ_SINGLE');
  const [points, setPoints] = useState(existingQuestion?.points?.toString() || '1');
  const [order, setOrder] = useState(existingQuestion?.displayOrder?.toString() || defaultOrder?.toString() || '1');

  const [options, setOptions] = useState<OptionCreateRequest[]>(
    existingQuestion?.options?.map(o => ({
      optionText: o.optionText,
      displayOrder: o.displayOrder,
      isCorrect: o.isCorrect
    })) || [
      { optionText: '', displayOrder: 1, isCorrect: true },
      { optionText: '', displayOrder: 2, isCorrect: false }
    ]
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (type !== 'TRUE_FALSE' && options.length < 2) {
      alert('At least two options are required for this question type.');
      return;
    }
    if (type !== 'TRUE_FALSE' && !options.some(o => o.isCorrect)) {
      alert('Please mark at least one option as the correct answer.');
      return;
    }

    const payload = {
      questionText: text.trim(),
      questionType: type,
      points: parseInt(points, 10),
      displayOrder: parseInt(order, 10),
      options: type === 'TRUE_FALSE' ? [
        { optionText: 'True', displayOrder: 1, isCorrect: options[0]?.isCorrect ?? true },
        { optionText: 'False', displayOrder: 2, isCorrect: !(options[0]?.isCorrect ?? true) }
      ] : options.map((o, idx) => ({ ...o, displayOrder: idx + 1 }))
    };

    if (existingQuestion) {
      updateQ.mutate(payload, { onSuccess: onComplete });
    } else {
      addQ.mutate(payload, { onSuccess: onComplete });
    }
  };

  const updateOption = (index: number, field: keyof OptionCreateRequest, value: any) => {
    const newOpts = [...options];
    if (field === 'isCorrect' && type === 'MCQ_SINGLE') {
      newOpts.forEach(o => o.isCorrect = false);
    }
    newOpts[index] = { ...newOpts[index], [field]: value };
    setOptions(newOpts);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      {/* Question Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#121212]">Question Text *</label>
        <textarea
          required
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your question here..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
        />
      </div>

      {/* Row: Type, Points, Order */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#121212]">Question Type</label>
          <div className="relative">
            <select
              value={type}
              onChange={e => setType(e.target.value as QuestionType)}
              className="w-full appearance-none px-3.5 py-2 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212] cursor-pointer"
            >
              <option value="MCQ_SINGLE">Single Choice (Radio)</option>
              <option value="MULTI_SELECT">Multiple Choice (Checkboxes)</option>
              <option value="TRUE_FALSE">True / False</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9c9a92] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#121212]">Points</label>
          <input
            type="number"
            required
            min={1}
            value={points}
            onChange={e => setPoints(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#121212]">Question Order</label>
          <input
            type="number"
            required
            min={1}
            value={order}
            onChange={e => setOrder(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212]"
          />
        </div>
      </div>

      {/* Options Section */}
      <div className="flex flex-col gap-2 pt-2">
        <label className="text-xs font-semibold text-[#121212]">Answer Choices</label>

        {type === 'TRUE_FALSE' ? (
          <div className="flex gap-4 p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="tfChoice"
                checked={options[0]?.isCorrect ?? true}
                onChange={() => setOptions([{ optionText: 'True', displayOrder: 1, isCorrect: true }])}
                className="w-4 h-4 accent-[#121212]"
              />
              <span>True is Correct</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="tfChoice"
                checked={!(options[0]?.isCorrect ?? true)}
                onChange={() => setOptions([{ optionText: 'True', displayOrder: 1, isCorrect: false }])}
                className="w-4 h-4 accent-[#121212]"
              />
              <span>False is Correct</span>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type={type === 'MCQ_SINGLE' ? 'radio' : 'checkbox'}
                  name={`correctAnswerChoice`}
                  checked={opt.isCorrect}
                  onChange={e => updateOption(i, 'isCorrect', e.target.checked)}
                  className="w-4 h-4 accent-[#121212] shrink-0"
                  title="Mark as correct answer"
                />
                <input
                  type="text"
                  required
                  value={opt.optionText}
                  onChange={e => updateOption(i, 'optionText', e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="px-3 py-2 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212] flex-1"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-[#9c9a92] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setOptions([...options, { optionText: '', displayOrder: options.length + 1, isCorrect: false }])}
              className="self-start text-xs font-mono font-medium text-[#d97757] hover:underline pt-1 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Option</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Footers */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e7e6e1]">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#7b7974] hover:bg-[#efeeeb] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={addQ.isPending || updateQ.isPending}
          className="px-4 py-1.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {addQ.isPending || updateQ.isPending ? 'Saving Question...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
