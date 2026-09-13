import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { useCourseCurriculum, useUpdateCourse, useSubmitCourse } from '../../features/instructor/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { CourseStatusBadge } from '../../components/instructor/CourseStatusBadge';
import { CurriculumBuilder } from '../../components/instructor/CurriculumBuilder';
import type { CourseDifficulty } from '../../features/courses/types';

export function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: curriculum, isLoading, error } = useCourseCurriculum(courseId!);
  const updateCourse = useUpdateCourse(courseId!);
  const submitCourse = useSubmitCourse(courseId!);
  
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for basic info
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'BEGINNER' as CourseDifficulty,
    price: '',
  });

  useEffect(() => {
    if (curriculum?.course) {
      setFormData({
        title: curriculum.course.title || '',
        description: curriculum.course.description || '',
        category: curriculum.course.category || '',
        difficulty: curriculum.course.difficulty || 'BEGINNER',
        price: curriculum.course.price !== null ? curriculum.course.price.toString() : '',
      });
    }
  }, [curriculum]);

  if (isLoading) return <LoadingState message="Loading course editor..." />;
  if (error || !curriculum) return <ErrorState message="Failed to load course details." />;

  const course = curriculum.course;
  const isEditable = course.publishStatus === 'DRAFT' || course.publishStatus === 'PENDING_APPROVAL'; // Let backend decide true limits, but UI-wise these are usually editable.

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    updateCourse.mutate(
      {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        price: formData.price ? parseFloat(formData.price) : undefined,
      },
      {
        onSuccess: () => setSaveSuccess(true),
      }
    );
  };

  const handleSubmitCourse = () => {
    if (window.confirm('Are you sure you want to submit this course for approval? Once submitted, it will be reviewed by an administrator.')) {
      submitCourse.mutate();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-midnight-ink">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <SectionHeading>{course.title}</SectionHeading>
            <CourseStatusBadge status={course.publishStatus} />
          </div>
          <BodyText className="text-sm">Created: {new Date(course.createdAt).toLocaleDateString()}</BodyText>
        </div>
        
        <div className="flex gap-2">
          <PillButton onClick={() => navigate('/instructor/courses')} className="bg-transparent hover:bg-black/10">Back</PillButton>
          {course.publishStatus === 'DRAFT' && (
            <PillButton onClick={handleSubmitCourse} disabled={submitCourse.isPending} className="bg-saffron-yellow text-midnight-ink hover:bg-midnight-ink hover:text-saffron-yellow">
              {submitCourse.isPending ? 'Submitting...' : 'Submit for Approval'}
            </PillButton>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b border-midnight-ink overflow-x-auto">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-4 ${activeTab === 'info' ? 'border-signal-blue text-signal-blue' : 'border-transparent hover:text-signal-blue'}`}
        >
          Basic Information
        </button>
        <button 
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-4 ${activeTab === 'curriculum' ? 'border-signal-blue text-signal-blue' : 'border-transparent hover:text-signal-blue'}`}
        >
          Curriculum Builder
        </button>
      </div>

      <div className="py-4">
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="flex flex-col gap-6 max-w-3xl">
            {saveSuccess && (
              <div className="bg-signal-blue text-cream-paper p-4 font-bold">
                Course information saved successfully.
              </div>
            )}
            
            {updateCourse.isError && (
              <div className="bg-ember-red text-cream-paper p-4 font-bold">
                Failed to save course. {(updateCourse.error as any)?.message}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Course Title *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                disabled={!isEditable}
                className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue disabled:opacity-50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                disabled={!isEditable}
                className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue min-h-[160px] resize-y disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Category</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  disabled={!isEditable}
                  className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue disabled:opacity-50"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value as CourseDifficulty})}
                  disabled={!isEditable}
                  className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue appearance-none rounded-none disabled:opacity-50"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Price (USD)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                disabled={!isEditable}
                className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue disabled:opacity-50"
              />
            </div>

            {isEditable && (
              <div className="pt-4 border-t border-midnight-ink">
                <PillButton type="submit" disabled={updateCourse.isPending}>
                  {updateCourse.isPending ? 'Saving...' : 'Save Changes'}
                </PillButton>
              </div>
            )}
          </form>
        )}

        {activeTab === 'curriculum' && (
          <CurriculumBuilder 
            courseId={course.id} 
            sections={curriculum.sections} 
            isEditable={isEditable}
          />
        )}
      </div>
    </div>
  );
}
