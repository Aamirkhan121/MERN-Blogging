// components/PostSkeleton.jsx
export default function PostSkeleton() {
  return (
    <div className="bg-white shadow rounded p-4 animate-pulse">
      <div className="h-40 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
