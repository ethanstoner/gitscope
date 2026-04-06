export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#58a6ff]/20 border-t-[#58a6ff]" />
    </div>
  );
}
