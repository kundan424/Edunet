import { Link, useLocation } from 'react-router-dom';

export function AdminNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/admin' && path === '/admin') return true;
    if (route !== '/admin' && path.startsWith(route)) return true;
    return false;
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Instructor Verification', path: '/admin/instructors' },
    { label: 'Course Moderation', path: '/admin/courses' },
  ];

  return (
    <nav className="flex gap-4 md:gap-8 border-b border-midnight-ink/20 pb-4 mb-8 overflow-x-auto">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`font-bold font-usual whitespace-nowrap pb-2 border-b-2 transition-colors ${
            isActive(item.path)
              ? 'border-midnight-ink text-midnight-ink'
              : 'border-transparent text-gray-400 hover:text-midnight-ink'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
