import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { 
  useInstructorAssignment, 
  useCreateAssignment, 
  useUpdateAssignment,
  useSubmissions,
  useGradeSubmission
} from '../../features/assignment/queries';

export function AssignmentEditor() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { data: assignment, isLoading, error } = useInstructorAssignment(courseId!, lessonId!);
  const createAssignment = useCreateAssignment(courseId!, lessonId!);
  const updateAssignment = useUpdateAssignment(courseId!, lessonId!);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    maxScore: '100',
    dueAt: '',
  });

  const isNew = !assignment && error?.message?.includes('404');
  const [activeTab, setActiveTab] = useState<'editor' | 'submissions'>('editor');

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        instructions: assignment.instructions,
        maxScore: assignment.maxScore.toString(),
        dueAt: assignment.dueAt ? new Date(assignment.dueAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [assignment]);

  if (isLoading) return <LoadingState message="Loading assignment..." />;
  if (error && !isNew) return <ErrorState message="Failed to load assignment details." onRetry={() => window.location.reload()} />;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      instructions: formData.instructions,
      maxScore: parseInt(formData.maxScore, 10),
      dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : undefined,
    };

    if (isNew) {
      createAssignment.mutate(payload);
    } else {
      updateAssignment.mutate(payload);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-midnight-ink">
        <div className="flex items-center gap-4">
          <PillButton onClick={() => navigate(`/instructor/courses/${courseId}`)} className="bg-transparent hover:bg-black/10 !py-2 !px-4">
            ← Back to Course
          </PillButton>
          <SectionHeading>{isNew ? 'Create Assignment' : 'Edit Assignment'}</SectionHeading>
        </div>
      </div>
      
      {!isNew && (
        <div className="flex border-b border-midnight-ink mb-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 font-bold border-b-4 transition-colors ${activeTab === 'editor' ? 'border-signal-blue text-midnight-ink' : 'border-transparent text-gray-500 hover:text-midnight-ink'}`}
          >
            Assignment Details
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 font-bold border-b-4 transition-colors ${activeTab === 'submissions' ? 'border-signal-blue text-midnight-ink' : 'border-transparent text-gray-500 hover:text-midnight-ink'}`}
          >
            Submissions
          </button>
        </div>
      )}

      {activeTab === 'editor' && (
        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl bg-white border border-midnight-ink p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-midnight-ink">Assignment Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              placeholder="e.g., Final Project Proposal"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-midnight-ink">Instructions</label>
            <textarea
              required
              rows={5}
              value={formData.instructions}
              onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              placeholder="Describe what the student needs to submit..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-midnight-ink">Maximum Score</label>
              <input
                type="number"
                required
                min={1}
                value={formData.maxScore}
                onChange={e => setFormData(prev => ({ ...prev, maxScore: e.target.value }))}
                className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-midnight-ink">Due Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.dueAt}
                onChange={e => setFormData(prev => ({ ...prev, dueAt: e.target.value }))}
                className="border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-midnight-ink">
            <PillButton type="submit" disabled={createAssignment.isPending || updateAssignment.isPending}>
              {createAssignment.isPending || updateAssignment.isPending ? 'Saving...' : 'Save Assignment'}
            </PillButton>
          </div>
        </form>
      )}

      {activeTab === 'submissions' && assignment && (
        <SubmissionGrader courseId={courseId!} assignmentId={assignment.id} />
      )}
    </div>
  );
}

function SubmissionGrader({ courseId, assignmentId }: { courseId: string, assignmentId: string }) {
  const { data: submissions, isLoading, error } = useSubmissions(courseId, assignmentId);

  // Hook isn't dynamic enough if it takes submissionId on creation. We'll handle it inside the grade action.
  
  if (isLoading) return <LoadingState message="Loading submissions..." />;
  if (error) return <ErrorState message="Failed to load submissions." />;
  if (!submissions || submissions.length === 0) return <EmptyState title="No Submissions" message="Students haven't submitted anything yet." />;

  return (
    <div className="flex flex-col gap-6">
      {submissions.map(sub => (
        <SubmissionRow key={sub.id} courseId={courseId} assignmentId={assignmentId} submission={sub} />
      ))}
    </div>
  );
}

function SubmissionRow({ courseId, assignmentId, submission }: { courseId: string, assignmentId: string, submission: any }) {
  const [isGrading, setIsGrading] = useState(false);
  const [score, setScore] = useState(submission.score?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  
  const gradeSub = useGradeSubmission(courseId, assignmentId, submission.id);

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    gradeSub.mutate({
      score: parseInt(score, 10),
      feedback: feedback
    }, {
      onSuccess: () => setIsGrading(false)
    });
  };

  return (
    <div className="border border-midnight-ink bg-white flex flex-col">
      <div className="p-4 border-b border-midnight-ink flex justify-between items-center bg-black/5">
        <div>
          <h4 className="font-bold">{submission.studentName}</h4>
          <p className="text-sm text-gray-600">Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-bold border border-midnight-ink ${submission.status === 'GRADED' ? 'bg-signal-blue text-white' : 'bg-saffron-yellow'}`}>
            {submission.status}
          </span>
          {submission.status === 'GRADED' && <span className="font-bold">{submission.score} pts</span>}
        </div>
      </div>
      
      <div className="p-4">
        <h5 className="text-xs font-bold uppercase mb-2">Submission Content</h5>
        <div className="p-4 bg-cream-paper border border-midnight-ink min-h-[100px] whitespace-pre-wrap">
          {submission.submissionText}
        </div>
      </div>

      <div className="p-4 border-t border-midnight-ink bg-black/5 flex justify-end">
        {!isGrading ? (
          <PillButton onClick={() => setIsGrading(true)} className="!py-2 !text-sm">
            {submission.status === 'GRADED' ? 'Update Grade' : 'Grade Submission'}
          </PillButton>
        ) : (
          <form onSubmit={handleGrade} className="w-full flex flex-col gap-4 bg-white p-4 border border-midnight-ink">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/4">
                <label className="font-bold text-sm">Score</label>
                <input 
                  type="number" 
                  min="0"
                  required 
                  value={score} 
                  onChange={e => setScore(e.target.value)} 
                  className="border border-midnight-ink p-2 w-full focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <label className="font-bold text-sm">Feedback</label>
                <input 
                  type="text" 
                  value={feedback} 
                  onChange={e => setFeedback(e.target.value)} 
                  className="border border-midnight-ink p-2 w-full focus:outline-none"
                  placeholder="Great job..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <PillButton type="button" onClick={() => setIsGrading(false)} className="bg-transparent hover:bg-black/10 !py-1 !text-sm">Cancel</PillButton>
              <PillButton type="submit" disabled={gradeSub.isPending} className="!py-1 !text-sm">Save Grade</PillButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
