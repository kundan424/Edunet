import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export const InstructorNav = () => {
  const links = [
    { to: '/instructor', label: 'Dashboard', end: true },
    { to: '/instructor/courses', label: 'My Courses' }
  ];

  return (
    <nav className="flex items-center gap-2 border-b border-rule mb-8 overflow-x-auto text-xs font-mono">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => clsx(
            'px-4 py-2.5 transition-colors border-b-2 whitespace-nowrap cursor-pointer',
            isActive 
              ? 'border-ember text-ember font-medium' 
              : 'border-transparent text-muted hover:text-foreground'
          )}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};
