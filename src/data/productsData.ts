export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductPageCta {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ProductPageData {
  slug: string;
  eyebrow?: string;
  name: string;
  image?: string;
  category: string;
  summary: string;
  description: string;
  // --- NEW FIELDS FOR PROBLEM SOLVING ---
  problemStatement?: string; 
  problemsSolved?: string[];
  // --------------------------------------
  highlights: string[];
  modules: ProductFeature[];
  outcomes: string[];
  audience: string[];
  seoTitle?: string;
  seoDescription?: string;
  cta?: ProductPageCta;
}

export const products: Record<string, ProductPageData> = {
  'vetra-ai': {
  slug: 'vetra-ai',
  eyebrow: 'Products',
  name: 'Vetra AI',
  image: '/project/vetraai.png',
  category: 'AI Hiring Platform',
  summary: 'An autonomous AI hiring agent that parses, ranks, and qualifies talent in milliseconds with bias-free evaluation.',
  
  description:
    'Vetra AI is a next-generation recruitment intelligence platform that automates the entire hiring pipeline. From ingesting resumes to semantic skill mapping and unbiased ranking, the system transforms hiring into a fast, data-driven process without manual intervention.',

  problemStatement: 'Hiring Should Not Be Slow, Biased, or Manual',

  problemsSolved: [
    'Manual resume screening consumes hundreds of hours and slows down hiring cycles.',
    'Keyword-based filtering misses high-quality candidates due to lack of semantic understanding.',
    'Bias in hiring decisions affects fairness and candidate quality.',
    'Disconnected hiring workflows create inefficiencies between HR, managers, and teams.'
  ],

  highlights: [
    'Autonomous AI hiring pipeline',
    'Semantic skill mapping using vectors',
    'Bias-free candidate evaluation',
    'Real-time candidate ranking'
  ],

  modules: [
    {
      title: 'Universal Ingestion Engine',
      description: 'Upload resumes in PDF, DOCX, or JSON formats. The system automatically parses and normalizes all data into a structured format.'
    },
    {
      title: 'Semantic Mapping Engine',
      description: 'Uses vector embeddings to understand skill relationships beyond keywords, enabling context-aware candidate matching.'
    },
    {
      title: 'Bias-Free Ranking System',
      description: 'Candidates are scored based on merit using anonymized evaluation, ensuring fair and explainable hiring decisions.'
    },
    {
      title: 'Automated Outreach Engine',
      description: 'Top candidates are automatically identified and sent personalized interview invitations without manual effort.'
    }
  ],

  outcomes: [
    'Reduce hiring time from weeks to minutes.',
    'Improve candidate quality through intelligent ranking.',
    'Eliminate bias from hiring decisions.',
    'Automate 90% of recruitment workflow.'
  ],

  audience: [
    'Tech companies hiring at scale.',
    'HR and talent acquisition teams.',
    'Startups needing fast hiring pipelines.',
    'Organizations focused on data-driven recruitment.'
  ],

  seoTitle: 'Vetra AI | Autonomous Hiring Platform',
  seoDescription: 'AI-powered hiring platform for resume parsing, semantic skill mapping, and bias-free candidate ranking.',

  cta: {
    title: 'Ready to automate your hiring pipeline?',
    description: 'Discover how Vetra AI can transform your recruitment process with speed, accuracy, and fairness.',
    primaryLabel: 'Initialize Agent',
    primaryHref: '#inquire',
    secondaryLabel: 'View Demo',
    secondaryHref: '/contactus'
  }
},
  'insightpulse-ai': {
    slug: 'insightpulse-ai',
    eyebrow: 'Products',
    name: 'InsightPulse AI',
    image: '/image.png', 
    category: 'AI Insights Platform',
    summary: 'An AI-enabled insights layer that helps teams monitor business signals, generate summaries, and support faster decisions.',
    description:
      'InsightPulse AI brings together data snapshots, summaries, alerts, and intelligence workflows so teams can respond faster with more context.',
    // NEW PROBLEM DATA
    problemStatement: 'Turn "Data Drowning" into Decisive Action',
    problemsSolved: [
      'Decision-makers overwhelmed by raw data without clear "so-what" summaries.',
      'Delayed reactions to market shifts because signals are buried in static reports.',
      'Inconsistent analysis across departments leading to misaligned strategies.',
      'Valuable team time wasted on manual data aggregation and basic reporting.'
    ],
    highlights: ['AI summaries', 'Data intelligence', 'Alerting workflows', 'Decision support'],
    modules: [
      {
        title: 'Insight Summaries',
        description: 'Generate concise summaries from structured and operational data for faster decision-making.'
      },
      {
        title: 'Signal Monitoring',
        description: 'Track key business triggers and surface events that need attention in real time.'
      },
      {
        title: 'AI Assist Layer',
        description: 'Support teams with contextual guidance, analysis prompts, and operational recommendations.'
      },
      {
        title: 'Reporting Workspace',
        description: 'Bring reports, observations, and follow-up actions into a single product workspace.'
      }
    ],
    outcomes: [
      'Speed up analysis and reduce reporting friction.',
      'Help decision-makers act on trends and anomalies faster.',
      'Improve visibility into important business signals.',
      'Create a reusable AI insights layer across departments.'
    ],
    audience: [
      'Teams that rely on reporting, monitoring, and recurring reviews.',
      'Businesses that want AI-assisted operational visibility.',
      'Decision-makers who need summarized signals instead of raw data noise.',
      'Organizations looking to productize internal intelligence workflows.'
    ],
    seoTitle: 'InsightPulse AI | Core4ix Products',
    seoDescription: 'AI insights platform for summaries, monitoring, reporting, and decision-support workflows.',
    cta: {
      title: 'Want AI-powered visibility into your business signals?',
      description: 'We can walk you through InsightPulse AI, its use cases, and how it can fit your internal workflow model.',
      primaryLabel: 'Schedule a Walkthrough',
      primaryHref: '#inquire',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contactus'
    }
  }
};

export const productList = Object.values(products);
