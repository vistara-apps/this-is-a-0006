import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Users } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { Input } from './Input';
import { useApp } from '../contexts/AppContext';
import { generatePersona } from '../services/aiService';

interface PersonaBuilderProps {
  onNavigate: (view: string) => void;
}

export function PersonaBuilder({ onNavigate }: PersonaBuilderProps) {
  const { currentConcept, updateConcept, setCurrentStep } = useApp();
  const [formData, setFormData] = useState({
    industry: '',
    demographics: '',
    behaviors: '',
    challenges: '',
  });
  const [generatedPersona, setGeneratedPersona] = useState({
    name: '',
    demographics: '',
    painPoints: [] as string[],
    motivations: [] as string[],
    behaviors: [] as string[],
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'complete'>('input');

  useEffect(() => {
    if (currentConcept?.targetPersonaDescription) {
      // Parse existing persona data if available
      try {
        const parsed = JSON.parse(currentConcept.targetPersonaDescription);
        setGeneratedPersona(parsed);
        setStep('complete');
      } catch {
        // If it's just a string description, use it as is
        setGeneratedPersona(prev => ({
          ...prev,
          description: currentConcept.targetPersonaDescription
        }));
        setStep('complete');
      }
    }
  }, [currentConcept]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!currentConcept?.problemStatement || !currentConcept?.solutionStatement) {
      alert('Please complete the Problem/Solution step first.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePersona({
        problemStatement: currentConcept.problemStatement,
        solutionStatement: currentConcept.solutionStatement,
        ...formData,
      });
      setGeneratedPersona(result);
      setStep('review');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate persona. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    updateConcept({
      targetPersonaDescription: JSON.stringify(generatedPersona),
    });
    setCurrentStep(2);
    setStep('complete');
  };

  const handleContinue = () => {
    onNavigate('lean-canvas');
  };

  const renderInputStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Target Customer Persona Builder
        </h2>
        <p className="text-textSecondary">
          Help AI understand your target market to create a detailed customer persona.
        </p>
      </div>

      {currentConcept?.problemStatement && (
        <Card className="bg-primary-50 border border-primary-200">
          <h3 className="font-semibold text-primary-700 mb-2">Your Problem Statement</h3>
          <p className="text-primary-600 text-sm">{currentConcept.problemStatement}</p>
        </Card>
      )}

      <Card>
        <div className="space-y-6">
          <Input
            label="What industry or market are you targeting?"
            placeholder="e.g., SaaS, Healthcare, E-commerce, Education..."
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
          />

          <Textarea
            label="Describe your ideal customer's demographics"
            placeholder="Age range, job title, company size, location, income level..."
            rows={3}
            value={formData.demographics}
            onChange={(e) => handleInputChange('demographics', e.target.value)}
          />

          <Textarea
            label="What are their typical behaviors and preferences?"
            placeholder="How do they currently solve problems? What tools do they use? Where do they spend time online?"
            rows={4}
            value={formData.behaviors}
            onChange={(e) => handleInputChange('behaviors', e.target.value)}
          />

          <Textarea
            label="What specific challenges do they face?"
            placeholder="Beyond the main problem, what other pain points do they experience?"
            rows={4}
            value={formData.challenges}
            onChange={(e) => handleInputChange('challenges', e.target.value)}
          />

          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Customer Persona
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Review Generated Persona
        </h2>
        <p className="text-textSecondary">
          Review and customize your AI-generated customer persona.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-primary-500" />
              <Input
                value={generatedPersona.name}
                onChange={(e) => setGeneratedPersona(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Persona name"
                className="text-lg font-semibold"
              />
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Demographics</h4>
              <Textarea
                value={generatedPersona.demographics}
                onChange={(e) => setGeneratedPersona(prev => ({ ...prev, demographics: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Description</h4>
              <Textarea
                value={generatedPersona.description}
                onChange={(e) => setGeneratedPersona(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-textPrimary mb-2">Pain Points</h4>
              <Textarea
                value={generatedPersona.painPoints.join('\n')}
                onChange={(e) => setGeneratedPersona(prev => ({ 
                  ...prev, 
                  painPoints: e.target.value.split('\n').filter(p => p.trim()) 
                }))}
                rows={4}
                placeholder="One pain point per line"
              />
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Motivations</h4>
              <Textarea
                value={generatedPersona.motivations.join('\n')}
                onChange={(e) => setGeneratedPersona(prev => ({ 
                  ...prev, 
                  motivations: e.target.value.split('\n').filter(m => m.trim()) 
                }))}
                rows={3}
                placeholder="One motivation per line"
              />
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Behaviors</h4>
              <Textarea
                value={generatedPersona.behaviors.join('\n')}
                onChange={(e) => setGeneratedPersona(prev => ({ 
                  ...prev, 
                  behaviors: e.target.value.split('\n').filter(b => b.trim()) 
                }))}
                rows={3}
                placeholder="One behavior per line"
              />
            </div>
          </div>
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
          Customer Persona Complete ✓
        </h2>
        <p className="text-textSecondary">
          Your target customer is now clearly defined. Ready to build your Lean Canvas?
        </p>
      </div>

      <Card variant="elevated">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-primary-500" />
              <h3 className="text-xl font-semibold text-textPrimary">{generatedPersona.name}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-textPrimary mb-2">Demographics</h4>
                <p className="text-textSecondary text-sm">{generatedPersona.demographics}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-textPrimary mb-2">Description</h4>
                <p className="text-textSecondary text-sm">{generatedPersona.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-textPrimary mb-2">Pain Points</h4>
              <ul className="text-textSecondary text-sm space-y-1">
                {generatedPersona.painPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Motivations</h4>
              <ul className="text-textSecondary text-sm space-y-1">
                {generatedPersona.motivations.map((motivation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {motivation}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-textPrimary mb-2">Behaviors</h4>
              <ul className="text-textSecondary text-sm space-y-1">
                {generatedPersona.behaviors.map((behavior, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {behavior}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('review')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Edit Persona
        </Button>
        <Button onClick={handleContinue}>
          Build Lean Canvas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
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
          Step 2 of 4: Target Customer Persona
        </div>
      </div>

      {step === 'input' && renderInputStep()}
      {step === 'review' && renderReviewStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}