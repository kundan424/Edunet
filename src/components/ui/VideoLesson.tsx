import { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { LoadingState, ErrorState } from './States';
import { CheckCircle2, Play, ShieldCheck } from 'lucide-react';

interface VideoLessonProps {
  courseId: string;
  lessonId: string;
  title: string;
  onComplete: () => void;
  onProgress?: (positionSeconds: number) => void;
}

export function VideoLesson({ courseId, lessonId, title, onComplete, onProgress }: VideoLessonProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    const fetchVideo = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/api/v1/courses/${courseId}/lessons/${lessonId}/media`, {
          responseType: 'blob'
        });
        
        const blob = response as unknown as Blob;
        
        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
        }
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideo();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [courseId, lessonId]);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const handleTimeUpdate = () => {
      if (videoRef.current && onProgress && Math.floor(videoRef.current.currentTime) % 10 === 0) {
        onProgress(Math.floor(videoRef.current.currentTime));
      }
    };

    const handleEnded = () => {
      onComplete();
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete, videoUrl]);

  if (loading) return <LoadingState message="Loading video lecture stream..." />;
  if (error || !videoUrl) return <ErrorState title="Video Unavailable" message="We couldn't load the recorded lecture stream for this module." />;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Lecture Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-[#e7e6e1]">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold">
          <Play className="w-3.5 h-3.5 fill-[#d97757]" />
          <span>Faculty Video Lecture</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold leading-snug">
          {title}
        </h2>
      </div>

      {/* Video Container */}
      <div className="aspect-video bg-[#121212] rounded-2xl relative border border-[#e7e6e1] overflow-hidden shadow-sm flex items-center justify-center">
        <video 
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Video Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#7b7974] font-mono">
          <ShieldCheck className="w-4 h-4 text-[#3c8254]" />
          <span>Lecture progress auto-syncs to your syllabus transcript</span>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer self-end sm:self-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3c8254]" />
          <span>Mark as Completed</span>
        </button>
      </div>

    </div>
  );
}
