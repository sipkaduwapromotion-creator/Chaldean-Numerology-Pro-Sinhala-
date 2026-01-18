
export interface NumerologyResults {
  lifePath: number;
  birthNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  birthdayNumber: number;
  compoundNumbers: {
    name: number;
    birth: number;
  };
  nameBreakdown: {
    vowels: { char: string; value: number }[];
    consonants: { char: string; value: number }[];
    vowelSum: number;
    consonantSum: number;
  };
  karmicDebts: number[];
  masterNumbers: number[];
  energyPhase: string;
  luckyNumbers: string;
  luckyDays: string;
}

export interface UserInput {
  fullName: string;
  dob: string;
}
