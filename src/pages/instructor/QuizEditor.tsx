import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { 
  useInstructorQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion
} from '../../features/quiz/queries';
import type { QuestionType, InstructorQuestionResponse, OptionCreateRequest } from '../../features/quiz/types';

export function QuizEditor() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useInstructorQuiz(courseId!, lessonId!);
  const createQuiz = useCreateQuiz(courseId!, lessonId!);
  const updateQuiz = useUpdateQuiz(courseId!, lessonId!);

  const isNew = !quiz && error?.message?.includes('404');
  const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');

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
        title: quiz.title,
        description: quiz.description || '',
        passScore: quiz.passScore.toString(),
        attemptsAllowed: quiz.attemptsAllowed.toString(),
        timeLimitSeconds: quiz.timeLimitSeconds ? quiz.timeLimitSeconds.toString() : '',
      });
    }
  }, [quiz]);

  if (isLoading) return <LoadingState message="Loading quiz..." />;
  if (error && !isNew) return <ErrorState message="Failed to load quiz details." onRetry={() => window.location.reload()} />;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      passScore: parseInt(formData.passScore, 10),
      attemptsAllowed: parseInt(formData.attemptsAllowed, 10),
      timeLimitSeconds: formData.timeLimitSeconds ? parseInt(formData.timeLimitSeconds, 10) : undefined,
    };

    if (isNew) {
      createQuiz.mutate(payload, {
        onSuccess: () => setActiveTab('questions')
      });
    } else {
      updateQuiz.mutate(payload);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-midnight-ink">
        <div className="flex items-center gap-4">
          <PillButton onClick={() => navigate(`/instructor/courses/${courseId}`)} className="bg-transparent hover:bg-black/10 !py-2 !px-4">
            ← Back to Course
          </PillButton>
          <SectionHeading>{isNew ? 'Create Quiz' : 'Edit Quiz'}</SectionHeading>
        </div>
      </div>

      {!isNew && (
        <div className="flex border-b border-midnight-ink mb-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-bold border-b-4 transition-colors ${activeTab === 'settings' ? 'border-signal-blue text-midnight-ink' : 'border-transparent text-gray-500 hover:text-midnight-ink'}`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-3 font-bold border-b-4 transition-colors ${activeTab === 'questions' ? 'border-signal-blue text-midnight-ink' : 'border-transparent text-gray-500 hover:text-midnight-ink'}`}
          >
            Questions ({quiz?.questions.length || 0})
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl bg-white border border-midnight-ink p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-midnight-ink">Quiz Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-midnight-ink">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-midnight-ink text-sm">Pass Score (%)</label>
              <input
                type="number"
                required min={1} max={100}
                value={formData.passScore}
                onChange={e => setFormData(prev => ({ ...prev, passScore: e.target.value }))}
                className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-midnight-ink text-sm">Attempts Allowed</label>
              <input
                type="number"
                required min={1}
                value={formData.attemptsAllowed}
                onChange={e => setFormData(prev => ({ ...prev, attemptsAllowed: e.target.value }))}
                className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-midnight-ink text-sm">Time Limit (Seconds)</label>
              <input
                type="number"
                min={0}
                value={formData.timeLimitSeconds}
                onChange={e => setFormData(prev => ({ ...prev, timeLimitSeconds: e.target.value }))}
                className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-midnight-ink">
            <PillButton type="submit" disabled={createQuiz.isPending || updateQuiz.isPending}>
              {createQuiz.isPending || updateQuiz.isPending ? 'Saving...' : 'Save Settings'}
            </PillButton>
          </div>
        </form>
      )}

      {activeTab === 'questions' && quiz && (
        <QuestionManager courseId={courseId!} lessonId={lessonId!} questions={quiz.questions} />
      )}
    </div>
  );
}

function QuestionManager({ courseId, lessonId, questions }: { courseId: string, lessonId: string, questions: InstructorQuestionResponse[] }) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Manage Questions</h3>
        <PillButton onClick={() => setIsAdding(true)} disabled={isAdding}>+ Add Question</PillButton>
      </div>

      {isAdding && (
        <div className="p-6 border-2 border-signal-blue bg-white">
          <h4 className="font-bold mb-4">New Question</h4>
          <QuestionForm 
            courseId={courseId} 
            lessonId={lessonId} 
            onCancel={() => setIsAdding(false)} 
            onComplete={() => setIsAdding(false)} 
            defaultOrder={questions.length + 1}
          />
        </div>
      )}

      {questions.length === 0 && !isAdding ? (
        <EmptyState title="No questions yet" message="Add questions to complete your quiz setup." />
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
            <QuestionRow key={q.id} courseId={courseId} lessonId={lessonId} question={q} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionRow({ courseId, lessonId, question, index }: { courseId: string, lessonId: string, question: InstructorQuestionResponse, index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteQ = useDeleteQuestion(courseId, lessonId);

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-signal-blue bg-white">
        <h4 className="font-bold mb-4">Edit Question {index + 1}</h4>
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
    <div className="border border-midnight-ink bg-white flex flex-col p-4 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <span className="font-bold text-xl text-signal-blue">{index + 1}.</span>
          <div>
            <h4 className="font-bold">{question.questionText}</h4>
            <div className="flex gap-2 text-xs text-gray-500 mt-1 uppercase">
              <span>{question.questionType.replace('_', ' ')}</span>
              <span>•</span>
              <span>{question.points} Points</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-signal-blue font-bold text-sm hover:underline">Edit</button>
          <button 
            onClick={() => { if (window.confirm('Delete question?')) deleteQ.mutate(question.id); }} 
            className="text-ember-red font-bold text-sm hover:underline"
            disabled={deleteQ.isPending}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="pl-8 flex flex-col gap-2">
        {question.options.map(opt => (
          <div key={opt.id} className={`p-2 border ${opt.isCorrect ? 'border-signal-blue bg-signal-blue/10' : 'border-midnight-ink/20'}`}>
            {opt.isCorrect && <span className="text-signal-blue font-bold text-xs mr-2">✓ CORRECT</span>}
            {opt.optionText}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionForm({ courseId, lessonId, existingQuestion, defaultOrder, onCancel, onComplete }: { 
  courseId: string, 
  lessonId: string, 
  existingQuestion?: InstructorQuestionResponse,
  defaultOrder?: number,
  onCancel: () => void,
  onComplete: () => void
}) {
  const addQ = useAddQuestion(courseId, lessonId);
  const updateQ = useUpdateQuestion(courseId, lessonId, existingQuestion?.id || '');

  const [text, setText] = useState(existingQuestion?.questionText || '');
  const [type, setType] = useState<QuestionType>(existingQuestion?.questionType || 'MCQ_SINGLE');
  const [points, setPoints] = useState(existingQuestion?.points?.toString() || '1');
  const [order, setOrder] = useState(existingQuestion?.displayOrder?.toString() || defaultOrder?.toString() || '1');
  const [options, setOptions] = useState<OptionCreateRequest[]>(existingQuestion?.options?.map(o => ({
    optionText: o.optionText,
    displayOrder: o.displayOrder,
    isCorrect: o.isCorrect
  })) || [
    { optionText: '', displayOrder: 1, isCorrect: false },
    { optionText: '', displayOrder: 2, isCorrect: false }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (type !== 'TRUE_FALSE' && options.length < 2) {
      alert("At least two options are required.");
      return;
    }
    if (type !== 'TRUE_FALSE' && !options.some(o => o.isCorrect)) {
      alert("Please mark at least one option as correct.");
      return;
    }

    const payload = {
      questionText: text,
      questionType: type,
      points: parseInt(points, 10),
      displayOrder: parseInt(order, 10),
      options: type === 'TRUE_FALSE' ? [
        { optionText: 'True', displayOrder: 1, isCorrect: options[0]?.isCorrect ?? true },
        { optionText: 'False', displayOrder: 2, isCorrect: !(options[0]?.isCorrect ?? true) }
      ] : options
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
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">Question Text</label>
        <textarea required rows={2} value={text} onChange={e => setText(e.target.value)} className="border border-midnight-ink p-2" />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/3">
          <label className="font-bold text-sm">Type</label>
          <select value={type} onChange={e => setType(e.target.value as QuestionType)} className="border border-midnight-ink p-2 appearance-none">
            <option value="MCQ_SINGLE">Single Choice</option>
            <option value="MULTI_SELECT">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-1/3">
          <label className="font-bold text-sm">Points</label>
          <input type="number" required min="1" value={points} onChange={e => setPoints(e.target.value)} className="border border-midnight-ink p-2" />
        </div>
        <div className="flex flex-col gap-2 w-1/3">
          <label className="font-bold text-sm">Order</label>
          <input type="number" required min="1" value={order} onChange={e => setOrder(e.target.value)} className="border border-midnight-ink p-2" />
        </div>
      </div>

      <div className="mt-4">
        <label className="font-bold text-sm mb-2 block">Options</label>
        {type === 'TRUE_FALSE' ? (
          <div className="flex gap-4 border border-midnight-ink p-4 bg-black/5">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input type="radio" name="tf" checked={options[0]?.isCorrect ?? true} onChange={() => setOptions([{optionText: 'True', displayOrder: 1, isCorrect: true}])} />
              True is Correct
            </label>
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input type="radio" name="tf" checked={!(options[0]?.isCorrect ?? true)} onChange={() => setOptions([{optionText: 'True', displayOrder: 1, isCorrect: false}])} />
              False is Correct
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input 
                  type={type === 'MCQ_SINGLE' ? 'radio' : 'checkbox'} 
                  name={`correct-${existingQuestion?.id || 'new'}`}
                  checked={opt.isCorrect}
                  onChange={e => updateOption(i, 'isCorrect', e.target.checked)}
                  className="w-5 h-5 accent-signal-blue"
                  title="Mark as correct answer"
                />
                <input 
                  type="text" 
                  required 
                  value={opt.optionText} 
                  onChange={e => updateOption(i, 'optionText', e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="border border-midnight-ink p-2 flex-grow"
                />
                <button type="button" onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-ember-red px-2 font-bold hover:underline text-sm">Remove</button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setOptions([...options, { optionText: '', displayOrder: options.length + 1, isCorrect: false }])}
              className="self-start text-signal-blue font-bold text-sm hover:underline mt-2"
            >
              + Add Option
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-midnight-ink mt-2">
        <PillButton type="button" onClick={onCancel} className="bg-transparent hover:bg-black/10 !py-1 !px-4">Cancel</PillButton>
        <PillButton type="submit" disabled={addQ.isPending || updateQ.isPending} className="!py-1 !px-4">Save Question</PillButton>
      </div>
    </form>
  );
}
