import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Fallback responses for demo purposes when API is not available
const FALLBACK_RESPONSES = {
  problemSolution: {
    problemStatement: "Small business owners struggle to efficiently manage their social media presence across multiple platforms, leading to inconsistent brand messaging and missed engagement opportunities.",
    solutionStatement: "Our AI-powered social media management platform automates content creation, scheduling, and engagement tracking across all major social platforms, helping small businesses maintain a consistent and effective online presence without the time investment."
  },
  persona: {
    name: "Sarah the Small Business Owner",
    demographics: "35-45 years old, owns a local retail or service business, manages 2-10 employees, tech-comfortable but time-constrained",
    painPoints: [
      "Limited time to manage social media consistently",
      "Difficulty creating engaging content regularly", 
      "Struggling to track which posts perform best",
      "Managing multiple social media accounts manually"
    ],
    motivations: [
      "Grow customer base and increase sales",
      "Build strong brand recognition in local market",
      "Compete effectively with larger businesses",
      "Maximize return on marketing investment"
    ],
    behaviors: [
      "Uses smartphone for most business tasks",
      "Active on Facebook and Instagram personally",
      "Seeks time-saving business solutions",
      "Values tools that show clear ROI"
    ],
    description: "Sarah is a dedicated small business owner who wears many hats in her company. She understands the importance of social media marketing but struggles to find the time to do it effectively while managing other aspects of her business."
  },
  leanCanvas: {
    keyMetrics: "Monthly recurring revenue, customer acquisition cost, user engagement rate, churn rate",
    uniqueValueProposition: "AI-powered social media automation that saves 10+ hours per week while increasing engagement by 40%",
    unfairAdvantage: "Proprietary AI algorithm trained specifically on small business social media patterns and local market dynamics",
    channels: "Direct sales, content marketing, social media advertising, partner referrals, local business networks",
    costStructure: "AI infrastructure costs, customer support, marketing and sales, platform development, content creation tools",
    revenueStreams: "Monthly subscription fees ($49-199/month based on features), setup fees, premium content packages"
  },
  pitchDeck: [
    {
      title: "The Problem",
      content: "Small business owners are overwhelmed trying to maintain effective social media presence:\n\n• 73% of small businesses struggle with consistent social media posting\n• Average business owner spends 15+ hours/week on social media tasks\n• 60% report difficulty measuring social media ROI\n• Inconsistent brand messaging hurts customer trust",
      slideType: "problem" as const
    },
    {
      title: "Our Solution", 
      content: "AI-powered social media management platform designed specifically for small businesses:\n\n• Automated content creation using business-specific AI\n• Smart scheduling across all major platforms\n• Real-time engagement tracking and analytics\n• Brand-consistent messaging with local market optimization",
      slideType: "solution" as const
    },
    {
      title: "Market Opportunity",
      content: "Massive and growing market opportunity:\n\n• $15.6B social media management software market\n• 31.7M small businesses in the US alone\n• 91% of businesses use social media for marketing\n• Market growing at 23.6% CAGR through 2027",
      slideType: "market" as const
    },
    {
      title: "Business Model",
      content: "Recurring revenue model with multiple tiers:\n\n• Starter Plan: $49/month (basic automation)\n• Professional: $99/month (advanced AI features)\n• Enterprise: $199/month (team collaboration)\n• Average customer LTV: $2,400\n• Target: 10,000 customers by year 2",
      slideType: "business-model" as const
    }
  ]
};

interface ProblemSolutionInput {
  targetAudience: string;
  problemDescription: string;
  solutionIdea: string;
  uniqueValue: string;
}

interface PersonaInput {
  problemStatement: string;
  solutionStatement: string;
  industry: string;
  demographics: string;
  behaviors: string;
  challenges: string;
}

interface LeanCanvasInput {
  problemStatement: string;
  solutionStatement: string;
  targetPersona: string;
  section: string;
  currentData: any;
}

interface PitchDeckInput {
  problemStatement: string;
  solutionStatement: string;
  targetPersona: string;
  leanCanvas: any;
  slideTypes: string[];
}

async function makeOpenAIRequest(messages: any[], maxTokens: number = 1000) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('OpenAI API request failed, using fallback response:', error);
    throw error;
  }
}

export async function generateProblemSolution(input: ProblemSolutionInput) {
  const prompt = `Based on the following information, generate a clear and compelling problem statement and solution statement for a business idea:

Target Audience: ${input.targetAudience}
Problem Description: ${input.problemDescription}
Solution Idea: ${input.solutionIdea}
Unique Value: ${input.uniqueValue}

Please provide:
1. A concise problem statement (2-3 sentences) that clearly articulates the pain point
2. A clear solution statement (2-3 sentences) that explains how the solution addresses the problem

Format your response as JSON:
{
  "problemStatement": "...",
  "solutionStatement": "..."
}`;

  try {
    const response = await makeOpenAIRequest([
      { role: "system", content: "You are an expert business strategist helping founders clarify their business concepts. Provide clear, actionable insights." },
      { role: "user", content: prompt }
    ]);

    return JSON.parse(response);
  } catch (error) {
    console.warn('Using fallback problem/solution response');
    return FALLBACK_RESPONSES.problemSolution;
  }
}

export async function generatePersona(input: PersonaInput) {
  const prompt = `Based on the following business concept, create a detailed customer persona:

Problem Statement: ${input.problemStatement}
Solution Statement: ${input.solutionStatement}
Industry: ${input.industry}
Demographics: ${input.demographics}
Behaviors: ${input.behaviors}
Challenges: ${input.challenges}

Please provide a comprehensive customer persona including:
1. A name for the persona
2. Detailed demographics
3. 3-5 specific pain points (as an array)
4. 3-5 motivations (as an array)
5. 3-5 behaviors (as an array)
6. A narrative description

Format your response as JSON:
{
  "name": "...",
  "demographics": "...",
  "painPoints": ["..."],
  "motivations": ["..."],
  "behaviors": ["..."],
  "description": "..."
}`;

  try {
    const response = await makeOpenAIRequest([
      { role: "system", content: "You are an expert in customer research and persona development. Create realistic, actionable customer personas." },
      { role: "user", content: prompt }
    ], 1500);

    return JSON.parse(response);
  } catch (error) {
    console.warn('Using fallback persona response');
    return FALLBACK_RESPONSES.persona;
  }
}

export async function generateLeanCanvas(input: LeanCanvasInput) {
  const sectionPrompts = {
    keyMetrics: "What are the key metrics this business should track to measure success?",
    uniqueValueProposition: "What is the unique value proposition that differentiates this solution?",
    unfairAdvantage: "What unfair advantage could this business have that competitors can't easily copy?",
    channels: "What are the best channels to reach the target customers?",
    costStructure: "What are the main cost drivers for this business model?",
    revenueStreams: "What are the potential revenue streams for this business?"
  };

  const prompt = `Based on this business concept, provide a suggestion for the ${input.section} section of a Lean Canvas:

Problem Statement: ${input.problemStatement}
Solution Statement: ${input.solutionStatement}
Target Persona: ${input.targetPersona}

Question: ${sectionPrompts[input.section as keyof typeof sectionPrompts]}

Provide a concise, actionable response (2-3 sentences) that would fit in a Lean Canvas box.`;

  try {
    const response = await makeOpenAIRequest([
      { role: "system", content: "You are a business model expert specializing in Lean Canvas methodology. Provide practical, actionable insights." },
      { role: "user", content: prompt }
    ]);

    return { [input.section]: response.trim() };
  } catch (error) {
    console.warn('Using fallback lean canvas response');
    return { [input.section]: FALLBACK_RESPONSES.leanCanvas[input.section as keyof typeof FALLBACK_RESPONSES.leanCanvas] };
  }
}

export async function generatePitchDeckSlides(input: PitchDeckInput) {
  const slidePrompts = {
    problem: "Create content for a 'Problem' slide that clearly defines the problem your target customers face.",
    solution: "Create content for a 'Solution' slide that presents your solution and key features.",
    market: "Create content for a 'Market Opportunity' slide showing market size and opportunity.",
    'business-model': "Create content for a 'Business Model' slide explaining how you make money.",
    team: "Create content for a 'Team' slide template that founders can customize with their team information.",
    financial: "Create content for a 'Financial Projections' slide with realistic projections framework."
  };

  const slides = [];

  for (const slideType of input.slideTypes) {
    const prompt = `Based on this business concept, ${slidePrompts[slideType as keyof typeof slidePrompts]}

Problem Statement: ${input.problemStatement}
Solution Statement: ${input.solutionStatement}
Target Persona: ${input.targetPersona}
${input.leanCanvas ? `Lean Canvas Data: ${JSON.stringify(input.leanCanvas)}` : ''}

Create compelling slide content that would work in an investor pitch deck. Include:
1. A compelling slide title
2. Bullet points or structured content (aim for 4-6 key points)
3. Make it investor-focused and compelling

Format as JSON:
{
  "title": "...",
  "content": "..."
}`;

    try {
      const response = await makeOpenAIRequest([
        { role: "system", content: "You are an expert pitch deck consultant who has helped hundreds of startups raise funding. Create compelling, investor-ready content." },
        { role: "user", content: prompt }
      ], 800);

      const slideData = JSON.parse(response);
      slides.push({
        ...slideData,
        slideType: slideType as any
      });
    } catch (error) {
      console.warn(`Using fallback response for ${slideType} slide`);
      const fallbackSlide = FALLBACK_RESPONSES.pitchDeck.find(s => s.slideType === slideType);
      if (fallbackSlide) {
        slides.push(fallbackSlide);
      }
    }
  }

  return slides;
}