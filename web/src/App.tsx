import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TimelineProvider } from './context/TimelineContext';
import ExplorePage from './pages/ExplorePage';
import StudioPage from './pages/StudioPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <TimelineProvider>
        <Routes>
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/" element={<Navigate to="/studio" replace />} />
        </Routes>
      </TimelineProvider>
    </BrowserRouter>
  );
}

export default App;
