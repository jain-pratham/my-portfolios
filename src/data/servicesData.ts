export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServicePageCta {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ServicePageData {
  slug: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  description: string;
  features: ServiceFeature[];
  benefits: string[];
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  cta?: ServicePageCta;
}

export const aiServices: Record<string, ServicePageData> = {
  'ai-consultancy': {
    slug: 'ai-consultancy',
    eyebrow: 'AI Services',
    title: 'AI Consultancy',
    subtitle:
      'Turn AI ambition into a practical, measurable roadmap with the right priorities, governance model, and delivery plan.',
    description:
      'Our AI consultancy engagements help leadership, product, and engineering teams move from curiosity to clarity. We assess business objectives, operational bottlenecks, data readiness, security considerations, and delivery constraints so your AI strategy is grounded in commercial value instead of trend-driven experimentation.',
    features: [
      {
        title: 'Executive Discovery Workshops',
        description:
          'Facilitate structured stakeholder sessions to align business goals, technical realities, delivery risks, and investment expectations.'
      },
      {
        title: 'Use-Case Prioritization',
        description:
          'Rank opportunities by ROI, complexity, data readiness, operational impact, and time-to-value so teams focus on the right first wins.'
      },
      {
        title: 'AI Readiness Assessment',
        description:
          'Evaluate infrastructure, internal workflows, governance maturity, and data quality to identify blockers before implementation begins.'
      },
      {
        title: 'Solution Architecture Planning',
        description:
          'Define the right mix of models, retrieval patterns, orchestration, security controls, and integration layers for your environment.'
      },
      {
        title: 'Governance and Risk Frameworks',
        description:
          'Recommend approval flows, compliance guardrails, evaluation standards, and ownership models that support responsible deployment.'
      },
      {
        title: 'Phased Delivery Roadmap',
        description:
          'Translate strategy into clear milestones, pilot scopes, success metrics, and rollout phases that make delivery easier to fund and execute.'
      }
    ],
    benefits: [
      'Avoid expensive proof-of-concepts that are disconnected from real business outcomes.',
      'Align decision-makers around a single roadmap, budget logic, and implementation sequence.',
      'Reduce delivery risk with clearer architecture, governance, and change-management planning.',
      'Identify high-value use cases that can produce early wins and long-term strategic leverage.',
      'Create a practical foundation for vendor selection, internal resourcing, and execution ownership.',
      'Move from AI exploration to a credible, board-ready investment narrative much faster.'
    ],
    seoTitle: 'AI Consultancy | Core4ix',
    seoDescription:
      'Strategic AI consulting, roadmap planning, readiness assessments, and solution architecture for organizations building reliable AI initiatives.',
    cta: {
      title: 'Need clarity before you invest in AI delivery?',
      description:
        'We help you define the business case, technical approach, governance model, and rollout path that make the next step obvious.',
      primaryLabel: 'Book a Strategy Call',
      primaryHref: '/contactus',
      secondaryLabel: 'View Projects',
      secondaryHref: '/projects'
    }
  },
  'ai-integration': {
    slug: 'ai-integration',
    eyebrow: 'AI Services',
    title: 'AI Integration',
    subtitle:
      'Embed AI into existing products, workflows, and internal systems without disrupting operations, security, or user trust.',
    description:
      'We integrate AI capabilities into the software your teams already depend on, whether that means support automation, knowledge assistants, intelligent search, process acceleration, or model-backed recommendations. The focus is not just adding AI, but making it reliable, observable, secure, and genuinely useful in production.',
    features: [
      {
        title: 'Platform and System Integration',
        description:
          'Connect AI services with CRMs, ERPs, support desks, internal dashboards, document systems, and custom business platforms.'
      },
      {
        title: 'Workflow Automation Design',
        description:
          'Map repetitive or high-friction business processes and redesign them with AI-assisted routing, generation, classification, or retrieval.'
      },
      {
        title: 'Retrieval and Context Pipelines',
        description:
          'Build document ingestion, vector search, contextual prompting, and permission-aware retrieval to ground responses in trusted data.'
      },
      {
        title: 'Security and Access Controls',
        description:
          'Implement role-based access, safe data handling, redaction rules, audit logs, and approval checkpoints for enterprise usage.'
      },
      {
        title: 'Observability and Quality Monitoring',
        description:
          'Track usage, latency, failure modes, feedback signals, and business outcomes so integrations remain dependable after launch.'
      },
      {
        title: 'Adoption and Rollout Support',
        description:
          'Launch in phases with user enablement, fallback mechanisms, and clear success criteria that improve adoption across teams.'
      }
    ],
    benefits: [
      'Accelerate operations without replacing the systems your teams already know and trust.',
      'Improve adoption by embedding AI directly into the workflows where work already happens.',
      'Maintain control through secure, observable, and governed production implementations.',
      'Shorten time-to-value with phased rollout plans and measurable automation outcomes.',
      'Reduce manual effort in support, operations, reporting, and knowledge-heavy processes.',
      'Create reusable integration patterns that can scale across departments over time.'
    ],
    seoTitle: 'AI Integration | Core4ix',
    seoDescription:
      'Production-ready AI integrations for internal tools, customer platforms, document systems, and workflow automation.',
    cta: {
      title: 'Ready to integrate AI into your current platform?',
      description:
        'We design and ship AI-enabled workflows that fit your systems, security model, operational requirements, and product experience.',
      primaryLabel: 'Start Integration Planning',
      primaryHref: '/contactus',
      secondaryLabel: 'Talk to Us',
      secondaryHref: '/contactus'
    }
  },
  'ai-ml-development': {
    slug: 'ai-ml-development',
    eyebrow: 'AI Services',
    title: 'AI/ML Development',
    subtitle:
      'Build custom AI and machine learning systems tailored to your data, workflows, and product goals.',
    description:
      'We design and deliver custom AI/ML systems for prediction, recommendation, classification, forecasting, optimization, and intelligent product features. Our approach covers the full lifecycle, from data engineering and model experimentation to inference services, evaluation frameworks, deployment workflows, and operational support.',
    features: [
      {
        title: 'Custom Model Development',
        description:
          'Create domain-specific models and learning pipelines tuned to the signals, constraints, and business logic unique to your organization.'
      },
      {
        title: 'Data Engineering Foundations',
        description:
          'Prepare clean, traceable training and inference pipelines with validation, transformation, labeling, and version-aware workflows.'
      },
      {
        title: 'Feature Engineering and Experimentation',
        description:
          'Design features, benchmarks, and controlled experiments that improve model performance and support better decision-making.'
      },
      {
        title: 'Inference APIs and Services',
        description:
          'Expose models through scalable APIs, background jobs, and service layers that integrate smoothly with products and internal tools.'
      },
      {
        title: 'Evaluation and Feedback Loops',
        description:
          'Measure quality with repeatable benchmarks, human review signals, offline evaluation, and production monitoring frameworks.'
      },
      {
        title: 'MLOps and Lifecycle Support',
        description:
          'Set up deployment, versioning, retraining, rollback, and monitoring practices that support long-term maintainability.'
      }
    ],
    benefits: [
      'Ship AI capabilities designed for your exact use case instead of settling for generic off-the-shelf behavior.',
      'Improve reliability with disciplined data handling, evaluation workflows, and model governance practices.',
      'Create reusable model services that can support multiple products, teams, and business functions.',
      'Build a stronger foundation for iteration, retraining, compliance, and long-term operational success.',
      'Turn raw business data into predictive systems that can influence decisions and automate routine analysis.',
      'Reduce rework by building model, API, and infrastructure layers together from the start.'
    ],
    seoTitle: 'AI & ML Development | Core4ix',
    seoDescription:
      'Custom AI and machine learning development for predictive systems, model-backed platforms, data products, and intelligent business applications.',
    cta: {
      title: 'Looking for a team to build custom AI systems?',
      description:
        'We can help scope, build, validate, and operationalize AI/ML solutions that fit your data maturity and product roadmap.',
      primaryLabel: 'Discuss Your Use Case',
      primaryHref: '/contactus',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contactus'
    }
  },
  'ai-agent-development': {
    slug: 'ai-agent-development',
    eyebrow: 'AI Services',
    title: 'AI Agent Development',
    subtitle:
      'Create intelligent agents that reason over tools, data, and workflows to automate higher-value work with proper control.',
    description:
      'We build production-grade AI agents for operations, support, research, internal productivity, sales enablement, and multi-step business workflows. These are not simple chatbots. They are orchestrated systems that can retrieve context, call tools, follow rules, request approvals, and hand work to humans when appropriate.',
    features: [
      {
        title: 'Agent Opportunity Mapping',
        description:
          'Identify where agentic systems add real value, including process scope, autonomy boundaries, escalation rules, and success metrics.'
      },
      {
        title: 'Tool-Using Workflows',
        description:
          'Enable agents to search knowledge bases, update records, trigger actions, analyze inputs, and coordinate multi-step tasks safely.'
      },
      {
        title: 'Prompt and Policy Design',
        description:
          'Define task instructions, safety constraints, fallback logic, and escalation policies that guide dependable behavior.'
      },
      {
        title: 'Human-in-the-Loop Controls',
        description:
          'Blend automation with review checkpoints so high-impact decisions remain visible, auditable, and easy to override.'
      },
      {
        title: 'Guardrails and Observability',
        description:
          'Add audit logs, traceability, failure handling, analytics, and monitoring to keep agents reliable in production.'
      },
      {
        title: 'Operational Rollout Support',
        description:
          'Launch with controlled pilots, approval workflows, stakeholder enablement, and iteration plans informed by real usage.'
      }
    ],
    benefits: [
      'Automate multi-step workflows that go well beyond simple chat or static prompt chains.',
      'Increase team productivity with agents that can take action while respecting approval boundaries.',
      'Deploy with greater confidence through monitoring, auditability, fallback behavior, and human oversight.',
      'Reduce repetitive coordination work across support, operations, research, and internal service teams.',
      'Create reusable agent patterns that can expand across departments instead of solving one-off tasks only.',
      'Build a scalable automation layer that improves responsiveness without losing operational control.'
    ],
    seoTitle: 'AI Agent Development | Core4ix',
    seoDescription:
      'AI agent design and development for tool-using workflows, approval-based automation, knowledge work, and production-ready orchestration.',
    cta: {
      title: 'Want to explore an agent-based workflow for your business?',
      description:
        'We can identify the right use case, design the orchestration, define the guardrails, and launch a safe production-ready agent.',
      primaryLabel: 'Plan an Agent Build',
      primaryHref: '/contactus',
      secondaryLabel: 'See Our Work',
      secondaryHref: '/projects'
    }
  },
  'generative-ai': {
    slug: 'generative-ai',
    eyebrow: 'AI Services',
    title: 'Generative AI',
    subtitle:
      'Design content, search, summarization, and conversational experiences powered by modern generative AI.',
    description:
      'We build generative AI solutions for customer engagement, internal knowledge access, document workflows, research acceleration, and product differentiation. Each solution is designed around user experience, retrieval quality, governance, and operational reliability so it performs well beyond the demo stage.',
    features: [
      {
        title: 'Conversational Product Experiences',
        description:
          'Create assistants and chat interfaces that deliver branded, context-aware interactions across web, mobile, and internal platforms.'
      },
      {
        title: 'Knowledge Retrieval Systems',
        description:
          'Combine document ingestion, indexing, retrieval, and prompt orchestration so responses stay grounded in your own content.'
      },
      {
        title: 'Content and Document Automation',
        description:
          'Support drafting, rewriting, summarization, structured generation, and workflow-based document processing for internal teams.'
      },
      {
        title: 'Prompt and Experience Design',
        description:
          'Refine response quality, tone, flow, and interaction patterns to match your brand and the expectations of your users.'
      },
      {
        title: 'Evaluation and Quality Controls',
        description:
          'Introduce testing frameworks, review checkpoints, version management, and feedback loops that keep quality consistent.'
      },
      {
        title: 'Production Deployment Architecture',
        description:
          'Launch with security, observability, cost controls, rate management, and fallback strategies for dependable day-to-day usage.'
      }
    ],
    benefits: [
      'Launch differentiated generative AI experiences that fit your brand, audience, and workflows.',
      'Reduce hallucination risk through grounded retrieval, evaluation, and strong quality controls.',
      'Accelerate content-heavy and knowledge-heavy processes without sacrificing governance.',
      'Create a scalable base for future copilots, assistants, and AI-driven product features.',
      'Improve internal productivity by making information easier to access, summarize, and reuse.',
      'Move from fragmented experimentation to a coherent generative AI capability across the business.'
    ],
    seoTitle: 'Generative AI Solutions | Core4ix',
    seoDescription:
      'Generative AI development for assistants, knowledge systems, document workflows, conversational interfaces, and product experiences.',
    cta: {
      title: 'Ready to launch a generative AI experience?',
      description:
        'We help define the right user flow, retrieval strategy, quality model, and production setup for a dependable release.',
      primaryLabel: 'Launch a GenAI Project',
      primaryHref: '/contactus',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contactus'
    }
  }
};

export const aiServiceList = Object.values(aiServices);

export const coreServices: Record<string, ServicePageData> = {
  'web-development': {
    slug: 'web-development',
    eyebrow: 'Core Services',
    title: 'Web Development',
    subtitle:
      'Modern websites and web applications built for performance, scalability, and measurable business growth.',
    description:
      'We design and develop custom web platforms that combine strong UX, dependable engineering, and scalable architecture. Whether you need a marketing site, customer portal, internal dashboard, SaaS platform, or enterprise workflow system, we build digital products that are fast, secure, maintainable, and aligned with business outcomes.',
    features: [
      {
        title: 'Custom Web Platforms',
        description:
          'Build bespoke websites, portals, and business applications aligned to your product goals, workflows, and growth plans.'
      },
      {
        title: 'Experience-Led Frontend Development',
        description:
          'Create polished, responsive user experiences that work cleanly across desktop, tablet, and mobile touchpoints.'
      },
      {
        title: 'Backend and API Engineering',
        description:
          'Develop secure APIs, admin systems, and application logic that support real operational complexity without sacrificing maintainability.'
      },
      {
        title: 'CMS and Content Workflows',
        description:
          'Implement manageable publishing, approval, and content update flows so teams can operate efficiently after launch.'
      },
      {
        title: 'Performance and SEO Foundations',
        description:
          'Improve speed, crawlability, technical SEO, and core web vitals to support discoverability and conversion performance.'
      },
      {
        title: 'Scalable Architecture',
        description:
          'Set up maintainable codebases, deployment patterns, and technical foundations that support long-term growth and iteration.'
      }
    ],
    benefits: [
      'Launch a web experience tailored to your exact business needs instead of relying on rigid templates.',
      'Improve conversion and retention with responsive, performance-focused user experiences.',
      'Support future product growth with clean backend systems and scalable architecture.',
      'Reduce long-term maintenance friction through structured engineering and deployment decisions.',
      'Enable marketing, sales, and operations teams with more effective content and workflow tooling.',
      'Ship faster with one team covering strategy, UX, development, and launch support.'
    ],
    seoTitle: 'Web Development | Core4ix',
    seoDescription:
      'Custom web development for modern websites, portals, SaaS products, dashboards, and scalable business applications.',
    cta: {
      title: 'Need a high-performing web platform for your business?',
      description:
        'We can scope, design, and build a website or web application that is fast, scalable, secure, and ready for growth.',
      primaryLabel: 'Start Your Web Project',
      primaryHref: '/contactus',
      secondaryLabel: 'View Portfolio',
      secondaryHref: '/projects'
    }
  },
  'app-development': {
    slug: 'app-development',
    eyebrow: 'Core Services',
    title: 'App Development',
    subtitle:
      'Build mobile applications that deliver smooth user experiences, reliable performance, and strong business utility.',
    description:
      'We develop Android and iOS applications for businesses building customer products, internal tools, field-service platforms, and mobile-first workflows. Our focus is on usability, performance, integration, and release readiness so your app supports both user expectations and operational reality.',
    features: [
      {
        title: 'Product and Mobile Strategy',
        description:
          'Define user flows, feature scope, release priorities, and technical tradeoffs before development begins.'
      },
      {
        title: 'Native and Cross-Platform Delivery',
        description:
          'Build cohesive mobile experiences across platforms while balancing speed, performance, and maintainability.'
      },
      {
        title: 'UX and Interface Implementation',
        description:
          'Translate business processes into intuitive mobile interactions that reduce friction and improve user completion rates.'
      },
      {
        title: 'Backend and Service Integration',
        description:
          'Connect apps with APIs, authentication systems, admin panels, payment gateways, and third-party business services.'
      },
      {
        title: 'Testing and Release Preparation',
        description:
          'Prepare apps for QA, device validation, store compliance, deployment workflows, and smoother production launches.'
      },
      {
        title: 'Post-Launch Iteration Support',
        description:
          'Support analytics review, issue triage, feature refinement, and scaling plans after the first public release.'
      }
    ],
    benefits: [
      'Deliver mobile experiences that align with user expectations and day-to-day business workflows.',
      'Reduce development overhead with clearer scope definition and reusable technical architecture.',
      'Integrate mobile applications smoothly with your existing tools, systems, and operational data.',
      'Launch with more confidence using structured testing, release planning, and support workflows.',
      'Improve retention and usability through better mobile UX and performance-conscious implementation.',
      'Set up a foundation for future app growth instead of rebuilding after the first release.'
    ],
    seoTitle: 'App Development | Core4ix',
    seoDescription:
      'Android and iOS app development for customer products, internal tools, and scalable mobile experiences.',
    cta: {
      title: 'Planning a mobile app for your users or team?',
      description:
        'We can help take your mobile product from idea to launch with the right strategy, technical foundation, and UX direction.',
      primaryLabel: 'Discuss Your App',
      primaryHref: '/contactus',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contactus'
    }
  },
  ecommerce: {
    slug: 'ecommerce',
    eyebrow: 'Core Services',
    title: 'E-Commerce',
    subtitle:
      'Conversion-focused storefronts and commerce systems designed to drive revenue and streamline operations.',
    description:
      'We build e-commerce experiences that combine strong merchandising, secure checkout systems, customer-friendly journeys, and dependable backend workflows. From direct-to-consumer storefronts to catalog-heavy commerce platforms, we help brands sell more effectively while simplifying operational management.',
    features: [
      {
        title: 'Storefront Experience Design',
        description:
          'Create intuitive, brand-aligned shopping experiences that balance storytelling, trust, and conversion optimization.'
      },
      {
        title: 'Catalog and Product Discovery',
        description:
          'Structure navigation, search, filters, variants, and product content so customers can find the right items faster.'
      },
      {
        title: 'Checkout and Payment Integration',
        description:
          'Implement secure payment gateways, shipping logic, tax flows, and transaction experiences designed for reliability.'
      },
      {
        title: 'Inventory and Order Operations',
        description:
          'Support fulfillment, stock visibility, order management, and operational reporting that simplify internal workflows.'
      },
      {
        title: 'Promotions and Merchandising Tools',
        description:
          'Enable campaigns, bundles, offers, and pricing workflows that support growth without creating administrative chaos.'
      },
      {
        title: 'Performance and Commerce Analytics',
        description:
          'Improve conversion tracking, funnel visibility, and merchandising decisions with cleaner analytics foundations.'
      }
    ],
    benefits: [
      'Increase conversion potential with better storefront UX and simpler customer decision paths.',
      'Give internal teams cleaner tools for managing products, inventory, promotions, and orders.',
      'Support scale with dependable payment, fulfillment, and backend commerce architecture.',
      'Build a store that reflects your brand while staying practical for daily operations.',
      'Reduce friction in checkout and merchandising flows that directly affect revenue performance.',
      'Create a stronger digital commerce foundation for future campaigns, categories, and market expansion.'
    ],
    seoTitle: 'E-Commerce Development | Core4ix',
    seoDescription:
      'Custom e-commerce development for online stores, digital commerce systems, and conversion-focused shopping experiences.',
    cta: {
      title: 'Looking to build or improve your online store?',
      description:
        'We can create a scalable e-commerce experience that supports revenue growth, operational efficiency, and long-term flexibility.',
      primaryLabel: 'Build Your Store',
      primaryHref: '/contactus',
      secondaryLabel: 'View Portfolio',
      secondaryHref: '/projects'
    }
  },
  'erp-solutions': {
    slug: 'erp-solutions',
    eyebrow: 'Core Services',
    title: 'ERP Solutions',
    subtitle:
      'Business process automation and ERP systems that connect departments, workflows, and operational visibility.',
    description:
      'We help organizations modernize fragmented processes through ERP implementation, custom workflow systems, and process automation tailored to real business operations. The goal is to reduce manual effort, improve data consistency, and give leadership a clearer picture of how the business is running.',
    features: [
      {
        title: 'Business Process Mapping',
        description:
          'Analyze current workflows and identify where digitization, standardization, and automation can create measurable gains.'
      },
      {
        title: 'ERP Configuration and Customization',
        description:
          'Adapt modules, workflows, permissions, and interfaces to fit your teams instead of forcing rigid off-the-shelf processes.'
      },
      {
        title: 'Cross-System Integration',
        description:
          'Connect ERP workflows with finance, HR, procurement, inventory, sales, and external business tools.'
      },
      {
        title: 'Approval and Automation Flows',
        description:
          'Reduce delays and manual coordination with structured routing, notifications, and process-based decision logic.'
      },
      {
        title: 'Reporting and Operational Dashboards',
        description:
          'Build reporting views that improve oversight, accountability, and decision-making across departments and leadership teams.'
      },
      {
        title: 'Adoption and Change Enablement',
        description:
          'Support rollout planning, user onboarding, and process documentation so teams can adopt new systems more smoothly.'
      }
    ],
    benefits: [
      'Reduce manual work and disconnected systems across departments and operational functions.',
      'Improve business visibility with centralized workflows, cleaner reporting, and better process control.',
      'Align ERP functionality to your business model instead of over-adapting your teams to software limitations.',
      'Create a stronger digital foundation for scale, compliance, auditability, and internal governance.',
      'Speed up approvals, handoffs, and information flow across finance, operations, procurement, and management.',
      'Give leadership better data quality and more confidence in day-to-day operational reporting.'
    ],
    seoTitle: 'ERP Solutions | Core4ix',
    seoDescription:
      'ERP solutions, workflow automation, dashboards, and business process systems for modern organizations.',
    cta: {
      title: 'Need to simplify complex internal operations?',
      description:
        'We can plan and build ERP-driven systems that bring structure, automation, visibility, and stronger process control to the business.',
      primaryLabel: 'Plan an ERP Solution',
      primaryHref: '/contactus',
      secondaryLabel: 'Talk to Us',
      secondaryHref: '/contactus'
    }
  },
  'cloud-services': {
    slug: 'cloud-services',
    eyebrow: 'Core Services',
    title: 'Cloud Services',
    subtitle:
      'Scalable cloud architecture, deployment workflows, and infrastructure support for modern digital products.',
    description:
      'We help businesses design, deploy, and evolve secure cloud environments that support application performance, reliability, and long-term growth. From architecture decisions and CI/CD pipelines to observability and cost planning, we build infrastructure that is practical for engineering teams and dependable in production.',
    features: [
      {
        title: 'Cloud Architecture Design',
        description:
          'Design infrastructure that balances performance, scalability, security, resilience, and operational simplicity.'
      },
      {
        title: 'Environment and Deployment Strategy',
        description:
          'Set up release workflows, staging environments, and deployment patterns that improve delivery speed and confidence.'
      },
      {
        title: 'CI/CD Pipeline Enablement',
        description:
          'Implement reliable automation for testing, builds, releases, and rollback support across development lifecycles.'
      },
      {
        title: 'Observability and Reliability',
        description:
          'Add monitoring, alerting, logging, and operational checks that help teams catch issues before customers do.'
      },
      {
        title: 'Security and Access Management',
        description:
          'Apply infrastructure permissions, secrets management, network protections, and operational safeguards suited to production use.'
      },
      {
        title: 'Cost and Capacity Planning',
        description:
          'Structure environments that can scale efficiently while keeping spend visible and operational overhead under control.'
      }
    ],
    benefits: [
      'Improve application reliability with production-ready infrastructure and observability patterns.',
      'Deploy faster and more safely through structured release workflows and automation pipelines.',
      'Support growth with cloud architecture built for scale, resilience, and maintainability.',
      'Reduce long-term maintenance friction through cleaner infrastructure and access management decisions.',
      'Give engineering teams better operational visibility and faster incident response capabilities.',
      'Control infrastructure costs more effectively without limiting future product expansion.'
    ],
    seoTitle: 'Cloud Services | Core4ix',
    seoDescription:
      'Cloud architecture, deployment pipelines, observability, and scalable infrastructure services for modern software delivery.',
    cta: {
      title: 'Want a stronger cloud foundation for your platform?',
      description:
        'We can design, deploy, and optimize infrastructure that supports application performance, reliability, security, and growth.',
      primaryLabel: 'Talk Cloud Strategy',
      primaryHref: '/contactus',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contactus'
    }
  }
};

export const coreServiceList = Object.values(coreServices);
