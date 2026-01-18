
import { GoogleGenAI } from "@google/genai";
import { NumerologyResults, UserInput } from "../types";

export async function generateDetailedReading(user: UserInput, results: NumerologyResults): Promise<string> {
  // 1. API Key එක Vite වලට ගැලපෙන ලෙස import.meta.env මගින් ලබා ගැනීම
  // Vercel එකේදී Key එකේ නම VITE_GEMINI_API_KEY ලෙස තිබිය යුතුය.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Act as an expert Chaldean Numerologist. Generate a professional and mystical numerology reading in Sinhala (සිංහල).

    User Profile:
    - Full Name: ${user.fullName}
    - DOB: ${user.dob}

    Numbers Calculated:
    - Life Path: ${results.lifePath}
    - Birth Number: ${results.birthNumber}
    - Destiny Number (නාම අංකය): ${results.destinyNumber}
    - Soul Urge: ${results.soulUrgeNumber}
    - Personality: ${results.personalityNumber}
    - Maturity: ${results.maturityNumber}
    - Personal Year: ${results.personalYear}
    - Lucky Numbers: ${results.luckyNumbers}
    - Lucky Days: ${results.luckyDays}
    - Current Energy Phase of Name: ${results.energyPhase}

    Requirements for the response (Must be in Sinhala):
    1. **සම්පූර්ණ නමේ තේරුම සහ ශක්තිය**: Give a detailed description of the overall meaning and vibration of the name "${user.fullName}".
    2. **නමේ කොටස් විග්‍රහය**: Break down the name into parts (e.g., first name, middle, last) and describe the vibration of each part individually.
    3. **නම් කාණ්ඩ 8 යටතේ විග්‍රහය**: Analyze the person's life across these 8 specific categories:
       (1) ධනය සහ වෘත්තිය (Wealth & Career)
       (2) සෞඛ්‍යය (Health)
       (3) ප්‍රේමය සහ විවාහය (Love & Marriage)
       (4) පවුල් ජීවිතය (Family Life)
       (5) අධ්‍යාත්මික වර්ධනය (Spiritual Growth)
       (6) සමාජීය පිළිගැනීම (Social Recognition)
       (7) අභ්‍යන්තර ශක්තිය සහ පෞරුෂය (Inner Strength & Personality)
       (8) අනාගත අභියෝග සහ විසඳුම් (Future Challenges & Solutions)
    4. **නමේ වර්තමාන ශක්ති අවධිය (Energy Phase)**: Integrate the phase "${results.energyPhase}" into the reading, explaining how it affects the person right now.
    5. **වාසනාවන්ත තොරතුරු**: Advice on using the lucky numbers (${results.luckyNumbers}) and lucky days (${results.luckyDays}).
    6. **අවසාන උපදේශනය**: A mystical and encouraging closing summary.

    Use Markdown formatting for headings and structure.
  `;

  try {
    // 2. Model එකේ නම නිවැරදි කිරීම (gemini-1.5-flash භාවිතා කිරීම වඩාත් වේගවත්ය)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "කණගාටුයි, පද්ධතියේ දෝෂයක් පවතී. කරුණාකර ඔබගේ API Key එක Vercel හි VITE_GEMINI_API_KEY ලෙස ඇතුළත් කර ඇති බව තහවුරු කරන්න.";
  }
}
