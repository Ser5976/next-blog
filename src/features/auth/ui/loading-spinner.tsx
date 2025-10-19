export const LoadingSpinner = () => (
  <div
    className="flex justify-center items-center"
    role="status"
    aria-live="polite"
    aria-label="Loading content"
  >
    <div
      className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      aria-hidden="true"
    />
  </div>
);
