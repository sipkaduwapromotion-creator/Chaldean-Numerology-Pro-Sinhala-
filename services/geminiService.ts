import { GoogleGenAI } from "@google/genai";
import { NumerologyResults, UserInput } from "../types";

export async function generateDetailedReading(user: UserInput, results: NumerologyResults): Promise<string> {
  // 1. Vite සඳහා නිවැරදිව API Key එක ලබා ගැනීම
  // මතක ඇතුව Vercel එකේ Variable Name එක VITE_GEMINI_API_KEY ලෙසම දෙන්න.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  if (!apiKey) {
    return "කණගාටුයි, API Key එක සොයාගත නොහැක. කරුණාකර Vercel Settings පරීක්ෂා කරන්න.";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Act as an expert Chaldean Numerologist. Generate a professional and mystical numerology reading in Sinhala (සිංහල).

    User Profile:
    - Full Name: ${user.fullName}
    - DOB: ${user.dob}

    Numbers Calculated:
    - Life Path: ${results.lifePath}
    - Birth Number: ${results.birthNumber}
    - Destiny Number: ${results.destinyNumber}
    - Soul Urge: ${results.soulUrgeNumber}
    - Personality: ${results.personalityNumber}
    - Maturity: ${results.maturityNumber}
    - Personal Year: ${results.personalYear}
    - Lucky Numbers: ${results.luckyNumbers}
    - Lucky Days: ${results.luckyDays}
    - Current Energy Phase: ${results.energyPhase}

    Requirements (In Sinhala):
    1. සම්පූර්ණ නමේ තේරුම සහ ශක්තිය.
    2. නමේ කොටස් විග්‍රහය.
    3. අංශ 8 ක් යටතේ විග්‍රහය (ධනය, සෞඛ්‍යය, ප්‍රේමය, පවුල, අධ්‍යාත්මික, සමාජීය, පෞරුෂය, අනාගතය).
    4. වර්තමාන ශක්ති අවධිය.
    5. වාසනාවන්ත තොරතුරු සහ අවසාන උපදේශය.
  `;

  try {
    // 2. දැනට පවතින ස්ථාවර Model එක භාවිතා කිරීම
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "කණගාටුයි, පද්ධතියේ දෝෂයක් පවතී. කරුණාකර පසුව උත්සාහ කරන්න.";
  }
}
