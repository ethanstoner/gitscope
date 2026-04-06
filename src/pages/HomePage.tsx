import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col px-4">
      <h1 className="font-display text-6xl sm:text-7xl font-bold mb-3 text-[#E6EDF3]">
        GitScope<span className="text-[#58A6FF]">.</span>
      </h1>
      <p className="font-mono text-[#8B949E] text-sm tracking-wide mb-10">
        Analyze any GitHub profile
      </p>
      <SearchBar />
    </div>
  );
}
