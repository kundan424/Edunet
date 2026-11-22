import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, User } from 'lucide-react';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  price: number | null;
  thumbnailUrl?: string | null;
  instructorName?: string | null;
  rating?: number | null;
  studentCount?: number | null;
  institution?: string | null;
  duration?: string | null;
  credentialType?: string | null;
  tags?: string[];
  category?: string | null;
}

function resolveCourseCover(title: string, tags?: string[], providedUrl?: string | null): string {
  if (providedUrl && providedUrl.trim().length > 0 && !providedUrl.includes('placeholder')) {
    return providedUrl;
  }
  const text = `${title} ${(tags || []).join(' ')}`.toLowerCase();
  if (text.includes('ai') || text.includes('intelligence') || text.includes('machine learning') || text.includes('neural')) {
    return '/images/courses/ai-ml.jpg';
  }
  if (text.includes('security') || text.includes('cyber') || text.includes('crypto') || text.includes('penetration')) {
    return '/images/courses/security.jpg';
  }
  if (text.includes('cloud') || text.includes('devops') || text.includes('kubernetes') || text.includes('k8s') || text.includes('docker')) {
    return '/images/courses/cloud-devops.jpg';
  }
  if (text.includes('algorithm') || text.includes('data structure') || text.includes('complexity') || text.includes('python')) {
    return '/images/courses/algorithms.jpg';
  }
  if (text.includes('distributed') || text.includes('rust') || text.includes('system') || text.includes('kernel') || text.includes('consensus')) {
    return '/images/courses/systems.jpg';
  }
  return '/images/courses/web-dev.jpg';
}

export function CourseCard({ 
  id, 
  title, 
  description, 
  difficulty, 
  price, 
  thumbnailUrl, 
  instructorName, 
  rating, 
  studentCount,
  duration,
  credentialType,
  tags
}: CourseCardProps) {
  const displayCredential = credentialType || (difficulty === 'ADVANCED' ? 'Specialization' : 'Verified Certificate');
  const displayInstructor = instructorName || 'Edunet Faculty';
  const displayDuration = duration || (difficulty === 'BEGINNER' ? '4 weeks · Self-paced' : difficulty === 'INTERMEDIATE' ? '8 weeks · 5 hrs/wk' : '12 weeks · Masterclass');

  const defaultTags = tags || (
    difficulty === 'ADVANCED' ? ['Architecture', 'Advanced'] :
    difficulty === 'INTERMEDIATE' ? ['Full-Stack', 'Practical'] :
    ['Foundations', 'Introductory']
  );

  const coverImage = resolveCourseCover(title, defaultTags, thumbnailUrl);

  return (
    <Link 
      to={`/courses/${id}`} 
      className="group bg-card rounded-[10px] p-5 border border-rule hover:border-ember/50 shadow-none flex flex-col justify-between transition-colors duration-150 text-left w-full h-full"
    >
      <div>
        {/* Course Thumbnail Image */}
        <div className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden mb-4 bg-muted-surface border border-rule">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/courses/web-dev.jpg';
            }}
          />

          {/* Difficulty Pill Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-[0.05em] bg-black/80 text-white backdrop-blur-md border border-white/10">
              {difficulty}
            </span>
          </div>

          {/* Credential Badge Overlay */}
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-[0.05em] text-ember bg-black/85 backdrop-blur-md border border-ember/30">
              {displayCredential}
            </span>
          </div>
        </div>

        {/* Instructor Line */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-2 font-mono">
          <User className="w-3.5 h-3.5 text-ember" />
          <span className="truncate max-w-[200px]">{displayInstructor}</span>
        </div>

        {/* Course Title: Inter 500 */}
        <h3 className="font-sans text-[17px] font-medium leading-[1.3] text-foreground mb-2 group-hover:text-ember transition-colors line-clamp-2 tracking-[-0.015em]">
          {title}
        </h3>

        {/* Brief Description */}
        <p className="font-sans text-[13px] text-muted leading-[1.5] mb-4 line-clamp-2 font-normal">
          {description}
        </p>

        {/* Tags in Mono */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {defaultTags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded-none bg-wash border border-rule text-muted text-[10px] font-mono uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3.5 border-t border-rule space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted font-sans">
          <span className="flex items-center gap-1.5 font-normal text-foreground">
            <Star className="w-3.5 h-3.5 fill-ember text-ember" />
            <span className="font-medium">{rating !== null && rating !== undefined ? rating.toFixed(1) : '4.9'}</span>
            <span className="text-muted font-mono text-[11px]">
              ({studentCount !== null && studentCount !== undefined && studentCount > 0 ? studentCount.toLocaleString() : '1,420'})
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-muted">
            <Clock className="w-3 h-3 text-muted" />
            <span>{displayDuration}</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-[16px] font-medium text-foreground tracking-tight">
              {price !== null && price !== undefined ? (price === 0 ? 'Free to Audit' : `$${price.toFixed(2)}`) : 'Free to Audit'}
            </span>
          </div>

          <span className="h-8 px-3.5 rounded-none bg-wash group-hover:bg-ember border border-rule group-hover:border-ember text-foreground group-hover:text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors">
            <span>View Syllabus</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
