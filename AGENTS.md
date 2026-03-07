---
description: ## PrecisionFit AI -- Guardrail Agents Overview
---



In the PrecisionFit ecosystem, autonomous AI "Agents" are strictly assigned to **guardrail, safety, and validation enforcement**. They monitor the deterministic Feature Services to protect user health, ensure data accuracy, and prevent AI hallucinations.

------------------------------------------------------------------------

## 1. Safety Guardrail Agent

The critical health protection layer of the application.

### Responsibilities:
- Monitor user data for extreme calorie deficits.
- Detect overtraining patterns based on volume and frequency.
- Issue HR threshold alerts.
- Issue neutral safety warnings.

**Example:** "This intensity level is high. Consider adequate recovery."
**Safety Rule:** No medical diagnosis language permitted.

------------------------------------------------------------------------

## 2. Input Validation Agent

The primary gatekeeper for incoming data to prevent bad entries.

### Responsibilities:
- Validate numerical data ranges against human physical limits.
- Flag logical inconsistencies (e.g., logging 1000 calories burned in 5 minutes).

**Safety Rule:** No data is auto-committed without human confirmation.

------------------------------------------------------------------------

## 3. Vision Confidence Agent

Monitors the outputs of the Vision Extraction/OCR Service.

### Responsibilities:
- Evaluate the confidence score of extracted numbers.
- Visually highlight uncertain fields in the UI for the user.

**Safety Rule:** If confidence < 0.85 → force manual verification.

------------------------------------------------------------------------

## 4. Scientific Integrity Agent

Maintains the strict boundary between estimated metrics and mathematical reality.

### Responsibilities:
- Generate discrepancy reports between device-reported calories and formula-based calories.
- Flag unrealistic performance metrics that defy established MET formulas.

**Safety Rule:** No AI guessing allowed; enforce calculation transparency.

------------------------------------------------------------------------

## 5. Compliance & Disclaimers Agent

Ensures the platform's outputs remain strictly advisory and legally compliant.

### Responsibilities:
- Inject necessary estimation disclaimers into generated reports.
- Ensure automated trend text avoids prescriptive medical or dietetic actions.

**Safety Rule:** Photo-based food estimation is advisory only and never authoritative.

------------------------------------------------------------------------

## 6. UI/UX Consistency Agent (Antigravity Development Guardrail)

A strict set of core directives that the AI Development Agent (Antigravity) must *always* follow locally when generating app code, to prevent "AI slop" and guarantee a unified, premium SaaS application.

### Responsibilities & Strict Rules:
- **Consistent Theming:** Always use the predefined Tailwind CSS + Shadcn UI design system. Never invent ad-hoc colors, random margins, or arbitrary inline styles.
- **Premium Aesthetics:** Emphasize high-contrast, clean typography (e.g., Inter, Outfit, Roboto), subtle borders, modern glassmorphism (sparingly), and professional dark/light modes.
- **No Hallucinated UIs:** Stick exclusively to standard, intuitive modern SaaS patterns (e.g., clean dashboards, sidebar navigation, responsive data tables, well-defined card layouts).
- **Component Reusability:** Build and reuse atomic React server/client components. Do not copy and paste large blocks of repetitive HTML.

**Safety Rule:** Never deviate from the established visual design system. If a UI element feels like "basic, unpolished startup MVP slop," the agent must refuse it and rewrite it to meet premium, state-of-the-art SaaS standards.

------------------------------------------------------------------------

# System Principles

1.  **No assumptions**: Data is either verified or flagged.
2.  **No autonomous health decisions**: The system advises, the human decides.
3.  **Human confirmation required**: The user always has the final say on their ledger.
4.  **Formula transparency**: Users must be able to see *how* a metric was calculated.
5.  **Error visibility**: Uncertainty is highlighted, not hidden.
6.  **Trend-based insights only**: Advice is based on macro patterns, not micro fluctuations.
