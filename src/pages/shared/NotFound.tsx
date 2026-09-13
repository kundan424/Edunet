import { EmptyState } from '../../components/ui/States';

export function NotFound() {
  return (
    <div className="py-24">
      <EmptyState title="404 - Page Not Found" message="The page you are looking for does not exist or has been moved." />
    </div>
  );
}
