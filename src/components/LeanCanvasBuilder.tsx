import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { useApp } from '../contexts/AppContext';
import { generateLeanCanvas } from '../services/aiService';

interface LeanCanvasBuilderProps {
  onNavigate: (view: string) => void;
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

export function LeanCanvasBuilder({ onNavigate }: LeanCanvasBuilderProps) {
  const { currentConcept, updateConcept, setCurrentStep } = useApp();
  const [canvasData, setCanvasData] = useState<LeanCanvasData>({
    problem: '',
    solution: '',
    keyMetrics: '',
    uniqueValueProposition: '',
    unfairAdvantage: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'build' | 'complete'>('build');

  useEffect(() => {
    if (currentConcept?.leanCanvasData) {
      setCanvasData(currentConcept.leanCanvasData);
      setStep('complete');
    } else if (currentConcept?.problemStatement && currentConcept?.solutionStatement) {
      // Pre-populate with existing data
      setCanvasData(prev => ({
        ...prev,
        problem: currentConcept.problemStatement,
        solution: currentConcept.solutionStatement,
      }));
    }
  }, [currentConcept]);

  const handleFieldChange = (field: keyof LeanCanvasData, value: string) => {
    setCanvasData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateSection = async (section: keyof LeanCanvasData) => {
    if (!currentConcept?.problemStatement || !currentConcept?.solutionStatement) {
      alert('Please complete the Problem/Solution step first.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateLeanCanvas({
        problemStatement: currentConcept.problemStatement,
        solutionStatement: currentConcept.solutionStatement,
        targetPersona: currentConcept.targetPersonaDescription,
        section,
        currentData: canvasData,
      });
      
      setCanvasData(prev => ({ ...prev, [section]: result[section] }));
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    updateConcept({
      leanCanvasData: canvasData,
    });
    setCurrentStep(3);
    setStep('complete');
  };

  const handleContinue = () => {
    onNavigate('pitch-deck');
  };

  const canvasFields = [
    {
      key: 'problem' as keyof LeanCanvasData,
      title: 'Problem',
      description: 'Top 1-3 problems you are solving',
      color: 'border-red-200 bg-red-50',
    },
    {
      key: 'customerSegments' as keyof LeanCanvasData,
      title: 'Customer Segments',
      description: 'Target customers and users',
      color: 'border-blue-200 bg-blue-50',
    },
    {
      key: 'uniqueValueProposition' as keyof LeanCanvasData,
      title: 'Unique Value Proposition',
      description: 'Single, clear compelling message',
      color: 'border-purple-200 bg-purple-50',
    },
    {
      key: 'solution' as keyof LeanCanvasData,
      title: 'Solution',
      description: 'Top 1-3 features that solve the problem',
      color: 'border-green-200 bg-green-50',
    },
    {
      key: 'channels' as keyof LeanCanvasData,
      title: 'Channels',
      description: 'Path to customers',
      color: 'border-yellow-200 bg-yellow-50',
    },
    {
      key: 'revenueStreams' as keyof LeanCanvasData,
      title: 'Revenue Streams',
      description: 'How you make money',
      color: 'border-indigo-200 bg-indigo-50',
    },
    {
      key: 'costStructure' as keyof LeanCanvasData,
      title: 'Cost Structure',
      description: 'Customer Acquisition Costs, Distribution Costs, Hosting, People, etc.',
      color: 'border-pink-200 bg-pink-50',
    },
    {
      key: 'keyMetrics' as keyof LeanCanvasData,
      title: 'Key Metrics',
      description: 'Key numbers that tell you how your business is doing',
      color: 'border-teal-200 bg-teal-50',
    },
    {
      key: 'unfairAdvantage' as keyof LeanCanvasData,
      title: 'Unfair Advantage',
      description: "Something that can't be easily copied or bought",
      color: 'border-orange-200 bg-orange-50',
    },
  ];

  const renderBuildStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          AI-Assisted Lean Canvas Builder
        </h2>
        <p className="text-textSecondary">
          Build your business model canvas with AI assistance. Fill in each section or let AI generate suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canvasFields.map((field) => (
          <Card key={field.key} className={`${field.color} border-2`}>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-textPrimary text-sm">{field.title}</h3>
                <p className="text-xs text-textSecondary">{field.description}</p>
              </div>
              
              <Textarea
                value={canvasData[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={`Describe your ${field.title.toLowerCase()}...`}
                rows={4}
                className="text-sm"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateSection(field.key)}
                isLoading={isGenerating}
                className="w-full"
              >
                <Sparkles className="mr-2 h-3 w-3" />
                AI Suggest
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => onNavigate('persona')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Persona
        </Button>
        <Button onClick={handleSave}>
          Save Canvas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Lean Canvas Complete ✓
        </h2>
        <p className="text-textSecondary">
          Your business model is now mapped out. Ready to create your pitch deck?
        </p>
      </div>

      <Card variant="elevated">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canvasFields.map((field) => (
            <div key={field.key} className={`${field.color} border-2 rounded-lg p-4`}>
              <h3 className="font-semibold text-textPrimary text-sm mb-2">{field.title}</h3>
              <p className="text-xs text-textSecondary mb-3">{field.description}</p>
              <div className="text-sm text-textPrimary bg-white rounded p-2 min-h-[80px]">
                {canvasData[field.key] || 'Not specified'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('build')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Edit Canvas
        </Button>
        <Button onClick={handleContinue}>
          Generate Pitch Deck
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <div className="text-sm text-textSecondary">
          Step 3 of 4: Lean Canvas
        </div>
      </div>

      {step === 'build' && renderBuildStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}