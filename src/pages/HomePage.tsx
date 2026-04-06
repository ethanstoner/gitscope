import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col px-4">
      <h1 className="font-display text-6xl sm:text-7xl font-bold mb-3 bg-gradient-to-r from-[#F0B429] via-[#E0A420] to-[#5CE0D8] bg-clip-text text-transparent">
        GitScope
      </h1>
      <p className="font-mono text-[#7A7D85] text-sm tracking-wide mb-10">
        Analyze any GitHub profile
      </p>
      <div className="w-full flex justify-center">
        <div className="w-12 h-px bg-[#F0B429]/30 mb-8" />
      </div>
      <SearchBar />
    </div>
  );
}
