import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col px-4">
      <h1 className="font-display text-6xl sm:text-7xl font-bold mb-3 bg-gradient-to-r from-[#58A6FF] via-[#4C94E8] to-[#3FB950] bg-clip-text text-transparent">
        GitScope
      </h1>
      <p className="font-mono text-[#8B949E] text-sm tracking-wide mb-10">
        Analyze any GitHub profile
      </p>
      <div className="w-full flex justify-center">
        <div className="w-12 h-px bg-[#58A6FF]/30 mb-8" />
      </div>
      <SearchBar />
    </div>
  );
}
