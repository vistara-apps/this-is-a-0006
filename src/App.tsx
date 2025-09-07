import React, { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProblemSolutionGenerator } from './components/ProblemSolutionGenerator';
import { PersonaBuilder } from './components/PersonaBuilder';
import { LeanCanvasBuilder } from './components/LeanCanvasBuilder';
import { PitchDeckGenerator } from './components/PitchDeckGenerator';
import { PricingPage } from './components/PricingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

type View = 'landing' | 'dashboard' | 'problem-solution' | 'persona' | 'lean-canvas' | 'pitch-deck' | 'pricing';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');

  useEffect(() => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  }, [user]);

  if (!user && currentView !== 'landing') {
    return <LandingPage onNavigate={setCurrentView} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'problem-solution':
        return <ProblemSolutionGenerator onNavigate={setCurrentView} />;
      case 'persona':
        return <PersonaBuilder onNavigate={setCurrentView} />;
      case 'lean-canvas':
        return <LeanCanvasBuilder onNavigate={setCurrentView} />;
      case 'pitch-deck':
        return <PitchDeckGenerator onNavigate={setCurrentView} />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentView} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppShell currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </AppShell>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
