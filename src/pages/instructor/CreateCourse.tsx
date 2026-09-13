import React, { useState } from 'react';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { useCreateCourse } from '../../features/instructor/queries';
import { useNavigate } from 'react-router-dom';
import type { CourseDifficulty } from '../../features/courses/types';

export function CreateCourse() {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'BEGINNER' as CourseDifficulty,
    price: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    createCourse.mutate(
      {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        price: formData.price ? parseFloat(formData.price) : undefined,
      },
      {
        onSuccess: (data) => {
          navigate(`/instructor/courses/${data.id}`);
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to create course');
        }
      }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <SectionHeading>Create a New Course</SectionHeading>
        <BodyText>Start by giving your course a title and basic information. You can edit all of this later.</BodyText>
      </div>

      {error && (
        <div className="bg-ember-red text-cream-paper p-4 font-bold border border-midnight-ink">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">Course Title *</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
            placeholder="e.g., Introduction to Bauhaus Design"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue min-h-[120px] resize-y"
            placeholder="What is this course about?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Category</label>
            <input 
              type="text" 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
              placeholder="e.g., Design, Programming"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Difficulty</label>
            <select 
              value={formData.difficulty}
              onChange={e => setFormData({...formData, difficulty: e.target.value as CourseDifficulty})}
              className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue appearance-none rounded-none"
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
            className="border border-midnight-ink bg-transparent px-4 py-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
            placeholder="Leave blank for Free"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-midnight-ink">
          <PillButton type="button" onClick={() => navigate(-1)} className="bg-transparent hover:bg-black/10">
            Cancel
          </PillButton>
          <PillButton type="submit" disabled={createCourse.isPending}>
            {createCourse.isPending ? 'Creating...' : 'Create Course'}
          </PillButton>
        </div>
      </form>
    </div>
  );
}
