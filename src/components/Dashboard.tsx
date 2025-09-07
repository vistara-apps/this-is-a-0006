import React from 'react';
import { Target, Users, BarChart3, FileText, Plus, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { ProgressTracker } from './ProgressTracker';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { currentConcept, createNewConcept, currentStep } = useApp();

  const steps = [
    {
      id: 0,
      title: 'Problem/Solution Fit',
      description: 'Define your core business concept',
      completed: currentConcept?.problemStatement && currentConcept?.solutionStatement ? true : false,
    },
    {
      id: 1,
      title: 'Target Persona',
      description: 'Identify your ideal customer',
      completed: currentConcept?.targetPersonaDescription ? true : false,
    },
    {
      id: 2,
      title: 'Lean Canvas',
      description: 'Map your business model',
      completed: currentConcept?.leanCanvasData ? true : false,
    },
    {
      id: 3,
      title: 'Pitch Deck',
      description: 'Create presentation slides',
      completed: currentConcept?.pitchDeckSlidesData?.length > 0 ? true : false,
    },
  ];

  const tools = [
    {
      icon: Target,
      title: 'Problem/Solution Generator',
      description: 'Define your core business concept with AI guidance',
      action: () => onNavigate('problem-solution'),
      completed: steps[0].completed,
    },
    {
      icon: Users,
      title: 'Persona Builder',
      description: 'Build detailed customer personas',
      action: () => onNavigate('persona'),
      completed: steps[1].completed,
    },
    {
      icon: BarChart3,
      title: 'Lean Canvas Builder',
      description: 'Visualize your business model',
      action: () => onNavigate('lean-canvas'),
      completed: steps[2].completed,
    },
    {
      icon: FileText,
      title: 'Pitch Deck Generator',
      description: 'Create investor presentation slides',
      action: () => onNavigate('pitch-deck'),
      completed: steps[3].completed,
    },
  ];

  const handleStartNewConcept = () => {
    if (user) {
      createNewConcept(user.userId);
      onNavigate('problem-solution');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">
          Welcome back, {user?.email.split('@')[0]}!
        </h1>
        <p className="text-lg text-textSecondary">
          Continue building your business concept or start a new one.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Concept */}
          {currentConcept ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-textPrimary">Current Concept</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartNewConcept}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Concept
                </Button>
              </div>
              
              {currentConcept.problemStatement ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-textPrimary mb-2">Problem Statement</h3>
                    <p className="text-textSecondary">{currentConcept.problemStatement}</p>
                  </div>
                  
                  {currentConcept.solutionStatement && (
                    <div>
                      <h3 className="font-medium text-textPrimary mb-2">Solution Statement</h3>
                      <p className="text-textSecondary">{currentConcept.solutionStatement}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-textSecondary">
                    Last updated: {new Date(currentConcept.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-textSecondary mb-4">
                    You have a concept in progress. Continue where you left off.
                  </p>
                  <Button onClick={() => onNavigate('problem-solution')}>
                    Continue Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-textPrimary mb-2">
                  Ready to Build Your Business Concept?
                </h2>
                <p className="text-textSecondary mb-6">
                  Start with our AI-powered Problem/Solution Generator to define your core business idea.
                </p>
                <Button onClick={handleStartNewConcept}>
                  Start New Concept
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Tools Grid */}
          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-6">AI-Powered Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <div onClick={tool.action} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <tool.icon className="h-8 w-8 text-primary-500" />
                      {tool.completed && (
                        <div className="bg-accent-500 text-white text-xs px-2 py-1 rounded">
                          Completed
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-textPrimary mb-2">{tool.title}</h3>
                      <p className="text-textSecondary text-sm">{tool.description}</p>
                    </div>
                    <div className="flex items-center text-primary-500 text-sm font-medium">
                      {tool.completed ? 'View & Edit' : 'Get Started'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProgressTracker steps={steps} currentStep={currentStep} />
          
          {/* Subscription Info */}
          <Card>
            <div className="text-center">
              <h3 className="font-semibold text-textPrimary mb-2">Current Plan</h3>
              <div className="bg-accent-500 text-white px-3 py-2 rounded mb-4">
                {user?.subscriptionTier.toUpperCase()} TIER
              </div>
              <p className="text-textSecondary text-sm mb-4">
                {user?.subscriptionTier === 'free' 
                  ? 'Upgrade to Pro for unlimited concepts and advanced AI features.'
                  : 'You have access to all premium features.'}
              </p>
              {user?.subscriptionTier === 'free' && (
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
