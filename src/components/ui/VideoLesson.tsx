import { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { PillButton } from './Button';
import { SectionHeading } from './Typography';
import { LoadingState, ErrorState } from './States';

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
  const progressInterval = useRef<number | undefined>(undefined);

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
        
        // Response data is the blob because of our interceptor
        const blob = response as unknown as Blob;
        
        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideo();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (progressInterval.current) clearInterval(progressInterval.current);
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

  if (loading) return <LoadingState message="Loading video lesson..." />;
  if (error || !videoUrl) return <ErrorState title="Video Unavailable" message="We couldn't load the media for this lesson." />;

  return (
    <div className="flex flex-col gap-6 w-full">
      <SectionHeading className="text-2xl sm:text-3xl">{title}</SectionHeading>
      <div className="aspect-video bg-midnight-ink relative border border-midnight-ink overflow-hidden">
        <video 
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-end">
        <PillButton onClick={onComplete}>Mark as Completed</PillButton>
      </div>
    </div>
  );
}
