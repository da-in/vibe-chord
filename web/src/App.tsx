import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StudioPage from './pages/StudioPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/" element={<Navigate to="/studio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
