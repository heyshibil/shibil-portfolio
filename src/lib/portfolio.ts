export type Project = {
  slug: string;
  name: string;
  type: string;
  year: string;
  description: string;
  details: string[];
  stack: string[];
  challenge: string;
  lessons: string;
  liveHref?: string;
  githubHref?: string;
  coverSrc?: string;
};

export const projects: Project[] = [
  {
    slug: "ascend", name: "ASCEND", type: "Skill intelligence platform", year: "2026",
    description: "A full-stack system for tracking technical growth, scanning repositories, parsing resumes, and analyzing code quality.",
    details: ["9 backend modules", "50+ REST endpoints", "200+ tests", "Redis + BullMQ processing"],
    stack: ["Node.js", "TypeScript", "Express", "React", "PostgreSQL", "MongoDB", "Prisma", "Redis", "BullMQ", "AWS Lambda", "Docker"],
    challenge: "I designed a sandbox for untrusted JavaScript and Python by isolating code execution in AWS Lambda with configurable timeouts, rather than allowing arbitrary execution in the main application.",
    lessons: "ASCEND taught me to think in systems: separating responsibilities, designing for data consistency, handling asynchronous workloads, and making individual services work together reliably.",
    liveHref: "https://ascend-skill-manager-vercel.vercel.app/", githubHref: "https://github.com/heyshibil/ASCEND-SKILL-MANAGER/",
  },
  {
    slug: "decibel", name: "DECIBEL", type: "Full-stack commerce platform", year: "2025",
    description: "A complete e-commerce product, from discovery and secure checkout to order operations and role-gated administration.",
    details: ["25+ REST endpoints", "Razorpay payments", "JWT + RBAC", "Admin dashboard"],
    stack: ["MongoDB", "Express", "React", "Node.js", "JWT", "Razorpay", "Cloudinary"],
    challenge: "The core challenge was making the account and checkout flows trustworthy: access and refresh tokens, role-based permissions, OTP verification, password recovery, rate-limited login, and payment integration all needed to work as one system.",
    lessons: "DECIBEL showed me that a product is not separate frontend and backend tasks. Authentication, payments, data, user experience, and operations need to work together reliably.",
    liveHref: "https://decibel-ecommerce-frontend.vercel.app/", githubHref: "https://github.com/heyshibil/DECIBEL-MERN-Ecommerce",
  },
  {
    slug: "jobo", name: "JOBO", type: "Job-application workspace", year: "2026",
    description: "A focused, Trello-inspired board for organizing and managing job applications with clarity.",
    details: ["Next.js", "Tailwind CSS", "Workflow design", "In progress"], stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    challenge: "JOBO is a small product with a focused constraint: make a complicated, emotional job-search process feel calm and manageable rather than adding more clutter.",
    lessons: "I am using it to explore how thoughtful information hierarchy and focused interactions can make a simple tool genuinely useful.",
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
