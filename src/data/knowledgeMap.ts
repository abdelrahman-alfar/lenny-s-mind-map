// Knowledge map data derived from Lenny's Podcast transcripts
// Source: https://github.com/ChatPRD/lennys-podcast-transcripts

export interface Topic {
  id: string;
  name: string;
  episodeCount: number;
  category: TopicCategory;
  description: string;
}

export type TopicCategory = 
  | 'core-pm'
  | 'growth'
  | 'leadership'
  | 'companies'
  | 'skills'
  | 'career'
  | 'technology';

export const categoryColors: Record<TopicCategory, string> = {
  'core-pm': 'hsl(var(--core-pm))',
  'growth': 'hsl(var(--growth))',
  'leadership': 'hsl(var(--leadership))',
  'companies': 'hsl(var(--companies))',
  'skills': 'hsl(var(--skills))',
  'career': 'hsl(var(--career))',
  'technology': 'hsl(var(--technology))',
};

export const categoryLabels: Record<TopicCategory, string> = {
  'core-pm': 'Core PM',
  'growth': 'Growth',
  'leadership': 'Leadership',
  'companies': 'Companies',
  'skills': 'Skills',
  'career': 'Career',
  'technology': 'Technology',
};

export const topics: Topic[] = [
  // Core PM (largest cluster)
  { id: 'product-management', name: 'Product Management', episodeCount: 142, category: 'core-pm', description: 'Core PM practices, frameworks, and methodologies' },
  { id: 'product-strategy', name: 'Product Strategy', episodeCount: 52, category: 'core-pm', description: 'Strategic thinking and product vision' },
  { id: 'product-development', name: 'Product Development', episodeCount: 46, category: 'core-pm', description: 'Building and shipping products' },
  { id: 'product-market-fit', name: 'Product-Market Fit', episodeCount: 11, category: 'core-pm', description: 'Finding and measuring PMF' },
  { id: 'product-leadership', name: 'Product Leadership', episodeCount: 9, category: 'core-pm', description: 'Leading product teams and organizations' },
  { id: 'prioritization', name: 'Prioritization', episodeCount: 7, category: 'core-pm', description: 'Deciding what to build and when' },
  { id: 'user-experience', name: 'User Experience', episodeCount: 8, category: 'core-pm', description: 'Designing for users' },
  { id: 'customer-research', name: 'Customer Research', episodeCount: 7, category: 'core-pm', description: 'Understanding customer needs' },
  
  // Growth
  { id: 'growth-strategy', name: 'Growth Strategy', episodeCount: 33, category: 'growth', description: 'Scaling products and businesses' },
  { id: 'product-led-growth', name: 'Product-Led Growth', episodeCount: 23, category: 'growth', description: 'PLG strategies and tactics' },
  { id: 'startup-growth', name: 'Startup Growth', episodeCount: 24, category: 'growth', description: 'Early-stage growth tactics' },
  { id: 'experimentation', name: 'Experimentation', episodeCount: 17, category: 'growth', description: 'Testing and learning' },
  { id: 'ab-testing', name: 'A/B Testing', episodeCount: 14, category: 'growth', description: 'Running effective experiments' },
  { id: 'retention', name: 'Retention', episodeCount: 9, category: 'growth', description: 'Keeping users engaged' },
  { id: 'network-effects', name: 'Network Effects', episodeCount: 8, category: 'growth', description: 'Building viral products' },
  { id: 'marketing', name: 'Marketing', episodeCount: 7, category: 'growth', description: 'Go-to-market strategies' },
  
  // Leadership
  { id: 'leadership', name: 'Leadership', episodeCount: 73, category: 'leadership', description: 'Leading teams and organizations' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', episodeCount: 52, category: 'leadership', description: 'Starting and running companies' },
  { id: 'company-culture', name: 'Company Culture', episodeCount: 22, category: 'leadership', description: 'Building great cultures' },
  { id: 'decision-making', name: 'Decision Making', episodeCount: 21, category: 'leadership', description: 'Making better decisions' },
  { id: 'venture-capital', name: 'Venture Capital', episodeCount: 21, category: 'leadership', description: 'Fundraising and investors' },
  { id: 'team-building', name: 'Team Building', episodeCount: 20, category: 'leadership', description: 'Creating high-performing teams' },
  { id: 'hiring', name: 'Hiring', episodeCount: 19, category: 'leadership', description: 'Recruiting top talent' },
  { id: 'innovation', name: 'Innovation', episodeCount: 12, category: 'leadership', description: 'Driving innovation' },
  { id: 'okrs', name: 'OKRs', episodeCount: 10, category: 'leadership', description: 'Goals and key results' },
  { id: 'executive-coaching', name: 'Executive Coaching', episodeCount: 9, category: 'leadership', description: 'Developing as a leader' },
  { id: 'organizational-design', name: 'Org Design', episodeCount: 8, category: 'leadership', description: 'Structuring organizations' },
  { id: 'founder-mode', name: 'Founder Mode', episodeCount: 7, category: 'leadership', description: 'Founder-led companies' },
  
  // Companies
  { id: 'google', name: 'Google', episodeCount: 18, category: 'companies', description: 'Lessons from Google' },
  { id: 'facebook', name: 'Facebook', episodeCount: 15, category: 'companies', description: 'Meta/Facebook insights' },
  { id: 'airbnb', name: 'Airbnb', episodeCount: 10, category: 'companies', description: 'Airbnb case studies' },
  { id: 'machine-learning', name: 'Machine Learning', episodeCount: 10, category: 'companies', description: 'ML in products' },
  { id: 'openai', name: 'OpenAI', episodeCount: 10, category: 'companies', description: 'AI frontier' },
  { id: 'microsoft', name: 'Microsoft', episodeCount: 9, category: 'companies', description: 'Microsoft stories' },
  { id: 'chatgpt', name: 'ChatGPT', episodeCount: 9, category: 'companies', description: 'AI assistants' },
  { id: 'stripe', name: 'Stripe', episodeCount: 9, category: 'companies', description: 'Stripe insights' },
  { id: 'uber', name: 'Uber', episodeCount: 9, category: 'companies', description: 'Uber lessons' },
  { id: 'meta', name: 'Meta', episodeCount: 8, category: 'companies', description: 'Meta deep-dives' },
  { id: 'slack', name: 'Slack', episodeCount: 8, category: 'companies', description: 'Slack case studies' },
  
  // Skills
  { id: 'communication', name: 'Communication', episodeCount: 10, category: 'skills', description: 'Effective communication' },
  { id: 'remote-work', name: 'Remote Work', episodeCount: 10, category: 'skills', description: 'Working remotely' },
  { id: 'strategy', name: 'Strategy', episodeCount: 11, category: 'skills', description: 'Strategic thinking' },
  { id: 'storytelling', name: 'Storytelling', episodeCount: 7, category: 'skills', description: 'Narrative and influence' },
  { id: 'mentorship', name: 'Mentorship', episodeCount: 7, category: 'skills', description: 'Mentoring and being mentored' },
  { id: 'feedback', name: 'Feedback', episodeCount: 7, category: 'skills', description: 'Giving and receiving feedback' },
  { id: 'community-building', name: 'Community Building', episodeCount: 7, category: 'skills', description: 'Building communities' },
  { id: 'enterprise-sales', name: 'Enterprise Sales', episodeCount: 7, category: 'skills', description: 'B2B selling' },
  { id: 'sales', name: 'Sales', episodeCount: 6, category: 'skills', description: 'Sales fundamentals' },
  { id: 'business-strategy', name: 'Business Strategy', episodeCount: 6, category: 'skills', description: 'Business thinking' },
  { id: 'productivity', name: 'Productivity', episodeCount: 5, category: 'skills', description: 'Getting things done' },
  
  // Career
  { id: 'career-development', name: 'Career Development', episodeCount: 40, category: 'career', description: 'Growing your career' },
  { id: 'career-growth', name: 'Career Growth', episodeCount: 7, category: 'career', description: 'Advancing professionally' },
  { id: 'personal-development', name: 'Personal Development', episodeCount: 5, category: 'career', description: 'Self-improvement' },
  { id: 'psychology', name: 'Psychology', episodeCount: 3, category: 'career', description: 'Human behavior' },
  { id: 'mental-health', name: 'Mental Health', episodeCount: 2, category: 'career', description: 'Wellness at work' },
  { id: 'stress-management', name: 'Stress Management', episodeCount: 2, category: 'career', description: 'Managing stress' },
  
  // Technology
  { id: 'ai', name: 'AI', episodeCount: 27, category: 'technology', description: 'Artificial intelligence trends' },
  { id: 'engineering', name: 'Engineering', episodeCount: 3, category: 'technology', description: 'Working with engineers' },
  { id: 'data-analytics', name: 'Data Analytics', episodeCount: 2, category: 'technology', description: 'Data-driven decisions' },
  { id: 'analytics', name: 'Analytics', episodeCount: 2, category: 'technology', description: 'Measurement and metrics' },
];

// Calculate connections between topics based on shared categories and natural relationships
export interface TopicConnection {
  from: string;
  to: string;
  strength: number; // 1-3
}

export const connections: TopicConnection[] = [
  // Core PM connections - dense network
  { from: 'product-management', to: 'product-strategy', strength: 3 },
  { from: 'product-management', to: 'product-development', strength: 3 },
  { from: 'product-management', to: 'prioritization', strength: 2 },
  { from: 'product-management', to: 'user-experience', strength: 2 },
  { from: 'product-management', to: 'customer-research', strength: 2 },
  { from: 'product-strategy', to: 'product-market-fit', strength: 3 },
  { from: 'product-strategy', to: 'prioritization', strength: 2 },
  { from: 'product-strategy', to: 'product-development', strength: 2 },
  { from: 'product-strategy', to: 'decision-making', strength: 2 },
  { from: 'product-strategy', to: 'growth-strategy', strength: 2 },
  { from: 'product-strategy', to: 'okrs', strength: 2 },
  { from: 'product-development', to: 'user-experience', strength: 2 },
  { from: 'product-development', to: 'experimentation', strength: 2 },
  { from: 'customer-research', to: 'user-experience', strength: 2 },
  { from: 'product-market-fit', to: 'customer-research', strength: 2 },
  { from: 'product-market-fit', to: 'startup-growth', strength: 2 },
  { from: 'product-market-fit', to: 'entrepreneurship', strength: 2 },
  { from: 'prioritization', to: 'okrs', strength: 2 },
  { from: 'prioritization', to: 'decision-making', strength: 2 },
  { from: 'product-leadership', to: 'product-management', strength: 2 },
  { from: 'product-leadership', to: 'leadership', strength: 3 },
  
  // Growth connections - expanded
  { from: 'growth-strategy', to: 'product-led-growth', strength: 3 },
  { from: 'growth-strategy', to: 'startup-growth', strength: 3 },
  { from: 'growth-strategy', to: 'marketing', strength: 2 },
  { from: 'growth-strategy', to: 'retention', strength: 2 },
  { from: 'growth-strategy', to: 'experimentation', strength: 2 },
  { from: 'product-led-growth', to: 'retention', strength: 2 },
  { from: 'product-led-growth', to: 'user-experience', strength: 2 },
  { from: 'experimentation', to: 'ab-testing', strength: 3 },
  { from: 'experimentation', to: 'product-development', strength: 2 },
  { from: 'retention', to: 'customer-research', strength: 2 },
  { from: 'network-effects', to: 'growth-strategy', strength: 2 },
  { from: 'network-effects', to: 'product-led-growth', strength: 2 },
  { from: 'startup-growth', to: 'entrepreneurship', strength: 2 },
  { from: 'startup-growth', to: 'venture-capital', strength: 2 },
  { from: 'marketing', to: 'storytelling', strength: 2 },
  
  // Leadership connections - expanded
  { from: 'leadership', to: 'team-building', strength: 3 },
  { from: 'leadership', to: 'decision-making', strength: 3 },
  { from: 'leadership', to: 'company-culture', strength: 2 },
  { from: 'leadership', to: 'hiring', strength: 2 },
  { from: 'leadership', to: 'communication', strength: 2 },
  { from: 'leadership', to: 'mentorship', strength: 2 },
  { from: 'entrepreneurship', to: 'venture-capital', strength: 3 },
  { from: 'entrepreneurship', to: 'founder-mode', strength: 3 },
  { from: 'entrepreneurship', to: 'startup-growth', strength: 2 },
  { from: 'company-culture', to: 'hiring', strength: 2 },
  { from: 'company-culture', to: 'team-building', strength: 2 },
  { from: 'company-culture', to: 'remote-work', strength: 2 },
  { from: 'team-building', to: 'hiring', strength: 2 },
  { from: 'team-building', to: 'mentorship', strength: 2 },
  { from: 'decision-making', to: 'strategy', strength: 2 },
  { from: 'okrs', to: 'leadership', strength: 2 },
  { from: 'okrs', to: 'team-building', strength: 2 },
  { from: 'organizational-design', to: 'leadership', strength: 2 },
  { from: 'organizational-design', to: 'company-culture', strength: 2 },
  { from: 'innovation', to: 'product-development', strength: 2 },
  { from: 'innovation', to: 'entrepreneurship', strength: 2 },
  { from: 'executive-coaching', to: 'leadership', strength: 2 },
  { from: 'founder-mode', to: 'leadership', strength: 2 },
  
  // Cross-category connections
  { from: 'product-management', to: 'leadership', strength: 2 },
  { from: 'product-strategy', to: 'entrepreneurship', strength: 2 },
  { from: 'growth-strategy', to: 'product-management', strength: 2 },
  { from: 'ai', to: 'product-development', strength: 2 },
  { from: 'ai', to: 'machine-learning', strength: 3 },
  { from: 'ai', to: 'chatgpt', strength: 2 },
  { from: 'ai', to: 'openai', strength: 2 },
  { from: 'career-development', to: 'mentorship', strength: 3 },
  { from: 'career-development', to: 'career-growth', strength: 3 },
  { from: 'career-development', to: 'personal-development', strength: 2 },
  { from: 'career-growth', to: 'mentorship', strength: 2 },
  { from: 'communication', to: 'leadership', strength: 2 },
  { from: 'communication', to: 'storytelling', strength: 2 },
  { from: 'communication', to: 'feedback', strength: 2 },
  { from: 'feedback', to: 'team-building', strength: 2 },
  
  // Company connections
  { from: 'google', to: 'facebook', strength: 2 },
  { from: 'airbnb', to: 'entrepreneurship', strength: 2 },
  { from: 'stripe', to: 'product-development', strength: 2 },
  { from: 'slack', to: 'product-led-growth', strength: 2 },
  { from: 'uber', to: 'growth-strategy', strength: 2 },
  { from: 'meta', to: 'facebook', strength: 3 },
  { from: 'openai', to: 'chatgpt', strength: 3 },
  { from: 'openai', to: 'machine-learning', strength: 2 },
  
  // Skills connections
  { from: 'strategy', to: 'business-strategy', strength: 2 },
  { from: 'strategy', to: 'product-strategy', strength: 2 },
  { from: 'enterprise-sales', to: 'sales', strength: 3 },
  { from: 'sales', to: 'marketing', strength: 2 },
  { from: 'productivity', to: 'remote-work', strength: 2 },
  { from: 'community-building', to: 'network-effects', strength: 2 },
];

export const getTotalEpisodes = () => 269;

export const getTopicsByCategory = (category: TopicCategory): Topic[] => 
  topics.filter(t => t.category === category);

export const getTopTenTopics = (): Topic[] => 
  [...topics].sort((a, b) => b.episodeCount - a.episodeCount).slice(0, 10);
