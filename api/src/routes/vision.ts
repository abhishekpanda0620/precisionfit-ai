import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { SarvamAIService } from '../utils/sarvam';

const router = Router();

router.post('/extract', asyncHandler(async (req, res) => {
  const { imageBase64 } = req.body;
  
  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    console.error('SARVAM_API_KEY is missing in environment variables.');
    return res.status(500).json({ error: 'Sarvam AI key is not configured.' });
  }

  try {
    console.log('Calling Sarvam AI Document Parsing API...');
    
    // 1. Extract text using the new Service
    const extractedText = await SarvamAIService.extractDocumentText(imageBase64, apiKey);
    
    // 2. Extract metrics via robust regex (Cardio focus)
    // Looking for duration, distance, calories, avg heart rate.
    // Handles standard text (20 mins) or descriptive text (value of '359', or '13:18' (Time))
    
    // Time regex: catches "13:18" or "20 mins"
    const durationMatch = extractedText.match(/(\d{1,2}:\d{2})|(\d+)\s*(min|minutes)/i);
    // Distance regex: "DIST. KM with a value of '359'" or "5.5 km"
    const distanceMatch = extractedText.match(/(?:DIST.*?|distance.*?)(?:value of '?|:?\s*)(\d+(\.\d+)?)|(\d+(\.\d+)?)\s*(km|kilometers|mi|miles)/i);
    // Calories regex
    const caloriesMatch = extractedText.match(/(?:CAL.*?|calories.*?)(?:value of '?|:?\s*)(\d+)|(\d+)\s*(cal|kcal|calories|cals)/i);
    // Heart rate / Pulse regex
    const hrMatch = extractedText.match(/(?:PULSE.*?|heart rate.*?)(?:value of '?|:?\s*)(\d+)|(\d+)\s*(bpm|hr)/i);

    let durationMinutes = null;
    if (durationMatch) {
      if (durationMatch[1] && durationMatch[1].includes(':')) {
        const [mins] = durationMatch[1].split(':'); // ignore seconds for simplicity
        durationMinutes = parseInt(mins, 10);
      } else {
        durationMinutes = parseInt(durationMatch[2] || durationMatch[0], 10);
      }
    }

    const distanceKm = distanceMatch ? parseFloat(distanceMatch[1] || distanceMatch[3]) : null;
    const caloriesDevice = caloriesMatch ? parseInt(caloriesMatch[1] || caloriesMatch[2]) : null;
    const avgHeartRate = hrMatch ? parseInt(hrMatch[1] || hrMatch[2]) : null;

    // 3. Calculate Confidence Score (Vision Confidence Agent Rules)
    // We start at 1.0. For every missing critical field, we drop confidence by 0.25.
    let confidenceScore = 1.0;
    if (!durationMinutes) confidenceScore -= 0.25;
    if (!distanceKm) confidenceScore -= 0.25;
    if (!caloriesDevice) confidenceScore -= 0.25;
    if (!avgHeartRate) confidenceScore -= 0.25;

    res.json({
      durationMinutes,
      distanceKm,
      caloriesDevice,
      avgHeartRate,
      confidenceScore: Math.max(0, confidenceScore), // return between 0.0 and 1.0
      rawText: extractedText
    });
  } catch (error) {
    console.error('Vision extraction failed:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
}));

export default router;
