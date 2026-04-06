import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center flex-col px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#e6edf3] mb-2">
          GitScope
        </h1>
        <p className="text-[#8b949e] text-sm">
          Explore any GitHub profile in depth
        </p>
      </div>
      <SearchBar />
    </div>
  );
}
