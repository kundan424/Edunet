import React, { useRef, useState } from 'react';
import { useUploadMedia, useDeleteMedia } from '../../features/instructor/queries';
import { UploadCloud, CheckCircle, Trash2, RefreshCw, FileText, Video } from 'lucide-react';

interface Props {
  courseId: string;
  lessonId: string;
  hasMedia: boolean;
  isResource?: boolean;
}

export function MediaUploader({ courseId, lessonId, hasMedia, isResource }: Props) {
  const uploadMedia = useUploadMedia(courseId);
  const deleteMedia = useDeleteMedia(courseId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!isResource && !file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WebM, MOV).');
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
    const itemType = isResource ? 'resource attachment' : 'video media';
    if (window.confirm(`Are you sure you want to remove the ${itemType} from this lesson?`)) {
      deleteMedia.mutate(lessonId);
    }
  };

  const acceptType = isResource ? '*/*' : 'video/*';

  if (hasMedia) {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#e7e6e1] bg-[#efeeeb]/70 transition-all">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#4b7a47] shrink-0 shadow-xs">
            {isResource ? <FileText className="w-4 h-4 text-[#121212]" /> : <Video className="w-4 h-4 text-[#121212]" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#121212] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#4b7a47]" />
              <span>{isResource ? 'Document / Code Attachment Ready' : 'Video Asset Attached & Transcoded'}</span>
            </span>
            <span className="text-[11px] font-mono text-[#7b7974]">
              {isResource ? 'Available for learner download in studio' : '1080p adaptive bitrate ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="px-3 py-1 rounded-lg bg-[#ffffff] hover:bg-[#e7e6e1] text-[#121212] font-body text-xs font-medium border border-[#e7e6e1] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={uploadMedia.isPending || deleteMedia.isPending}
          >
            {uploadMedia.isPending ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Replace File</span>
            )}
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={deleteMedia.isPending}
            className="p-1.5 rounded-lg text-[#9c9a92] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer disabled:opacity-50"
            title="Remove file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <input 
          ref={fileInputRef} 
          type="file" 
          accept={acceptType} 
          className="hidden" 
          onChange={handleChange} 
        />
      </div>
    );
  }

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center text-center gap-2.5 transition-all
        ${dragActive ? 'border-[#121212] bg-[#efeeeb]' : 'border-[#e7e6e1] bg-[#f8f8f6]/80 hover:bg-[#f8f8f6]'}
      `}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={onDrop}
    >
      <input 
        ref={fileInputRef} 
        type="file" 
        accept={acceptType} 
        className="hidden" 
        onChange={handleChange} 
      />
      
      {uploadMedia.isPending ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="w-5 h-5 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#121212]">
            Uploading {isResource ? 'resource archive' : 'video master'}... Please wait.
          </span>
          <span className="text-[10px] font-mono text-[#7b7974]">Transcoding &amp; hashing content</span>
        </div>
      ) : (
        <>
          <div className="w-9 h-9 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#7b7974] shadow-xs">
            <UploadCloud className="w-4 h-4 text-[#121212]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-[#121212]">
              Drag and drop {isResource ? 'lecture notes, slides, or code' : 'lecture video file'} here
            </span>
            <span className="text-[11px] font-mono text-[#7b7974]">
              {isResource ? 'PDF, ZIP, RS, PY, MD up to 500MB' : 'MP4, MOV, WebM, MKV up to 2GB (1080p)'}
            </span>
          </div>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#121212] hover:bg-black text-[#f8f8f6] font-body text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            Select from Device
          </button>
        </>
      )}

      {uploadMedia.isError && (
        <span className="text-[11px] text-[#ba1a1a] font-medium mt-1">
          Upload failed: {(uploadMedia.error as any)?.message || 'Check network connection and file format.'}
        </span>
      )}
    </div>
  );
}
