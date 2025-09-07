import React, { createContext, useContext, useState, useEffect } from 'react';

interface Persona {
  personaId: string;
  businessConceptId: string;
  name: string;
  demographics: string;
  painPoints: string[];
  motivations: string[];
  behaviors: string[];
}

interface LeanCanvasData {
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProposition: string;
  unfairAdvantage: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

interface PitchDeckSlide {
  title: string;
  content: string;
  slideType: 'problem' | 'solution' | 'market' | 'business-model' | 'team' | 'financial';
}

interface BusinessConcept {
  conceptId: string;
  userId: string;
  problemStatement: string;
  solutionStatement: string;
  targetPersonaDescription: string;
  leanCanvasData: LeanCanvasData | null;
  pitchDeckSlidesData: PitchDeckSlide[];
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  currentConcept: BusinessConcept | null;
  updateConcept: (updates: Partial<BusinessConcept>) => void;
  createNewConcept: (userId: string) => void;
  personas: Persona[];
  addPersona: (persona: Omit<Persona, 'personaId'>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentConcept, setCurrentConcept] = useState<BusinessConcept | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Load existing concept from localStorage
    const savedConcept = localStorage.getItem('conceptcraft_current_concept');
    if (savedConcept) {
      setCurrentConcept(JSON.parse(savedConcept));
    }

    const savedPersonas = localStorage.getItem('conceptcraft_personas');
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas));
    }

    const savedStep = localStorage.getItem('conceptcraft_current_step');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  const updateConcept = (updates: Partial<BusinessConcept>) => {
    if (!currentConcept) return;

    const updatedConcept = {
      ...currentConcept,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setCurrentConcept(updatedConcept);
    localStorage.setItem('conceptcraft_current_concept', JSON.stringify(updatedConcept));
  };

  const createNewConcept = (userId: string) => {
    const newConcept: BusinessConcept = {
      conceptId: Date.now().toString(),
      userId,
      problemStatement: '',
      solutionStatement: '',
      targetPersonaDescription: '',
      leanCanvasData: null,
      pitchDeckSlidesData: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentConcept(newConcept);
    localStorage.setItem('conceptcraft_current_concept', JSON.stringify(newConcept));
    setCurrentStep(0);
    localStorage.setItem('conceptcraft_current_step', '0');
  };

  const addPersona = (persona: Omit<Persona, 'personaId'>) => {
    const newPersona: Persona = {
      ...persona,
      personaId: Date.now().toString(),
    };

    const updatedPersonas = [...personas, newPersona];
    setPersonas(updatedPersonas);
    localStorage.setItem('conceptcraft_personas', JSON.stringify(updatedPersonas));
  };

  const updateCurrentStep = (step: number) => {
    setCurrentStep(step);
    localStorage.setItem('conceptcraft_current_step', step.toString());
  };

  return (
    <AppContext.Provider value={{
      currentConcept,
      updateConcept,
      createNewConcept,
      personas,
      addPersona,
      currentStep,
      setCurrentStep: updateCurrentStep,
    }}>
      {children}
    </AppContext.Provider>
  );
}