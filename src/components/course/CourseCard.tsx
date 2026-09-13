import { Link } from 'react-router-dom';
import { BodyText } from '../ui/Typography';

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
}

export function CourseCard({ id, title, description, difficulty, price, thumbnailUrl, instructorName, rating, studentCount }: CourseCardProps) {
  return (
    <Link to={`/courses/${id}`} className="group flex flex-col border border-midnight-ink bg-cream-paper hover:bg-midnight-ink hover:text-cream-paper transition-colors duration-300 w-full h-full min-h-[400px]">
      {/* Thumbnail Placeholder - Bauhaus Style */}
      <div className="h-40 sm:h-48 w-full border-b border-midnight-ink bg-saffron-yellow flex items-center justify-center overflow-hidden shrink-0">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-ember-red transition-transform group-hover:scale-110 duration-500"></div>
        )}
      </div>

      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 border border-current rounded-full shrink-0">
            {difficulty}
          </span>
          <span className="font-degular-display text-lg sm:text-xl font-bold shrink-0">
            {price !== null && price !== undefined ? (price === 0 ? 'Free' : `$${price.toFixed(2)}`) : 'Price TBD'}
          </span>
        </div>

        <h3 className="font-degular-display text-xl sm:text-2xl font-bold mb-3 break-words line-clamp-2">
          {title}
        </h3>
        
        <BodyText className="mb-6 line-clamp-2 opacity-80 group-hover:opacity-100 text-sm sm:text-base">
          {description}
        </BodyText>

        <div className="mt-auto pt-6 border-t border-midnight-ink group-hover:border-cream-paper flex flex-col xl:flex-row xl:justify-between xl:items-center gap-2 xl:gap-0 text-xs sm:text-sm font-bold">
          <span className="truncate w-full xl:w-auto">{instructorName || 'Instructor'}</span>
          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            <span>{rating !== null && rating !== undefined ? `★ ${rating.toFixed(1)}` : 'New'}</span>
            <span>{studentCount !== null && studentCount !== undefined ? `${studentCount} students` : '0 students'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
