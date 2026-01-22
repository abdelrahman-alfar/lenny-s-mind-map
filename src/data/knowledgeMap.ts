// Knowledge map data derived from Lenny's Podcast transcripts
// Source: https://github.com/ChatPRD/lennys-podcast-transcripts

export interface TopicInsight {
  title: string;
  summary: string;
}

export interface Topic {
  id: string;
  name: string;
  episodeCount: number;
  category: TopicCategory;
  description: string;
  keyInsights: TopicInsight[];
  deepDive: string[];
}

export type TopicCategory = 
  | 'strategy'
  | 'growth'
  | 'leadership'
  | 'execution'
  | 'skills'
  | 'career';

export const categoryColors: Record<TopicCategory, string> = {
  'strategy': 'hsl(var(--strategy))',
  'growth': 'hsl(var(--growth))',
  'leadership': 'hsl(var(--leadership))',
  'execution': 'hsl(var(--execution))',
  'skills': 'hsl(var(--skills))',
  'career': 'hsl(var(--career))',
};

export const categoryLabels: Record<TopicCategory, string> = {
  'strategy': 'Strategy',
  'growth': 'Growth',
  'leadership': 'Leadership',
  'execution': 'Execution',
  'skills': 'Skills',
  'career': 'Career',
};

export const topics: Topic[] = [
  // Strategy
  {
    id: 'product-strategy',
    name: 'Product Strategy',
    episodeCount: 52,
    category: 'strategy',
    description: 'Defining vision, positioning, and long-term product direction',
    keyInsights: [
      { title: 'Strategy is about saying no', summary: 'The best product strategies are defined by what you choose NOT to do. Focus beats feature breadth.' },
      { title: 'Vision → Strategy → Roadmap', summary: 'Vision is the destination, strategy is the path, roadmap is the steps. Most teams skip strategy.' },
      { title: 'Positioning drives everything', summary: 'How you position your product determines who you compete with and how you win.' },
    ],
    deepDive: [
      'Product strategy must answer: Who is our customer? What problem do we solve? Why us? Why now?',
      'The best strategies are opinionated and specific - if everyone agrees, it\'s not a strategy.',
      'Strategy should fit on one page. If you can\'t explain it simply, you don\'t understand it.',
      'Revisit strategy quarterly but don\'t change it reactively to every market signal.',
      'Great PMs spend 40% of time on strategy, 40% on execution, 20% on team.',
    ]
  },
  {
    id: 'product-market-fit',
    name: 'Product-Market Fit',
    episodeCount: 11,
    category: 'strategy',
    description: 'Finding and measuring when your product truly resonates with customers',
    keyInsights: [
      { title: 'PMF feels like pull, not push', summary: 'When you have it, customers pull the product from you. You\'re not convincing - you\'re fulfilling demand.' },
      { title: 'The 40% test', summary: 'Ask users "How would you feel if you could no longer use this product?" 40%+ saying "very disappointed" = PMF.' },
      { title: 'PMF is a spectrum', summary: 'It\'s not binary. You can have strong PMF in one segment and weak in another.' },
    ],
    deepDive: [
      'Signs of PMF: organic growth, users asking for more features, high retention, word of mouth.',
      'Pre-PMF: focus on learning. Post-PMF: focus on scaling. Mixing these up kills companies.',
      'Finding PMF requires talking to 50+ customers and iterating rapidly on feedback.',
      'The biggest mistake is declaring PMF too early based on vanity metrics.',
      'PMF can be lost - markets change, competitors emerge, user needs evolve.',
    ]
  },
  {
    id: 'prioritization',
    name: 'Prioritization',
    episodeCount: 7,
    category: 'strategy',
    description: 'Frameworks for deciding what to build and when',
    keyInsights: [
      { title: 'Impact over effort matrices lie', summary: 'Teams overestimate impact and underestimate effort. Use data and past accuracy checks.' },
      { title: 'Say no by default', summary: 'Every "yes" is a "no" to something else. The default answer should be no unless compelling.' },
      { title: 'Stack rank, don\'t bucket', summary: 'Forced ranking creates clarity. "High priority" buckets become dumping grounds.' },
    ],
    deepDive: [
      'RICE (Reach, Impact, Confidence, Effort) works but requires honest confidence scoring.',
      'The best prioritization frameworks are simple and consistently applied.',
      'Weekly priority reviews prevent drift and maintain focus.',
      'Customer requests should inform, not dictate, priorities.',
      'Technical debt should be prioritized like features - with measurable impact.',
    ]
  },
  {
    id: 'okrs',
    name: 'OKRs',
    episodeCount: 10,
    category: 'strategy',
    description: 'Objectives and Key Results for goal-setting and alignment',
    keyInsights: [
      { title: 'Outcomes over outputs', summary: 'Key results should measure outcomes (user behavior change), not outputs (features shipped).' },
      { title: '70% is success', summary: 'If you hit 100% of OKRs, you\'re sandbagging. 70% means you stretched appropriately.' },
      { title: 'Fewer is better', summary: '3-5 objectives max. Each with 2-4 key results. More than that dilutes focus.' },
    ],
    deepDive: [
      'OKRs cascade from company → team → individual but shouldn\'t be dictated top-down.',
      'The objective is qualitative and inspiring. Key results are quantitative and measurable.',
      'Review OKRs weekly in standups, formally at mid-quarter and end of quarter.',
      'Failed OKRs should trigger learning, not punishment.',
      'Personal development OKRs can help retain top talent.',
    ]
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    episodeCount: 21,
    category: 'strategy',
    description: 'Frameworks for making better product and business decisions',
    keyInsights: [
      { title: 'Reversible vs irreversible', summary: 'Move fast on reversible decisions (Type 2). Take time on irreversible ones (Type 1).' },
      { title: 'Disagree and commit', summary: 'Once a decision is made, everyone commits fully - even those who disagreed.' },
      { title: 'Data-informed, not data-driven', summary: 'Data informs decisions but doesn\'t make them. Judgment still matters.' },
    ],
    deepDive: [
      'The best decisions have clear owners, deadlines, and documented rationale.',
      'Decision debt accumulates when decisions are avoided - address ambiguity quickly.',
      'Post-mortems on bad decisions build organizational learning.',
      'Seek dissent actively before deciding - assign a devil\'s advocate.',
      'Speed of decision-making is a competitive advantage.',
    ]
  },

  // Growth
  {
    id: 'growth-strategy',
    name: 'Growth Strategy',
    episodeCount: 33,
    category: 'growth',
    description: 'Scaling products and finding sustainable growth engines',
    keyInsights: [
      { title: 'Growth is not a hack', summary: 'Sustainable growth comes from product value, not tricks. Hacks create temporary spikes.' },
      { title: 'Find your growth loop', summary: 'The best products have self-reinforcing loops: users create value that attracts more users.' },
      { title: 'Retention is growth', summary: 'Acquiring users who churn is a leaky bucket. Fix retention before scaling acquisition.' },
    ],
    deepDive: [
      'Growth loops: content loop, viral loop, paid loop, sales loop - pick your primary engine.',
      'North Star Metric should capture the value exchange between product and user.',
      'Growth teams need autonomy to experiment but alignment with product strategy.',
      'Compounding growth (5% week over week) beats big launches.',
      'The best growth comes from making the product genuinely better.',
    ]
  },
  {
    id: 'product-led-growth',
    name: 'Product-Led Growth',
    episodeCount: 23,
    category: 'growth',
    description: 'Using the product itself as the primary driver of acquisition and retention',
    keyInsights: [
      { title: 'The product is the marketing', summary: 'In PLG, the product experience drives awareness, acquisition, and expansion.' },
      { title: 'Time to value is everything', summary: 'Users should reach their "aha moment" in minutes, not days.' },
      { title: 'Free isn\'t enough', summary: 'Freemium only works if free users can experience real value and naturally upgrade.' },
    ],
    deepDive: [
      'PLG requires product, marketing, sales, and CS to work as one integrated team.',
      'Self-serve onboarding should be as good as a sales demo.',
      'Product-qualified leads (PQLs) based on usage patterns outperform MQLs.',
      'Expansion revenue from existing users is the true PLG flywheel.',
      'PLG doesn\'t mean no sales - it means sales is enhanced by product data.',
    ]
  },
  {
    id: 'startup-growth',
    name: 'Startup Growth',
    episodeCount: 24,
    category: 'growth',
    description: 'Early-stage tactics for finding and scaling growth',
    keyInsights: [
      { title: 'Do things that don\'t scale', summary: 'Early growth comes from unscalable, high-touch activities that build deep user understanding.' },
      { title: 'Find your first 100 users', summary: 'The first 100 users should be hand-picked and obsessively served.' },
      { title: 'Narrow before broad', summary: 'Dominate a tiny niche before expanding. Facebook started at Harvard only.' },
    ],
    deepDive: [
      'The first users should be so enthusiastic they tell others without being asked.',
      'Early-stage metrics: engagement and retention matter more than growth rate.',
      'Pivot signals: good retention in one segment, bad in others - double down on what works.',
      'Fundraising milestone: demonstrable PMF in a focused segment.',
      'Speed of iteration is the startup\'s only advantage over incumbents.',
    ]
  },
  {
    id: 'experimentation',
    name: 'Experimentation',
    episodeCount: 17,
    category: 'growth',
    description: 'Running effective experiments to learn and improve',
    keyInsights: [
      { title: 'Hypothesis over intuition', summary: 'Every experiment needs a clear hypothesis: "If we do X, Y will happen because Z."' },
      { title: 'Sample size matters', summary: 'Most experiments are called too early. Wait for statistical significance.' },
      { title: 'Learn from losses', summary: 'Failed experiments that teach you something are more valuable than inconclusive wins.' },
    ],
    deepDive: [
      'Experimentation velocity: the best teams run 10+ experiments per week.',
      'Build an experimentation culture: celebrate learning, not just wins.',
      'Document all experiments in a searchable repository for institutional memory.',
      'Guardrail metrics prevent optimizing one thing at the expense of another.',
      'Sequential testing and multi-armed bandits can speed up learning.',
    ]
  },
  {
    id: 'retention',
    name: 'Retention',
    episodeCount: 9,
    category: 'growth',
    description: 'Keeping users engaged and coming back',
    keyInsights: [
      { title: 'Retention curves must flatten', summary: 'If your retention curve hits zero, you don\'t have a business. It must flatten at some level.' },
      { title: 'Activation predicts retention', summary: 'Users who complete key activation actions in week 1 retain 3-5x better.' },
      { title: 'Resurrection is possible', summary: 'Dormant users can be reactivated with the right triggers and timing.' },
    ],
    deepDive: [
      'Cohort analysis by acquisition channel reveals which users actually stick.',
      'Habit formation: map your product to existing user routines.',
      'The "magic moment" - find the one action most correlated with long-term retention.',
      'Churn surveys reveal why users leave but survivor bias means you\'re missing context.',
      'Engagement loops: notification → action → value → anticipation → return.',
    ]
  },
  {
    id: 'ab-testing',
    name: 'A/B Testing',
    episodeCount: 14,
    category: 'growth',
    description: 'Running rigorous experiments to optimize product performance',
    keyInsights: [
      { title: 'Test one variable at a time', summary: 'Multivariate tests require much larger samples. Start with single-variable A/B tests.' },
      { title: 'Beware of peeking', summary: 'Checking results too early inflates false positive rates. Set sample size upfront and wait.' },
      { title: 'Not everything should be tested', summary: 'Some decisions are too small or too obvious for the cost of a test.' },
    ],
    deepDive: [
      'Pre-registration of hypotheses prevents p-hacking and HARKing.',
      'Network effects can pollute experiments - account for spillover.',
      'Holdout groups measure cumulative impact of many small experiments.',
      'Minimum detectable effect: know what effect size you need before running.',
      'Experimentation platform investment pays off at scale.',
    ]
  },

  // Leadership
  {
    id: 'leadership',
    name: 'Leadership',
    episodeCount: 73,
    category: 'leadership',
    description: 'Leading teams and organizations effectively',
    keyInsights: [
      { title: 'Leaders set context, not control', summary: 'Provide the why and boundaries. Let teams figure out the how.' },
      { title: 'Vulnerability builds trust', summary: 'Admitting what you don\'t know makes others feel safe to do the same.' },
      { title: 'Your calendar is your values', summary: 'Where you spend time signals what matters. Audit it regularly.' },
    ],
    deepDive: [
      'The transition from IC to manager is the hardest - your value is now through others.',
      'Skip-level 1:1s give you unfiltered signal about team health.',
      'Great leaders create other leaders, not followers.',
      'Radical candor: care personally AND challenge directly.',
      'Presence and listening are underrated leadership skills.',
    ]
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    episodeCount: 52,
    category: 'leadership',
    description: 'Starting and building companies from zero',
    keyInsights: [
      { title: 'Start with a problem, not a solution', summary: 'Fall in love with the problem. Solutions can change; deep problem understanding is the asset.' },
      { title: 'Founder-market fit matters', summary: 'Why are YOU the right person to solve this? Unique insight or access is essential.' },
      { title: 'Survival = success early on', summary: 'Early-stage success is simply not dying. Extend runway, iterate fast, stay alive.' },
    ],
    deepDive: [
      'The best startup ideas seem bad at first - if obvious, incumbents would do it.',
      'Co-founder relationships are like marriages - choose carefully, invest heavily.',
      'Fundraising is a means, not an end. Bootstrap if you can.',
      'First hires define culture more than any values document.',
      'Know your unfair advantages and double down on them.',
    ]
  },
  {
    id: 'team-building',
    name: 'Team Building',
    episodeCount: 20,
    category: 'leadership',
    description: 'Creating high-performing product teams',
    keyInsights: [
      { title: 'Small teams ship faster', summary: 'Two-pizza teams (6-10 people) move faster than larger groups.' },
      { title: 'Hire for slope, not intercept', summary: 'Growth potential matters more than current skills, especially early.' },
      { title: 'Psychological safety first', summary: 'Teams where people feel safe to fail take more risks and innovate more.' },
    ],
    deepDive: [
      'Cross-functional teams (PM, design, eng) with clear ownership beat siloed functions.',
      'Team topologies: stream-aligned, platform, enabling, complicated-subsystem.',
      'Regular retrospectives surface team dysfunction before it becomes toxic.',
      'On-sites and offsites build relationships that lubricate remote work.',
      'The best teams have rituals: demos, celebrations, learning sessions.',
    ]
  },
  {
    id: 'hiring',
    name: 'Hiring',
    episodeCount: 19,
    category: 'leadership',
    description: 'Attracting and selecting the right talent',
    keyInsights: [
      { title: 'Hire slowly, fire quickly', summary: 'Take time to find the right person. Act fast when it\'s not working.' },
      { title: 'Skills can be taught, values can\'t', summary: 'Hire for culture add and values alignment. Train for skills.' },
      { title: 'Your network is your pipeline', summary: 'The best candidates come through referrals from great people.' },
    ],
    deepDive: [
      'Structured interviews with scorecards reduce bias and improve prediction.',
      'Work samples beat brain teasers for predicting job performance.',
      'Reference checks: ask "Would you enthusiastically rehire this person?"',
      'Sell the role to candidates as hard as you evaluate them.',
      'Diverse teams make better decisions - build inclusive hiring processes.',
    ]
  },
  {
    id: 'company-culture',
    name: 'Company Culture',
    episodeCount: 22,
    category: 'leadership',
    description: 'Building and maintaining organizational culture',
    keyInsights: [
      { title: 'Culture is behavior, not posters', summary: 'Culture is what people do when no one is watching, not what\'s written on the wall.' },
      { title: 'What you tolerate, you endorse', summary: 'Not addressing bad behavior signals that it\'s acceptable.' },
      { title: 'Culture debt compounds', summary: 'Small cultural compromises early become massive problems at scale.' },
    ],
    deepDive: [
      'Values should be specific enough to be controversial to some people.',
      'Rituals and artifacts reinforce culture: all-hands, demo days, recognition.',
      'Remote culture requires more intentional design than office culture.',
      'Performance reviews should assess culture contribution, not just outcomes.',
      'Culture evolves - intentionally update it as you scale.',
    ]
  },
  {
    id: 'founder-mode',
    name: 'Founder Mode',
    episodeCount: 7,
    category: 'leadership',
    description: 'Maintaining founder mentality as companies scale',
    keyInsights: [
      { title: 'Stay close to the details', summary: 'Great founders maintain deep product involvement even at scale.' },
      { title: 'Question conventional management', summary: 'What works for professional managers may not work for founders.' },
      { title: 'Skip levels intentionally', summary: 'Founders should go deep on specific areas rather than staying surface-level on everything.' },
    ],
    deepDive: [
      'Founder mode isn\'t micromanagement - it\'s selective deep involvement.',
      'Keep doing customer calls, even as CEO of a large company.',
      'Build a small group of trusted advisors who will be brutally honest.',
      'Protect time for thinking and creating, not just managing.',
      'Know when to shift between founder mode and manager mode.',
    ]
  },

  // Execution
  {
    id: 'product-development',
    name: 'Product Development',
    episodeCount: 46,
    category: 'execution',
    description: 'Building and shipping products effectively',
    keyInsights: [
      { title: 'Ship early, ship often', summary: 'Imperfect and shipped beats perfect and stuck. Learn from real usage.' },
      { title: 'Scope cuts, not timeline extensions', summary: 'When behind, cut scope. Extending timelines rarely works.' },
      { title: 'Dogfooding is essential', summary: 'Use your own product daily. You\'ll find issues users won\'t report.' },
    ],
    deepDive: [
      'Spec documents should be one page. Longer specs mean unclear thinking.',
      'The best PMs write the first draft themselves before collaborating.',
      'Weekly shipping creates rhythm and momentum.',
      'Feature flags enable shipping dark and progressive rollout.',
      'Post-launch: monitor closely for 48 hours, then do a retrospective.',
    ]
  },
  {
    id: 'user-experience',
    name: 'User Experience',
    episodeCount: 8,
    category: 'execution',
    description: 'Designing products that users love',
    keyInsights: [
      { title: 'Simple beats powerful', summary: 'Users want to accomplish tasks, not learn features. Reduce complexity.' },
      { title: 'Observe, don\'t just ask', summary: 'What users do matters more than what they say. Watch them use the product.' },
      { title: 'Reduce time to value', summary: 'Every click, every second of confusion is a chance for users to leave.' },
    ],
    deepDive: [
      'Jobs to be Done: understand the progress users are trying to make.',
      'User research: 5 users reveal 80% of usability problems.',
      'Design reviews should focus on user goals, not personal preferences.',
      'Accessibility isn\'t optional - it makes products better for everyone.',
      'Micro-copy matters enormously - error messages, button labels, empty states.',
    ]
  },
  {
    id: 'customer-research',
    name: 'Customer Research',
    episodeCount: 7,
    category: 'execution',
    description: 'Understanding customers deeply through research',
    keyInsights: [
      { title: 'Talk to customers weekly', summary: 'Every PM should do at least 2 customer conversations per week.' },
      { title: 'Ask about behavior, not preferences', summary: '"What did you do last time?" beats "What would you want?"' },
      { title: 'Segment ruthlessly', summary: 'Feedback from non-target users can lead you astray.' },
    ],
    deepDive: [
      'The Mom Test: ask about their life, not your idea. Don\'t lead the witness.',
      'Synthesize across many conversations - patterns matter, anecdotes mislead.',
      'Include engineers and designers in customer calls.',
      'Document insights in a searchable repository.',
      'Continuous discovery: research integrated into sprints, not waterfall phases.',
    ]
  },
  {
    id: 'innovation',
    name: 'Innovation',
    episodeCount: 12,
    category: 'execution',
    description: 'Creating breakthrough products and features',
    keyInsights: [
      { title: 'Innovation requires slack', summary: 'Overloaded teams can only iterate. Breakthrough needs time and space.' },
      { title: 'Adjacent possible', summary: 'The best innovations combine existing technologies in new ways.' },
      { title: 'Kill your darlings', summary: 'Be willing to cannibalize your own products before competitors do.' },
    ],
    deepDive: [
      'Innovation accounting: measure progress differently for new ventures.',
      'Separate explore teams from exploit teams with different metrics.',
      'Hackathons surface ideas but need follow-through to create impact.',
      'Study adjacent industries - innovation often comes from outside.',
      'First-mover advantage is overrated; fast-follower advantage is underrated.',
    ]
  },

  // Skills
  {
    id: 'communication',
    name: 'Communication',
    episodeCount: 10,
    category: 'skills',
    description: 'Communicating effectively as a product leader',
    keyInsights: [
      { title: 'Write to think', summary: 'Writing forces clarity. If you can\'t write it clearly, you don\'t understand it.' },
      { title: 'Repeat yourself', summary: 'Leaders must repeat key messages 7-10 times before they stick.' },
      { title: 'Adjust to your audience', summary: 'Engineers, execs, and customers need different framings of the same message.' },
    ],
    deepDive: [
      'The Pyramid Principle: lead with conclusion, then supporting points.',
      'Async communication (docs, Loom) scales better than synchronous meetings.',
      'Regular updates build trust even when there\'s no news.',
      'Narrative structure: situation, complication, resolution.',
      'Silence and pausing are powerful communication tools.',
    ]
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    episodeCount: 7,
    category: 'skills',
    description: 'Using narrative to inspire and persuade',
    keyInsights: [
      { title: 'Stories beat data', summary: 'People remember stories 22x better than facts alone. Lead with story, support with data.' },
      { title: 'Hero is the customer', summary: 'In product stories, the customer is the hero, you are the guide.' },
      { title: 'Conflict creates interest', summary: 'Every compelling story has tension. What problem are you solving?' },
    ],
    deepDive: [
      'Story structure: status quo → disruption → struggle → resolution → new normal.',
      'Use specific details and names to make stories concrete and memorable.',
      'Practice your stories - great storytelling requires rehearsal.',
      'Collect stories continuously - keep a note of customer moments.',
      'Internal storytelling aligns teams; external storytelling sells products.',
    ]
  },
  {
    id: 'feedback',
    name: 'Feedback',
    episodeCount: 7,
    category: 'skills',
    description: 'Giving and receiving effective feedback',
    keyInsights: [
      { title: 'Timely beats perfect', summary: 'Feedback given immediately is 10x more effective than feedback saved for reviews.' },
      { title: 'Behavior, not character', summary: 'Critique actions and outcomes, not personality or intentions.' },
      { title: 'Ask for it proactively', summary: 'Great performers actively seek critical feedback and act on it.' },
    ],
    deepDive: [
      'SBI framework: Situation, Behavior, Impact - keep feedback specific.',
      'Praise publicly, criticize privately - usually.',
      'Create feedback rituals: weekly 1:1s, project retros, 360 reviews.',
      'The best feedback includes specific examples and suggested alternatives.',
      'Receiving feedback: listen fully, ask questions, thank them, reflect later.',
    ]
  },
  {
    id: 'mentorship',
    name: 'Mentorship',
    episodeCount: 7,
    category: 'skills',
    description: 'Developing through mentor relationships',
    keyInsights: [
      { title: 'Multiple mentors for multiple dimensions', summary: 'No single mentor covers everything. Build a personal board of advisors.' },
      { title: 'Mentees drive the relationship', summary: 'Come with specific questions and prepared context. Make it easy to help you.' },
      { title: 'Pay it forward', summary: 'The best way to learn is to teach. Mentor others at earlier stages.' },
    ],
    deepDive: [
      'Find mentors through work, not cold outreach. Impress them first.',
      'Sponsors differ from mentors - sponsors advocate for you when you\'re not in the room.',
      'Peer mentoring circles can be as valuable as senior mentors.',
      'Regular cadence (monthly) beats sporadic catch-ups.',
      'Be update-able - share wins and progress, not just problems.',
    ]
  },

  // Career
  {
    id: 'career-development',
    name: 'Career Development',
    episodeCount: 40,
    category: 'career',
    description: 'Growing your product management career',
    keyInsights: [
      { title: 'Own your career', summary: 'No one cares about your career as much as you. Take initiative and drive it.' },
      { title: 'Optimize for learning', summary: 'Early career: prioritize learning rate over title or compensation.' },
      { title: 'Build T-shaped skills', summary: 'Broad awareness of many areas, deep expertise in 1-2.' },
    ],
    deepDive: [
      'Every 18 months, ask: Am I still learning at the rate I want?',
      'Build a portfolio of work you can reference - write about your projects.',
      'Network genuinely before you need it. Give before you ask.',
      'Know the market: what skills are valued, what roles are growing.',
      'Career transitions are easier than you think if you prepare.',
    ]
  },
  {
    id: 'career-growth',
    name: 'Career Growth',
    episodeCount: 7,
    category: 'career',
    description: 'Advancing to senior product roles',
    keyInsights: [
      { title: 'Impact over activity', summary: 'Senior roles are judged on outcomes achieved, not hours worked or features shipped.' },
      { title: 'Make your manager successful', summary: 'Help your manager succeed and they will advocate for your growth.' },
      { title: 'Get the difficult assignments', summary: 'Growth comes from stretch assignments that scare you a little.' },
    ],
    deepDive: [
      'Document your impact quantitatively - you\'ll need it for promotions.',
      'Shadow leaders in roles you aspire to.',
      'Executive presence: confidence, composure, and clarity under pressure.',
      'Politics is reality - learn to navigate organizational dynamics.',
      'The path isn\'t linear - lateral moves can unlock vertical growth.',
    ]
  },
  {
    id: 'personal-development',
    name: 'Personal Development',
    episodeCount: 5,
    category: 'career',
    description: 'Investing in yourself beyond work skills',
    keyInsights: [
      { title: 'Energy management > time management', summary: 'Manage your energy, not just your calendar. Know your peak hours.' },
      { title: 'Continuous learning compounds', summary: '30 minutes daily of reading/learning compounds dramatically over years.' },
      { title: 'Self-awareness is a superpower', summary: 'Know your strengths, weaknesses, triggers, and working style.' },
    ],
    deepDive: [
      'Executive coaching accelerates growth for those open to feedback.',
      'Journaling helps process experiences and develop self-awareness.',
      'Physical health impacts cognitive performance - prioritize it.',
      'Build routines that support focus: sleep, exercise, nutrition.',
      'Therapy isn\'t just for crisis - it\'s for optimization.',
    ]
  },
  {
    id: 'ai',
    name: 'AI in Products',
    episodeCount: 27,
    category: 'execution',
    description: 'Building AI-powered products and features',
    keyInsights: [
      { title: 'AI is a feature, not a product', summary: 'Customers buy solutions to problems, not AI. AI is how, not what.' },
      { title: 'Expect failure gracefully', summary: 'AI makes mistakes. Design for graceful failure and user correction.' },
      { title: 'Data is the moat', summary: 'Proprietary data creates defensibility. Models commoditize, data doesn\'t.' },
    ],
    deepDive: [
      'Start with use cases where 80% accuracy is acceptable - avoid high-stakes at first.',
      'User trust is earned incrementally - show AI reasoning when possible.',
      'Build feedback loops: user corrections improve the model.',
      'AI products need different metrics - precision, recall, user satisfaction.',
      'Hallucination is a feature, not a bug - know when creativity vs accuracy matters.',
    ]
  },
  {
    id: 'venture-capital',
    name: 'Venture Capital',
    episodeCount: 21,
    category: 'leadership',
    description: 'Understanding VCs and the fundraising process',
    keyInsights: [
      { title: 'VCs are pattern matchers', summary: 'They look for patterns of success. Understand what patterns they seek.' },
      { title: 'Fundraise from strength', summary: 'Raise when you don\'t need it. Desperation repels investors.' },
      { title: 'Warm intros only', summary: 'Cold outreach rarely works. Get introduced through portfolio founders.' },
    ],
    deepDive: [
      'VC math: they need 100x returns on winners to cover portfolio losses.',
      'Know your metrics cold: CAC, LTV, retention, growth rate, burn multiple.',
      'Due diligence goes both ways - interview VCs as much as they interview you.',
      'Term sheets matter: understand liquidation preferences, anti-dilution, board seats.',
      'The best VCs add value beyond money: introductions, recruiting, strategy.',
    ]
  },
  {
    id: 'remote-work',
    name: 'Remote Work',
    episodeCount: 10,
    category: 'skills',
    description: 'Thriving in distributed and remote teams',
    keyInsights: [
      { title: 'Over-communicate intentionally', summary: 'What happens naturally in offices must be designed in remote.' },
      { title: 'Async by default', summary: 'Synchronous should be the exception. Write things down.' },
      { title: 'Design for inclusion', summary: 'Remote workers can feel like second-class citizens. Prevent this actively.' },
    ],
    deepDive: [
      'Document decisions in writing - hallway conversations exclude remote folks.',
      'Video on for meetings builds connection; scheduled camera-off time prevents fatigue.',
      'Regular in-person gatherings (quarterly) are essential for relationship building.',
      'Time zone overlap: ensure at least 4 hours of overlap for synchronous work.',
      'Remote work requires more explicit performance expectations.',
    ]
  },
];

export interface TopicConnection {
  from: string;
  to: string;
  strength: number;
  relationship?: string;
}

export const connections: TopicConnection[] = [
  // Strategy connections
  { from: 'product-strategy', to: 'product-market-fit', strength: 3, relationship: 'Strategy drives PMF discovery' },
  { from: 'product-strategy', to: 'prioritization', strength: 3, relationship: 'Strategy informs priorities' },
  { from: 'product-strategy', to: 'decision-making', strength: 2, relationship: 'Strategic framework for decisions' },
  { from: 'product-strategy', to: 'okrs', strength: 2, relationship: 'Strategy translates to OKRs' },
  { from: 'product-strategy', to: 'growth-strategy', strength: 3, relationship: 'Product and growth aligned' },
  { from: 'product-market-fit', to: 'customer-research', strength: 3, relationship: 'Research validates PMF' },
  { from: 'product-market-fit', to: 'startup-growth', strength: 2, relationship: 'PMF enables scaling' },
  { from: 'prioritization', to: 'okrs', strength: 2, relationship: 'OKRs guide priorities' },
  { from: 'prioritization', to: 'decision-making', strength: 2, relationship: 'Prioritization is decision-making' },
  { from: 'okrs', to: 'leadership', strength: 2, relationship: 'Leaders set OKRs' },
  
  // Growth connections
  { from: 'growth-strategy', to: 'product-led-growth', strength: 3, relationship: 'PLG is a growth model' },
  { from: 'growth-strategy', to: 'startup-growth', strength: 3, relationship: 'Early vs late-stage growth' },
  { from: 'growth-strategy', to: 'retention', strength: 3, relationship: 'Retention powers growth' },
  { from: 'growth-strategy', to: 'experimentation', strength: 2, relationship: 'Experiments find growth' },
  { from: 'product-led-growth', to: 'retention', strength: 2, relationship: 'PLG requires strong retention' },
  { from: 'product-led-growth', to: 'user-experience', strength: 2, relationship: 'UX drives PLG' },
  { from: 'experimentation', to: 'ab-testing', strength: 3, relationship: 'A/B is experimentation method' },
  { from: 'experimentation', to: 'product-development', strength: 2, relationship: 'Build-measure-learn' },
  { from: 'retention', to: 'customer-research', strength: 2, relationship: 'Understanding drives retention' },
  { from: 'startup-growth', to: 'entrepreneurship', strength: 2, relationship: 'Founders drive early growth' },
  { from: 'startup-growth', to: 'venture-capital', strength: 2, relationship: 'Growth attracts funding' },
  
  // Leadership connections
  { from: 'leadership', to: 'team-building', strength: 3, relationship: 'Leaders build teams' },
  { from: 'leadership', to: 'decision-making', strength: 3, relationship: 'Leaders make decisions' },
  { from: 'leadership', to: 'company-culture', strength: 3, relationship: 'Leaders shape culture' },
  { from: 'leadership', to: 'hiring', strength: 2, relationship: 'Leaders drive hiring' },
  { from: 'leadership', to: 'communication', strength: 2, relationship: 'Communication is leadership' },
  { from: 'leadership', to: 'mentorship', strength: 2, relationship: 'Leaders develop others' },
  { from: 'entrepreneurship', to: 'venture-capital', strength: 3, relationship: 'Startups raise capital' },
  { from: 'entrepreneurship', to: 'founder-mode', strength: 3, relationship: 'Founder leadership style' },
  { from: 'company-culture', to: 'hiring', strength: 2, relationship: 'Culture through hiring' },
  { from: 'company-culture', to: 'team-building', strength: 2, relationship: 'Culture shapes teams' },
  { from: 'company-culture', to: 'remote-work', strength: 2, relationship: 'Remote culture design' },
  { from: 'team-building', to: 'hiring', strength: 2, relationship: 'Hire to build teams' },
  { from: 'team-building', to: 'mentorship', strength: 2, relationship: 'Teams develop through mentorship' },
  { from: 'founder-mode', to: 'leadership', strength: 2, relationship: 'Founder leadership style' },
  
  // Execution connections
  { from: 'product-development', to: 'user-experience', strength: 3, relationship: 'UX shapes development' },
  { from: 'product-development', to: 'experimentation', strength: 2, relationship: 'Ship and learn' },
  { from: 'product-development', to: 'innovation', strength: 2, relationship: 'Innovation through building' },
  { from: 'product-development', to: 'ai', strength: 2, relationship: 'AI-powered features' },
  { from: 'customer-research', to: 'user-experience', strength: 3, relationship: 'Research informs UX' },
  { from: 'innovation', to: 'entrepreneurship', strength: 2, relationship: 'Startups innovate' },
  { from: 'ai', to: 'innovation', strength: 2, relationship: 'AI enables innovation' },
  
  // Skills connections
  { from: 'communication', to: 'storytelling', strength: 3, relationship: 'Stories communicate' },
  { from: 'communication', to: 'feedback', strength: 2, relationship: 'Feedback is communication' },
  { from: 'storytelling', to: 'leadership', strength: 2, relationship: 'Leaders tell stories' },
  { from: 'feedback', to: 'team-building', strength: 2, relationship: 'Feedback builds teams' },
  { from: 'mentorship', to: 'career-development', strength: 3, relationship: 'Mentors develop careers' },
  { from: 'remote-work', to: 'communication', strength: 2, relationship: 'Remote requires communication' },
  
  // Career connections
  { from: 'career-development', to: 'career-growth', strength: 3, relationship: 'Development enables growth' },
  { from: 'career-development', to: 'personal-development', strength: 2, relationship: 'Personal and professional' },
  { from: 'career-growth', to: 'mentorship', strength: 2, relationship: 'Mentors accelerate growth' },
  { from: 'career-growth', to: 'leadership', strength: 2, relationship: 'Growing into leadership' },
];

export const getTotalEpisodes = () => 269;

export const getTopicsByCategory = (category: TopicCategory): Topic[] => 
  topics.filter(t => t.category === category);

export const getTopTenTopics = (): Topic[] => 
  [...topics].sort((a, b) => b.episodeCount - a.episodeCount).slice(0, 10);
