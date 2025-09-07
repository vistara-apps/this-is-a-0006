import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the PRD data model
export interface User {
  userId: string;
  email: string;
  subscriptionTier: 'free' | 'pro' | 'business';
  createdAt: string;
}

export interface BusinessConcept {
  conceptId: string;
  userId: string;
  problemStatement: string;
  solutionStatement: string;
  targetPersonaDescription: string;
  leanCanvasData: any;
  pitchDeckSlidesData: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Persona {
  personaId: string;
  businessConceptId: string;
  name: string;
  demographics: string;
  painPoints: string[];
  motivations: string[];
  behaviors: string[];
}

// Database service functions
export class DatabaseService {
  // User operations
  static async createUser(user: Omit<User, 'userId' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Business Concept operations
  static async createBusinessConcept(concept: Omit<BusinessConcept, 'conceptId' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('business_concepts')
      .insert([{
        ...concept,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusinessConcept(conceptId: string, updates: Partial<BusinessConcept>) {
    const { data, error } = await supabase
      .from('business_concepts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('concept_id', conceptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessConceptsByUser(userId: string) {
    const { data, error } = await supabase
      .from('business_concepts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Persona operations
  static async createPersona(persona: Omit<Persona, 'personaId'>) {
    const { data, error } = await supabase
      .from('personas')
      .insert([persona])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPersonasByBusinessConcept(businessConceptId: string) {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('business_concept_id', businessConceptId);

    if (error) throw error;
    return data;
  }
}

// SQL for creating the database tables (to be run in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Concepts table
CREATE TABLE IF NOT EXISTS business_concepts (
  concept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  problem_statement TEXT DEFAULT '',
  solution_statement TEXT DEFAULT '',
  target_persona_description TEXT DEFAULT '',
  lean_canvas_data JSONB,
  pitch_deck_slides_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
  persona_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_concept_id UUID REFERENCES business_concepts(concept_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics TEXT,
  pain_points TEXT[] DEFAULT '{}',
  motivations TEXT[] DEFAULT '{}',
  behaviors TEXT[] DEFAULT '{}'
);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Business concepts policies
CREATE POLICY "Users can view own concepts" ON business_concepts FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own concepts" ON business_concepts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own concepts" ON business_concepts FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own concepts" ON business_concepts FOR DELETE USING (auth.uid()::text = user_id::text);

-- Personas policies
CREATE POLICY "Users can view personas for own concepts" ON personas FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM business_concepts 
    WHERE business_concepts.concept_id = personas.business_concept_id 
    AND business_concepts.user_id::text = auth.uid()::text
  )
);
CREATE POLICY "Users can create personas for own concepts" ON personas FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM business_concepts 
    WHERE business_concepts.concept_id = personas.business_concept_id 
    AND business_concepts.user_id::text = auth.uid()::text
  )
);
`;
