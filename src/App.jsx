import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import AnalyzerPage from './pages/AnalyzerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/app" element={<AnalyzerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
