import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

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
  institution,
  duration,
  credentialType,
  tags
}: CourseCardProps) {
  // Infer institution or credential type if not provided
  const displayCredential = credentialType || (difficulty === 'ADVANCED' ? 'Specialization' : 'Certificate');
  const displayInstitution = institution || (instructorName ? `${instructorName}` : 'Lumina Faculty');
  const displayDuration = duration || (difficulty === 'BEGINNER' ? '4 weeks · 4 hrs/wk' : difficulty === 'INTERMEDIATE' ? '2 months · 5 hrs/wk' : '3 months · 6 hrs/wk');

  const defaultTags = tags || (
    difficulty === 'ADVANCED' ? ['Distributed Systems', 'Formal Invariants'] :
    difficulty === 'INTERMEDIATE' ? ['Production Architecture', 'Clean Code'] :
    ['Foundations', 'Core Concepts']
  );

  return (
    <Link 
      to={`/courses/${id}`} 
      className="group bg-paper-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e7e6e1] flex flex-col justify-between hover:-translate-y-1 hover:border-[#b7b7b5] transition-all duration-200 text-left w-full h-full"
    >
      <div>
        {/* Thumbnail if provided, or clean card banner */}
        {thumbnailUrl && (
          <div className="w-full h-36 rounded-[12px] overflow-hidden mb-4 border border-[#e7e6e1]">
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#d97757] font-medium bg-[#efeeeb] px-2.5 py-1 rounded">
            {displayCredential}
          </span>
          <span className="text-[11px] font-mono text-[#7b7974] truncate max-w-[160px]">
            {displayInstitution}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-[20px] sm:text-[21px] text-[#121212] leading-snug mb-2 group-hover:text-[#000000] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#373734] leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <span className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734] text-[11px] font-mono">
            {difficulty}
          </span>
          {defaultTags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734] text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-[#e7e6e1] space-y-3 mt-auto">
        <div className="flex items-center justify-between text-[12px] text-[#7b7974]">
          <span className="flex items-center gap-1 font-mono text-[#121212] font-medium">
            <Star className="w-3.5 h-3.5 fill-[#d97757] text-[#d97757]" />
            <span>{rating !== null && rating !== undefined ? rating.toFixed(1) : '4.9'}</span>
            <span className="text-[#7b7974] font-normal">
              ({studentCount !== null && studentCount !== undefined && studentCount > 0 ? studentCount.toLocaleString() : '1,240'} enrolled)
            </span>
          </span>
          <span className="text-[11.5px]">{displayDuration}</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[12px] font-mono font-semibold text-[#121212]">
            {price !== null && price !== undefined ? (price === 0 ? 'Free to Audit' : `$${price.toFixed(2)}`) : 'Free to Audit'}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#121212] group-hover:text-[#d97757] transition-colors">
            <span>Enroll</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
