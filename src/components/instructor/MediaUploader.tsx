import React, { useRef, useState } from 'react';
import { PillButton } from '../ui/Button';
import { useUploadMedia, useDeleteMedia } from '../../features/instructor/queries';

interface Props {
  courseId: string;
  lessonId: string;
  hasMedia: boolean;
}

export function MediaUploader({ courseId, lessonId, hasMedia }: Props) {
  const uploadMedia = useUploadMedia(courseId);
  const deleteMedia = useDeleteMedia(courseId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file.');
      return;
    }
    uploadMedia.mutate({ lessonId, file });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove the media for this lesson?')) {
      deleteMedia.mutate(lessonId);
    }
  };

  if (hasMedia) {
    return (
      <div className="flex items-center justify-between p-4 border border-midnight-ink bg-black/5">
        <span className="text-sm font-bold flex items-center gap-2">
          <span className="text-signal-blue">✓</span> Video Attached
        </span>
        <div className="flex gap-2">
          <PillButton 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-transparent hover:bg-black/10 !py-1 !text-xs"
            disabled={uploadMedia.isPending || deleteMedia.isPending}
          >
            {uploadMedia.isPending ? 'Uploading...' : 'Replace'}
          </PillButton>
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={deleteMedia.isPending}
            className="text-xs font-bold text-ember-red hover:underline px-2 disabled:opacity-50"
          >
            {deleteMedia.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="video/*" 
          className="hidden" 
          onChange={handleChange} 
        />
      </div>
    );
  }

  return (
    <div 
      className={`border-2 border-dashed p-6 flex flex-col items-center justify-center text-center gap-3 transition-colors
        ${dragActive ? 'border-signal-blue bg-signal-blue/5' : 'border-midnight-ink bg-white'}
      `}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={onDrop}
    >
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="video/*" 
        className="hidden" 
        onChange={handleChange} 
      />
      
      {uploadMedia.isPending ? (
        <span className="font-bold text-sm text-signal-blue animate-pulse">Uploading video... Please wait.</span>
      ) : (
        <>
          <span className="font-bold text-sm">Drag and drop a video file here</span>
          <span className="text-xs text-gray-500">MP4, WebM, or OGG up to 2GB</span>
          <PillButton 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="!py-1 !text-xs mt-2"
          >
            Browse Files
          </PillButton>
        </>
      )}

      {uploadMedia.isError && (
        <span className="text-xs text-ember-red font-bold mt-2">
          Upload failed: {(uploadMedia.error as any)?.message || 'Unknown error'}
        </span>
      )}
    </div>
  );
}
