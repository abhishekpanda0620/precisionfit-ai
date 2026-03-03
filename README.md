# PrecisionFit AI

PrecisionFit AI is a **safety-first, AI-powered fitness tracking SaaS platform** designed for high-accuracy logging, validation, and performance analytics. 

Unlike conventional fitness apps that hallucinate missing data or make dangerous medical assumptions, PrecisionFit prioritizes transparency, scientific formulas, and human confirmation loops via specialized internal AI Guardrail Agents.

![PrecisionFit AI](https://via.placeholder.com/800x400?text=PrecisionFit+AI) *(Design Placeholder)*

---

## 🏗️ Architecture Stack

This project is built using a modern **Turborepo** monorepo structure to enforce a strict boundary between the frontend UI and backend calculations.

- **Monorepo Manager:** [Turborepo](https://turbo.build/repo)
- **Frontend (`/web`):** [Next.js](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend (`/api`):** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Shared Package (`/packages/shared`):** Pure TypeScript interfaces for cross-app typing.
- **Database & Auth (Upcoming):** [Supabase](https://supabase.com/) (PostgreSQL)

---

## 🛡️ Core Philosophy

1. **No assumptions:** Data is either verified or flagged.
2. **No autonomous health decisions:** The system advises, the human decides.
3. **Human confirmation required:** The user always has the final say.
4. **Formula transparency:** Users must be able to see *how* a metric was calculated.
5. **Error visibility:** Uncertainty in data (like OCR extraction) is highlighted, not hidden.

*For more details on our architectural AI Agents and feature rollout, please see:*
- [`AGENTS.md`](./AGENTS.md): The internal AI Guardrails protecting user safety.
- [`FEATURE_SERVICES.md`](./FEATURE_SERVICES.md): The deterministic formula and logic engines.
- [`ROADMAP.md`](./ROADMAP.md): Our multi-phase SaaS development plan.

---

## 🚀 Getting Started

### Prerequisites

You will need `Node.js` (v20+ recommended) and `npm` installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhishekpanda0620/precisionfit-ai.git
   cd precisionfit-ai
   ```

2. Install all monorepo dependencies:
   ```bash
   npm install
   ```

### Running the Application

To boot up both the **Express Backend** and **Next.js Frontend** simultaneously, run:

```bash
npm run dev
```

- **Frontend Application:** Available at `http://localhost:3000`
- **Backend API Server:** Available at `http://localhost:3001`

---

## 📂 Repository Structure

```text
precisionfit-ai/
├── api/                  # Express.js backend server (Port 3001)
│   ├── src/index.ts      # API entry point
│   └── package.json
├── web/                  # Next.js App Router frontend (Port 3000)
│   ├── src/              # React components and Next.js pages
│   └── package.json
├── packages/
│   └── shared/           # Cross-boundary TypeScript types and utilities
├── turbo.json            # Monorepo task pipeline configuration
├── AGENTS.md             # AI Guardrail specifications
├── FEATURE_SERVICES.md   # Feature and deterministic engine specifications
└── ROADMAP.md            # Multi-phase project roadmap
```

---

## 📜 Roadmap Reference

We are currently working on **Phase 1: Core Logging Engine** (High-Accuracy Manual Tracking, Formula-based calculations). See `ROADMAP.md` for our full 6-phase rollout strategy.

---

*PrecisionFit AI - Engineered for accuracy. Designed for discipline.*
