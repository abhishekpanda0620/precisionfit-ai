# FEATURE_SERVICES.md

## PrecisionFit AI -- Feature Services Overview

These modules represent the core functional features and deterministic engines of the PrecisionFit platform. Unlike AI Guardrail Agents, these services handle structured data routing, calculation, and raw feature execution.

------------------------------------------------------------------------

## 1. Input Service

Responsible for collecting and routing raw data to guardrails and calculation engines.

### Responsibilities:
- Accept cardio image uploads
- Route images to Vision Extraction
- Accept manual structured inputs (time, distance, calories, HR)

------------------------------------------------------------------------

## 2. Vision Extraction Service (AI)

Processes treadmill/watch images to extract text and digits.

### Responsibilities:
- Extract numbers via OCR/vision model
- Return structured JSON output: `{ "duration": 32, "distance_km": 4.2, "calories_device": 310, "avg_hr": 158, "confidence": 0.87 }`

------------------------------------------------------------------------

## 3. Calculation Engine

Performs scientifically validated, deterministic computations.

### Responsibilities:
- Recalculate calories using strict formula-based models (e.g., MET-based calculations)
- Running calculation: weight × distance
- Store both device-reported and formula-based calories

------------------------------------------------------------------------

## 4. Nutrition Engine

Handles food logging via structured dataset matching.

### Responsibilities:
- Interface with verified nutrition databases (e.g., USDA)
- Gram-based logging and macro breakdown calculation
- Daily total computation

------------------------------------------------------------------------

## 5. Trend & Analytics Engine

Operates only on aggregated historical data to build charts and calculate indices.

### Responsibilities:
- Calculate weekly averages and rolling calorie trends
- Compute Training Load Index
- Detect plateau or surplus/deficit patterns via statistical analysis

------------------------------------------------------------------------

## 6. Reporting Service

Generates scheduled summaries and UI reports.

### Responsibilities:
- Compile progress charts and strength progressions
- Generate calorie balance summaries and recovery scores
