import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { Input } from './Input';
import { useApp } from '../contexts/AppContext';
import { generateProblemSolution } from '../services/aiService';

interface ProblemSolutionGeneratorProps {
  onNavigate: (view: string) => void;
}

export function ProblemSolutionGenerator({ onNavigate }: ProblemSolutionGeneratorProps) {
  const { currentConcept, updateConcept, setCurrentStep } = useApp();
  const [formData, setFormData] = useState({
    targetAudience: '',
    problemDescription: '',
    solutionIdea: '',
    uniqueValue: '',
  });
  const [generatedProblem, setGeneratedProblem] = useState('');
  const [generatedSolution, setGeneratedSolution] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'complete'>('input');

  useEffect(() => {
    if (currentConcept?.problemStatement && currentConcept?.solutionStatement) {
      setGeneratedProblem(currentConcept.problemStatement);
      setGeneratedSolution(currentConcept.solutionStatement);
      setStep('complete');
    }
  }, [currentConcept]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.targetAudience || !formData.problemDescription || !formData.solutionIdea) {
      alert('Please fill in all required fields before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProblemSolution(formData);
      setGeneratedProblem(result.problemStatement);
      setGeneratedSolution(result.solutionStatement);
      setStep('review');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    updateConcept({
      problemStatement: generatedProblem,
      solutionStatement: generatedSolution,
    });
    setCurrentStep(1);
    setStep('complete');
  };

  const handleContinue = () => {
    onNavigate('persona');
  };

  const renderInputStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Problem/Solution Fit Generator
        </h2>
        <p className="text-textSecondary">
          Answer these questions to help AI generate a clear problem and solution statement for your business idea.
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <Input
            label="Who is your target audience? *"
            placeholder="e.g., Small business owners, busy professionals, students..."
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
          />

          <Textarea
            label="What problem are you trying to solve? *"
            placeholder="Describe the pain point or challenge your target audience faces..."
            rows={4}
            value={formData.problemDescription}
            onChange={(e) => handleInputChange('problemDescription', e.target.value)}
          />

          <Textarea
            label="What is your solution idea? *"
            placeholder="Describe your proposed solution to the problem..."
            rows={4}
            value={formData.solutionIdea}
            onChange={(e) => handleInputChange('solutionIdea', e.target.value)}
          />

          <Textarea
            label="What makes your solution unique?"
            placeholder="What's your competitive advantage or unique value proposition?"
            rows={3}
            value={formData.uniqueValue}
            onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
          />

          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Problem/Solution Statements
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Review Generated Statements
        </h2>
        <p className="text-textSecondary">
          Review and refine the AI-generated problem and solution statements.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Problem Statement</h3>
          <Textarea
            value={generatedProblem}
            onChange={(e) => setGeneratedProblem(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Solution Statement</h3>
          <Textarea
            value={generatedSolution}
            onChange={(e) => setGeneratedSolution(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('input')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Edit
        </Button>
        <Button onClick={handleSave}>
          Save & Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Problem/Solution Statements Complete ✓
        </h2>
        <p className="text-textSecondary">
          Your core business concept is now defined. Ready to build your customer persona?
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Problem Statement</h3>
          <p className="text-textSecondary leading-relaxed">{generatedProblem}</p>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Solution Statement</h3>
          <p className="text-textSecondary leading-relaxed">{generatedSolution}</p>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('review')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Edit Statements
        </Button>
        <Button onClick={handleContinue}>
          Build Customer Persona
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <div className="text-sm text-textSecondary">
          Step 1 of 4: Problem/Solution Fit
        </div>
      </div>

      {step === 'input' && renderInputStep()}
      {step === 'review' && renderReviewStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}