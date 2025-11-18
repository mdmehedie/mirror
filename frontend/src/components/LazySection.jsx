import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

/**
 * Lazy loading wrapper for sections
 * Improves initial page load performance
 */
export function LazySection({ loader, fallback = <SectionLoader />, ...props }) {
  const Component = lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Loading skeleton for sections
 */
function SectionLoader() {
  return (
    <div className="py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-16 space-y-4">
            <motion.div
              className="h-12 bg-secondary rounded-lg w-1/3 mx-auto"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-6 bg-secondary rounded-lg w-1/2 mx-auto"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>

          {/* Content skeleton */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-64 bg-secondary rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LazySection;
