import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoadingSpinner from './components/shared/LoadingSpinner';

const UserPage = lazy(() => import('./pages/UserPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/user/:username" element={<UserPage />} />
              <Route path="/compare/:user1/:user2" element={<ComparePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
