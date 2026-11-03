import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCheck, ShieldCheck } from 'lucide-react';

export function AdminNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/admin' && path === '/admin') return true;
    if (route !== '/admin' && path.startsWith(route)) return true;
    return false;
  };

  const navItems = [
    { label: 'Senate Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Instructor Verification', path: '/admin/instructors', icon: UserCheck },
    { label: 'Course Moderation', path: '/admin/courses', icon: ShieldCheck },
  ];

  return (
    <nav className="flex items-center gap-2 border-b border-[#e7e6e1] pb-3 mb-6 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
              active
                ? 'bg-[#121212] text-[#ffffff] shadow-xs'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
