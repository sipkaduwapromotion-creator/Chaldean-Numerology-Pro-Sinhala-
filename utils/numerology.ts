
import { NumerologyResults } from '../types';

const CHALDEAN_MAP: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export function reduceToSingle(num: number, keepMaster = true): number {
  if (keepMaster && [11, 22, 33].includes(num)) return num;
  if (num < 10) return num;
  const sum = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceToSingle(sum, keepMaster);
}

export function calculateChaldeanValue(str: string): number {
  return str.toLowerCase().split('').reduce((acc, char) => {
    return acc + (CHALDEAN_MAP[char] || 0);
  }, 0);
}

function getLuckyDetails(birthNumber: number) {
  const single = reduceToSingle(birthNumber, false);
  const luckyMap: Record<number, { numbers: string, days: string }> = {
    1: { numbers: "1, 10, 19, 28", days: "ඉරිදා, සඳුදා" },
    2: { numbers: "2, 11, 20, 29", days: "සඳුදා, සිකුරාදා" },
    3: { numbers: "3, 12, 21, 30", days: "බ්‍රහස්පතින්දා, අඟහරුවාදා" },
    4: { numbers: "1, 4, 13, 22", days: "සෙනසුරාදා, ඉරිදා" },
    5: { numbers: "5, 14, 23", days: "බදාදා, සිකුරාදා" },
    6: { numbers: "6, 15, 24", days: "සිකුරාදා, අඟහරුවාදා" },
    7: { numbers: "2, 7, 16, 25", days: "සඳුදා, ඉරිදා" },
    8: { numbers: "8, 17, 26", days: "සෙනසුරාදා, සඳුදා" },
    9: { numbers: "9, 18, 27", days: "අඟහරුවාදා, සිකුරාදා" }
  };
  return luckyMap[single] || { numbers: "විචල්‍යයි", days: "විචල්‍යයි" };
}

export function calculateNumerology(name: string, dobStr: string): NumerologyResults {
  const dob = new Date(dobStr);
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();

  const lifePathSum = String(day).split('').concat(String(month).split(''), String(year).split(''))
    .reduce((acc, d) => acc + parseInt(d), 0);
  const lifePath = reduceToSingle(lifePathSum);

  const birthNumber = reduceToSingle(day);
  const sanitizedName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  const nameChars = sanitizedName.split('');
  const vowelsBreakdown: { char: string; value: number }[] = [];
  const consonantsBreakdown: { char: string; value: number }[] = [];
  
  nameChars.forEach(char => {
    const val = CHALDEAN_MAP[char] || 0;
    if (VOWELS.includes(char)) {
      vowelsBreakdown.push({ char, value: val });
    } else {
      consonantsBreakdown.push({ char, value: val });
    }
  });

  const vowelSum = vowelsBreakdown.reduce((sum, item) => sum + item.value, 0);
  const consonantSum = consonantsBreakdown.reduce((sum, item) => sum + item.value, 0);
  const nameValue = vowelSum + consonantSum;

  const destinyNumber = reduceToSingle(nameValue);
  const soulUrgeNumber = reduceToSingle(vowelSum);
  const personalityNumber = reduceToSingle(consonantSum);
  const maturityNumber = reduceToSingle(lifePath + destinyNumber);

  const currentYear = new Date().getFullYear();
  const personalYear = reduceToSingle(day + month + currentYear);
  const personalMonth = reduceToSingle(personalYear + (new Date().getMonth() + 1));
  const personalDay = reduceToSingle(personalMonth + new Date().getDate());

  const phases = [
    "පරිවර්තනය සහ නිමාව (Completion)", 
    "නව ආරම්භයන් සහ ස්වයං-ප්‍රකාශනය (New Beginnings)", 
    "සහයෝගීතාවය සහ සබඳතා වර්ධනය (Cooperation)", 
    "නිර්මාණාත්මක ප්‍රකාශනය සහ ප්‍රීතිය (Creativity)", 
    "විනය, පදනම සහ වෙහෙස මහන්සි වී වැඩ කිරීම (Foundation)", 
    "වෙනස්කම්, නිදහස සහ නව අත්දැකීම් (Change)", 
    "වගකීම්, පවුල සහ සේවය (Responsibility)", 
    "අධ්‍යාත්මික සෙවීම සහ විශ්ලේෂණය (Introspection)", 
    "සෞභාග්‍යය, කාර්යක්ෂමතාවය සහ ජයග්‍රහණය (Abundance)"
  ];
  const phaseIndex = (destinyNumber + personalYear) % 9;
  const energyPhase = phases[phaseIndex];

  const lucky = getLuckyDetails(day);

  return {
    lifePath,
    birthNumber,
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    maturityNumber,
    personalYear,
    personalMonth,
    personalDay,
    birthdayNumber: day,
    compoundNumbers: {
      name: nameValue,
      birth: day
    },
    nameBreakdown: {
      vowels: vowelsBreakdown,
      consonants: consonantsBreakdown,
      vowelSum,
      consonantSum
    },
    karmicDebts: [13, 14, 16, 19].filter(n => [lifePathSum, nameValue, day].includes(n)),
    masterNumbers: [11, 22, 33].filter(n => [lifePath, destinyNumber, birthNumber].includes(n)),
    energyPhase,
    luckyNumbers: lucky.numbers,
    luckyDays: lucky.days
  };
}
