import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { TimelineProvider } from './context/TimelineContext';
import ExplorePage from './pages/ExplorePage';
import OnboardingPage from './pages/OnboardingPage';
import SharePage from './pages/SharePage';
import StudioPage from './pages/StudioPage';
import './App.css';

function HomeRedirect() {
  const { onboardingComplete } = useSettings();
  return (
    <Navigate to={onboardingComplete ? '/studio' : '/onboarding'} replace />
  );
}

function AppRoutes() {
  return (
    <TimelineProvider>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </TimelineProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
