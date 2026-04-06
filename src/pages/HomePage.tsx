import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">GitScope</h1>
      <p className="text-gray-500 mb-8">Analyze any GitHub profile</p>
      <SearchBar />
    </div>
  );
}
