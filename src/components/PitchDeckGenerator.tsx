import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, FileText, Download, Plus, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { useApp } from '../contexts/AppContext';
import { generatePitchDeckSlides } from '../services/aiService';

interface PitchDeckGeneratorProps {
  onNavigate: (view: string) => void;
}

interface PitchDeckSlide {
  title: string;
  content: string;
  slideType: 'problem' | 'solution' | 'market' | 'business-model' | 'team' | 'financial';
}

export function PitchDeckGenerator({ onNavigate }: PitchDeckGeneratorProps) {
  const { currentConcept, updateConcept, setCurrentStep } = useApp();
  const [slides, setSlides] = useState<PitchDeckSlide[]>([]);
  const [selectedSlideTypes, setSelectedSlideTypes] = useState<string[]>([
    'problem', 'solution', 'market', 'business-model'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'select' | 'review' | 'complete'>('select');

  const slideTypeOptions = [
    { id: 'problem', title: 'Problem', description: 'Define the problem you\'re solving' },
    { id: 'solution', title: 'Solution', description: 'Present your solution' },
    { id: 'market', title: 'Market Opportunity', description: 'Market size and opportunity' },
    { id: 'business-model', title: 'Business Model', description: 'How you make money' },
    { id: 'team', title: 'Team', description: 'Introduce your team' },
    { id: 'financial', title: 'Financial Projections', description: 'Revenue and growth projections' },
  ];

  useEffect(() => {
    if (currentConcept?.pitchDeckSlidesData && currentConcept.pitchDeckSlidesData.length > 0) {
      setSlides(currentConcept.pitchDeckSlidesData);
      setStep('complete');
    }
  }, [currentConcept]);

  const handleSlideTypeToggle = (slideType: string) => {
    setSelectedSlideTypes(prev => 
      prev.includes(slideType)
        ? prev.filter(type => type !== slideType)
        : [...prev, slideType]
    );
  };

  const handleGenerate = async () => {
    if (!currentConcept?.problemStatement || !currentConcept?.solutionStatement) {
      alert('Please complete the Problem/Solution step first.');
      return;
    }

    if (selectedSlideTypes.length === 0) {
      alert('Please select at least one slide type.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePitchDeckSlides({
        problemStatement: currentConcept.problemStatement,
        solutionStatement: currentConcept.solutionStatement,
        targetPersona: currentConcept.targetPersonaDescription,
        leanCanvas: currentConcept.leanCanvasData,
        slideTypes: selectedSlideTypes,
      });
      
      setSlides(result);
      setStep('review');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate slides. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlideEdit = (index: number, field: 'title' | 'content', value: string) => {
    setSlides(prev => prev.map((slide, i) => 
      i === index ? { ...slide, [field]: value } : slide
    ));
  };

  const handleAddSlide = () => {
    const newSlide: PitchDeckSlide = {
      title: 'New Slide',
      content: 'Add your content here...',
      slideType: 'problem',
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const handleRemoveSlide = (index: number) => {
    setSlides(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateConcept({
      pitchDeckSlidesData: slides,
    });
    setCurrentStep(4);
    setStep('complete');
  };

  const handleExport = () => {
    const content = slides.map(slide => `
# ${slide.title}

${slide.content}

---
`).join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pitch-deck.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSelectStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          AI Pitch Deck Slide Generator
        </h2>
        <p className="text-textSecondary">
          Select the types of slides you want to include in your pitch deck. AI will generate content based on your business concept.
        </p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Select Slide Types</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {slideTypeOptions.map((option) => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                selectedSlideTypes.includes(option.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => handleSlideTypeToggle(option.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-textPrimary">{option.title}</h4>
                <div className={`w-4 h-4 rounded border-2 ${
                  selectedSlideTypes.includes(option.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedSlideTypes.includes(option.id) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-textSecondary">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full"
            disabled={selectedSlideTypes.length === 0}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Pitch Deck Slides
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary mb-2">
            Review & Edit Slides
          </h2>
          <p className="text-textSecondary">
            Review and customize your AI-generated pitch deck slides.
          </p>
        </div>
        <Button variant="outline" onClick={handleAddSlide}>
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </Button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-medium text-textSecondary">
                  Slide {index + 1}
                </span>
              </div>
              {slides.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveSlide(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={slide.title}
                onChange={(e) => handleSlideEdit(index, 'title', e.target.value)}
                className="input-field text-lg font-semibold"
                placeholder="Slide title"
              />
              
              <Textarea
                value={slide.content}
                onChange={(e) => handleSlideEdit(index, 'content', e.target.value)}
                rows={6}
                placeholder="Slide content"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('select')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Selection
        </Button>
        <Button onClick={handleSave}>
          Save Pitch Deck
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary mb-2">
            Pitch Deck Complete ✓
          </h2>
          <p className="text-textSecondary">
            Your pitch deck is ready! You can export it or continue editing.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setStep('review')}>
            Edit Slides
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {slides.map((slide, index) => (
          <Card key={index} variant="elevated" className="h-64 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-primary-500" />
                <span className="text-xs font-medium text-textSecondary">
                  Slide {index + 1}
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-textPrimary mb-3 text-sm">{slide.title}</h3>
            <div className="text-xs text-textSecondary overflow-hidden">
              <p className="line-clamp-6">{slide.content}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-accent-50 border border-accent-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-accent-700 mb-2">
            🎉 Congratulations!
          </h3>
          <p className="text-accent-600 mb-4">
            You've successfully completed your business concept with ConceptCraft AI. Your idea is now clearly defined and ready for the next steps.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => onNavigate('dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Pitch Deck
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <div className="text-sm text-textSecondary">
          Step 4 of 4: Pitch Deck Generation
        </div>
      </div>

      {step === 'select' && renderSelectStep()}
      {step === 'review' && renderReviewStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}
