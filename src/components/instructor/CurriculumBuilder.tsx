import React, { useState } from 'react';
import type { SectionCurriculumResponse } from '../../features/instructor/types';
import { PillButton } from '../ui/Button';
import { useCreateSection } from '../../features/instructor/queries';
import { SectionEditor } from './SectionEditor';

interface Props {
  courseId: string;
  sections: SectionCurriculumResponse[];
  isEditable: boolean;
}

export function CurriculumBuilder({ courseId, sections, isEditable }: Props) {
  const createSection = useCreateSection(courseId);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createSection.mutate(
      { title: newTitle, displayOrder: sections.length },
      {
        onSuccess: () => {
          setNewTitle('');
          setIsAdding(false);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="flex justify-between items-center bg-cream-paper border border-midnight-ink p-4">
        <h3 className="font-bold text-lg">Curriculum Overview</h3>
        <div className="text-sm">
          <span className="font-bold">{sections.length}</span> Sections
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((sectionData, index) => (
          <SectionEditor 
            key={sectionData.section.id} 
            courseId={courseId} 
            sectionData={sectionData} 
            isEditable={isEditable}
            index={index}
          />
        ))}

        {sections.length === 0 && !isAdding && (
          <div className="p-8 border-2 border-dashed border-midnight-ink flex flex-col items-center justify-center text-center gap-4 bg-white/50">
            <span className="font-bold text-lg">No curriculum yet</span>
            <span className="text-sm text-gray-600">Start building your course by adding your first section.</span>
            {isEditable && (
              <PillButton onClick={() => setIsAdding(true)}>+ Add Section</PillButton>
            )}
          </div>
        )}
      </div>

      {isAdding && isEditable && (
        <form onSubmit={handleAddSection} className="border border-midnight-ink p-4 flex flex-col gap-4 bg-white">
          <h4 className="font-bold text-sm uppercase">New Section</h4>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Enter a title (e.g., Introduction)"
            className="border border-midnight-ink px-4 py-2 focus:outline-none focus:ring-1 focus:ring-signal-blue w-full bg-transparent"
            autoFocus
          />
          <div className="flex gap-2">
            <PillButton type="button" onClick={() => setIsAdding(false)} className="bg-transparent hover:bg-black/10 !py-1 !text-sm">Cancel</PillButton>
            <PillButton type="submit" disabled={createSection.isPending} className="!py-1 !text-sm">
              {createSection.isPending ? 'Saving...' : 'Save Section'}
            </PillButton>
          </div>
        </form>
      )}

      {!isAdding && sections.length > 0 && isEditable && (
        <button 
          onClick={() => setIsAdding(true)}
          className="border border-midnight-ink border-dashed p-4 font-bold text-sm hover:bg-black/5 hover:border-solid transition-all text-left flex items-center gap-2 w-full"
        >
          <span className="text-xl leading-none">+</span> Add New Section
        </button>
      )}
    </div>
  );
}
