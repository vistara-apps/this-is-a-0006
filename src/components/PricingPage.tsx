import React from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../utils/subscriptionUtils';
import { useAuth } from '../contexts/AuthContext';

interface PricingPageProps {
  onNavigate: (view: string) => void;
  onSelectPlan?: (tier: SubscriptionTier) => void;
}

export function PricingPage({ onNavigate, onSelectPlan }: PricingPageProps) {
  const { user } = useAuth();

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      // Default behavior - navigate to signup if not logged in
      if (!user && tier !== 'free') {
        onNavigate('landing');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-textPrimary mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Start for free and upgrade as your business grows. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => (
            <Card 
              key={tier}
              className={`relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-textPrimary mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-textPrimary">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-textSecondary">/month</span>
                  )}
                </div>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => handleSelectPlan(tier as SubscriptionTier)}
                >
                  {tier === 'free' ? 'Get Started Free' : `Choose ${plan.name}`}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-textSecondary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Usage Limits */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-textPrimary mb-3">Usage Limits</h4>
                <div className="space-y-2 text-sm text-textSecondary">
                  <div className="flex justify-between">
                    <span>Business Concepts:</span>
                    <span className="font-medium">
                      {plan.limits.maxBusinessConcepts === -1 ? 'Unlimited' : plan.limits.maxBusinessConcepts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personas per Concept:</span>
                    <span className="font-medium">
                      {plan.limits.maxPersonasPerConcept === -1 ? 'Unlimited' : plan.limits.maxPersonasPerConcept}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Generations/Month:</span>
                    <span className="font-medium">
                      {plan.limits.maxAIGenerationsPerMonth === -1 ? 'Unlimited' : plan.limits.maxAIGenerationsPerMonth}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-textPrimary text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-textPrimary mb-2">
                Can I change my plan at any time?
              </h3>
              <p className="text-textSecondary">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-textPrimary mb-2">
                What happens if I exceed my usage limits?
              </h3>
              <p className="text-textSecondary">
                We'll notify you when you're approaching your limits. If you exceed them, 
                you'll be prompted to upgrade your plan to continue using premium features.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-textPrimary mb-2">
                Is there a free trial for paid plans?
              </h3>
              <p className="text-textSecondary">
                Our Free plan gives you full access to core features. You can upgrade anytime 
                to unlock advanced features and higher usage limits.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-textPrimary mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-textSecondary">
                Yes, we offer a 30-day money-back guarantee for all paid plans. 
                Contact our support team if you're not satisfied.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Card className="bg-primary-50 border-primary-200">
            <h3 className="text-2xl font-bold text-textPrimary mb-4">
              Ready to Build Your Next Big Idea?
            </h3>
            <p className="text-textSecondary mb-6">
              Join thousands of founders who use ConceptCraft AI to validate and develop their business concepts.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => handleSelectPlan('free')}
            >
              Start Building for Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
