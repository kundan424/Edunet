import { useState } from 'react';

interface RatingDisplayProps {
  rating: number | null;
  count?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function RatingDisplay({ rating, count, size = 'md', showText = true }: RatingDisplayProps) {
  if (rating === null || rating === undefined) {
    return <span className="text-gray-500 italic text-sm">No ratings yet</span>;
  }

  const rounded = Math.round(rating * 10) / 10;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating)) {
      stars.push('★');
    } else {
      stars.push('☆');
    }
  }

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2">
      <div className={`text-saffron-yellow font-bold ${sizeClass} tracking-widest`}>
        {stars.join('')}
      </div>
      {showText && (
        <span className="font-bold text-midnight-ink">
          {rounded.toFixed(1)} {count !== undefined && <span className="text-gray-500 font-normal">({count})</span>}
        </span>
      )}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, disabled = false }: RatingInputProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className={`text-3xl focus:outline-none focus:ring-2 focus:ring-signal-blue rounded-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          aria-label={`Rate ${star} stars out of 5`}
        >
          <span className={(hover ?? value) >= star ? 'text-saffron-yellow' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
