import { Suspense } from 'react';
import { ResourceDirectory } from '@/components/resources/ResourceDirectory';

export default function ResourcesPage() {
  return (
    <Suspense fallback={<ResourceDirectorySkeleton />}>
      <ResourceDirectory />
    </Suspense>
  );
}

function ResourceDirectorySkeleton() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom section-padding">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-secondary-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-secondary-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
