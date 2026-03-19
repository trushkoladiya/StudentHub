// Animated placeholder while content is loading
const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-5 shadow-soft border border-gray-100 
                     animate-pulse"
        >
          {/* Top row — avatar + lines */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded-full w-1/3" />
              <div className="h-2 bg-gray-100 rounded-full w-1/4" />
            </div>
          </div>
          {/* Content lines */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-full" />
            <div className="h-3 bg-gray-200 rounded-full w-4/5" />
            <div className="h-3 bg-gray-100 rounded-full w-2/3" />
          </div>
          {/* Bottom row */}
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-gray-100 rounded-full w-16" />
            <div className="h-6 bg-gray-100 rounded-full w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;