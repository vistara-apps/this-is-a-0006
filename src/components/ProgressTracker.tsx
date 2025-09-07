import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-textPrimary mb-4">Your Progress</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-accent-500" />
              ) : (
                <Circle className={clsx(
                  'h-5 w-5',
                  currentStep === index ? 'text-primary-500' : 'text-gray-300'
                )} />
              )}
            </div>
            <div className="flex-1">
              <h4 className={clsx(
                'font-medium',
                step.completed ? 'text-textPrimary' : 
                currentStep === index ? 'text-primary-500' : 'text-textSecondary'
              )}>
                {step.title}
              </h4>
              <p className="text-sm text-textSecondary">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}