export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface SubscriptionLimits {
  maxBusinessConcepts: number;
  maxPersonasPerConcept: number;
  maxAIGenerationsPerMonth: number;
  canExportPDF: boolean;
  canExportJSON: boolean;
  hasTeamCollaboration: boolean;
  hasAdvancedAI: boolean;
  hasPrioritySupport: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, {
  name: string;
  price: number;
  priceId?: string; // For Stripe integration
  limits: SubscriptionLimits;
  features: string[];
  popular?: boolean;
}> = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      maxBusinessConcepts: 1,
      maxPersonasPerConcept: 1,
      maxAIGenerationsPerMonth: 10,
      canExportPDF: false,
      canExportJSON: true,
      hasTeamCollaboration: false,
      hasAdvancedAI: false,
      hasPrioritySupport: false,
    },
    features: [
      '1 Business Concept',
      '1 Persona per concept',
      '10 AI generations per month',
      'Basic Lean Canvas',
      'JSON export',
      'Community support'
    ]
  },
  pro: {
    name: 'Professional',
    price: 49,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    popular: true,
    limits: {
      maxBusinessConcepts: 10,
      maxPersonasPerConcept: 5,
      maxAIGenerationsPerMonth: 500,
      canExportPDF: true,
      canExportJSON: true,
      hasTeamCollaboration: false,
      hasAdvancedAI: true,
      hasPrioritySupport: false,
    },
    features: [
      '10 Business Concepts',
      '5 Personas per concept',
      '500 AI generations per month',
      'Advanced AI features',
      'PDF & JSON export',
      'Pitch deck generator',
      'Email support'
    ]
  },
  business: {
    name: 'Business',
    price: 99,
    priceId: 'price_business_monthly', // Replace with actual Stripe price ID
    limits: {
      maxBusinessConcepts: -1, // Unlimited
      maxPersonasPerConcept: -1, // Unlimited
      maxAIGenerationsPerMonth: -1, // Unlimited
      canExportPDF: true,
      canExportJSON: true,
      hasTeamCollaboration: true,
      hasAdvancedAI: true,
      hasPrioritySupport: true,
    },
    features: [
      'Unlimited Business Concepts',
      'Unlimited Personas',
      'Unlimited AI generations',
      'Team collaboration',
      'Advanced AI features',
      'All export formats',
      'Priority support',
      'Custom integrations'
    ]
  }
};

export class SubscriptionService {
  static getLimits(tier: SubscriptionTier): SubscriptionLimits {
    return SUBSCRIPTION_PLANS[tier].limits;
  }

  static canCreateBusinessConcept(tier: SubscriptionTier, currentCount: number): boolean {
    const limits = this.getLimits(tier);
    return limits.maxBusinessConcepts === -1 || currentCount < limits.maxBusinessConcepts;
  }

  static canCreatePersona(tier: SubscriptionTier, currentCount: number): boolean {
    const limits = this.getLimits(tier);
    return limits.maxPersonasPerConcept === -1 || currentCount < limits.maxPersonasPerConcept;
  }

  static canUseAI(tier: SubscriptionTier, monthlyUsage: number): boolean {
    const limits = this.getLimits(tier);
    return limits.maxAIGenerationsPerMonth === -1 || monthlyUsage < limits.maxAIGenerationsPerMonth;
  }

  static canExportPDF(tier: SubscriptionTier): boolean {
    return this.getLimits(tier).canExportPDF;
  }

  static canExportJSON(tier: SubscriptionTier): boolean {
    return this.getLimits(tier).canExportJSON;
  }

  static hasTeamCollaboration(tier: SubscriptionTier): boolean {
    return this.getLimits(tier).hasTeamCollaboration;
  }

  static hasAdvancedAI(tier: SubscriptionTier): boolean {
    return this.getLimits(tier).hasAdvancedAI;
  }

  static getUpgradeMessage(tier: SubscriptionTier, feature: string): string {
    const nextTier = tier === 'free' ? 'pro' : 'business';
    const nextPlan = SUBSCRIPTION_PLANS[nextTier];
    
    return `Upgrade to ${nextPlan.name} ($${nextPlan.price}/month) to unlock ${feature} and more features.`;
  }

  static getRemainingUsage(tier: SubscriptionTier, currentUsage: number, type: 'concepts' | 'personas' | 'ai'): number | null {
    const limits = this.getLimits(tier);
    
    switch (type) {
      case 'concepts':
        return limits.maxBusinessConcepts === -1 ? null : Math.max(0, limits.maxBusinessConcepts - currentUsage);
      case 'personas':
        return limits.maxPersonasPerConcept === -1 ? null : Math.max(0, limits.maxPersonasPerConcept - currentUsage);
      case 'ai':
        return limits.maxAIGenerationsPerMonth === -1 ? null : Math.max(0, limits.maxAIGenerationsPerMonth - currentUsage);
      default:
        return null;
    }
  }

  // Usage tracking
  static async trackAIUsage(userId: string): Promise<void> {
    // This would integrate with your backend to track usage
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const key = `ai_usage_${userId}_${currentMonth}`;
    
    try {
      const currentUsage = parseInt(localStorage.getItem(key) || '0');
      localStorage.setItem(key, (currentUsage + 1).toString());
    } catch (error) {
      console.error('Error tracking AI usage:', error);
    }
  }

  static getMonthlyAIUsage(userId: string): number {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const key = `ai_usage_${userId}_${currentMonth}`;
    return parseInt(localStorage.getItem(key) || '0');
  }

  // Stripe integration helpers (to be implemented with actual Stripe)
  static async createCheckoutSession(priceId: string, userId: string): Promise<string> {
    // This would call your backend to create a Stripe checkout session
    throw new Error('Stripe integration not implemented yet');
  }

  static async createCustomerPortalSession(customerId: string): Promise<string> {
    // This would call your backend to create a Stripe customer portal session
    throw new Error('Stripe integration not implemented yet');
  }
}

// React hook for subscription management
export function useSubscription(userTier: SubscriptionTier, userId?: string) {
  const limits = SubscriptionService.getLimits(userTier);
  const monthlyAIUsage = userId ? SubscriptionService.getMonthlyAIUsage(userId) : 0;

  return {
    tier: userTier,
    limits,
    monthlyAIUsage,
    canCreateBusinessConcept: (currentCount: number) => 
      SubscriptionService.canCreateBusinessConcept(userTier, currentCount),
    canCreatePersona: (currentCount: number) => 
      SubscriptionService.canCreatePersona(userTier, currentCount),
    canUseAI: () => 
      SubscriptionService.canUseAI(userTier, monthlyAIUsage),
    canExportPDF: () => 
      SubscriptionService.canExportPDF(userTier),
    canExportJSON: () => 
      SubscriptionService.canExportJSON(userTier),
    hasTeamCollaboration: () => 
      SubscriptionService.hasTeamCollaboration(userTier),
    hasAdvancedAI: () => 
      SubscriptionService.hasAdvancedAI(userTier),
    getUpgradeMessage: (feature: string) => 
      SubscriptionService.getUpgradeMessage(userTier, feature),
    getRemainingUsage: (type: 'concepts' | 'personas' | 'ai', currentUsage: number) => 
      SubscriptionService.getRemainingUsage(userTier, currentUsage, type),
    trackAIUsage: () => 
      userId ? SubscriptionService.trackAIUsage(userId) : Promise.resolve(),
  };
}
