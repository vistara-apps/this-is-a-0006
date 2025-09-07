import React, { useState } from 'react';
import { Lightbulb, Target, BarChart3, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { login, signup, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const features = [
    {
      icon: Target,
      title: 'Problem/Solution Fit Generator',
      description: 'AI-powered tool that helps you articulate a clear and validated problem/solution statement.',
    },
    {
      icon: BarChart3,
      title: 'Target Customer Persona Builder',
      description: 'Build detailed customer personas with AI assistance to understand your ideal customers.',
    },
    {
      icon: Lightbulb,
      title: 'AI-Assisted Lean Canvas',
      description: 'Interactive Lean Canvas builder with AI suggestions for each section of your business model.',
    },
    {
      icon: FileText,
      title: 'AI Pitch Deck Generator',
      description: 'Generate professional pitch deck slides based on your validated business concept.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Basic Problem/Solution Generator',
        '1 Business Concept',
        'Simple Persona Builder',
        'Community Support',
      ],
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For serious founders',
      features: [
        'Advanced AI Generation',
        'Unlimited Business Concepts',
        'Full Lean Canvas Builder',
        'AI Pitch Deck Generator',
        'Priority Support',
      ],
      popular: true,
    },
    {
      name: 'Business',
      price: '$99',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team Collaboration',
        'Advanced Analytics',
        'Custom Templates',
        'Dedicated Support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-background">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Lightbulb className="h-16 w-16 text-primary-500" />
            </div>
            <h1 className="text-5xl font-bold text-textPrimary mb-6">
              ConceptCraft AI
            </h1>
            <p className="text-xl text-textSecondary mb-8 max-w-3xl mx-auto">
              Define, Visualize, and Launch Your Business Idea. 
              AI-powered tools to help founders clarify their core business concept and visualize key strategic elements.
            </p>
            
            {/* Auth Form */}
            <Card className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-textPrimary">
                    {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                  </h3>
                  <p className="text-sm text-textSecondary">
                    {isSignUp ? 'Start building your business concept today' : 'Sign in to continue your journey'}
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-center text-sm text-textSecondary">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-textPrimary mb-4">
              Powerful AI Tools for Founders
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools guides you through every step of defining and validating your business concept.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <feature.icon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-textPrimary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-textSecondary">
              Choose the plan that's right for your startup journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`text-center relative ${tier.popular ? 'ring-2 ring-primary-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-textPrimary mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-500 mb-2">
                  {tier.price}<span className="text-base text-textSecondary">/mo</span>
                </div>
                <p className="text-textSecondary mb-6">{tier.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-accent-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={tier.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-textPrimary text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Lightbulb className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">ConceptCraft AI</span>
          </div>
          <p className="text-gray-300">
            Define, Visualize, and Launch Your Business Idea
          </p>
        </div>
      </footer>
    </div>
  );
}
