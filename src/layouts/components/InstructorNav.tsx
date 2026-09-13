import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export const InstructorNav = () => {
  const links = [
    { to: '/instructor', label: 'Dashboard', end: true },
    { to: '/instructor/courses', label: 'My Courses' }
  ];

  return (
    <nav className="flex items-center gap-4 border-b border-midnight-ink mb-8 overflow-x-auto pb-[-1px]">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => clsx(
            'px-4 py-3 font-bold text-sm transition-colors border-b-4 whitespace-nowrap',
            isActive 
              ? 'border-signal-blue text-signal-blue' 
              : 'border-transparent hover:text-signal-blue'
          )}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};
