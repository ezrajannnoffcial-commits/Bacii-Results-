import { ExamResult, SubjectScore } from '../types';

export type TrackType = 'Science' | 'Social Science';

/**
 * Official Ministry of Education, Youth and Sport (MoEYS) Cambodia
 * Bac II Examination Scoring Specifications
 * 
 * Maximum Total Score for both Science and Social Science tracks is exactly 500.00 points.
 * Minimum passing score is 237 points ((500 - 25) / 2 = 237.5, rounded to 237).
 * 
 * Overall Grade / Mention thresholds:
 * Grade A (ល្អប្រសើរ - Outstanding): 427 to 500 points
 * Grade B (ល្អណាស់ - Very Good): 380 to 426 points
 * Grade C (ល្អ - Good): 332 to 379 points
 * Grade D (ល្អបង្គួរ - Fair): 285 to 331 points
 * Grade E (មធ្យម - Pass): 237 to 284 points
 * Grade F (ធ្លាក់ - Fail): 0 to 236 points
 */

export interface SubjectConfig {
  id: string;
  nameKm: string;
  nameEn: string;
  maxScore: number;
}

// Official MoEYS Science Track subjects & coefficients (Total max = 500)
export const SCIENCE_SUBJECTS_CONFIG: SubjectConfig[] = [
  { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', maxScore: 125 },
  { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', maxScore: 75 },
  { id: 'phys', nameKm: 'រូបវិទ្យា', nameEn: 'Physics', maxScore: 75 },
  { id: 'chem', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry', maxScore: 75 },
  { id: 'bio', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology', maxScore: 75 },
  { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', maxScore: 50 },
  { id: 'lang', nameKm: 'ភាសាបរទេស (អង់គ្លេស)', nameEn: 'Foreign Language (English)', maxScore: 25 }
];

// Official MoEYS Social Science Track subjects & coefficients (Total max = 500)
export const SOCIAL_SUBJECTS_CONFIG: SubjectConfig[] = [
  { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', maxScore: 125 },
  { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', maxScore: 75 },
  { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', maxScore: 75 },
  { id: 'geo', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography', maxScore: 75 },
  { id: 'morals', nameKm: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', nameEn: 'Moral and Civics', maxScore: 75 },
  { id: 'earth', nameKm: 'ផែនដី និងបរិស្ថានវិទ្យា', nameEn: 'Earth Science', maxScore: 50 },
  { id: 'lang', nameKm: 'ភាសាបរទេស (អង់គ្លេស)', nameEn: 'Foreign Language (English)', maxScore: 25 }
];

export const MAX_BACII_TOTAL_SCORE = 500.00;
export const PASSING_SCORE_THRESHOLD = 237.00;

/**
 * Calculates subject letter grade based on percentage of max score
 */
export function calculateSubjectGrade(score: number, maxScore: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (maxScore <= 0) return 'F';
  const ratio = (score / maxScore) * 100;
  if (ratio >= 85) return 'A';
  if (ratio >= 75) return 'B';
  if (ratio >= 65) return 'C';
  if (ratio >= 55) return 'D';
  if (ratio >= 45) return 'E';
  return 'F';
}

/**
 * Calculates overall exam letter grade (Mention) according to official MoEYS brackets
 */
export function calculateOverallGrade(totalScore: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (totalScore >= 427) return 'A';
  if (totalScore >= 380) return 'B';
  if (totalScore >= 332) return 'C';
  if (totalScore >= 285) return 'D';
  if (totalScore >= 237) return 'E';
  return 'F';
}

/**
 * Creates realistic default subject results for Science track (approx Grade B, 404.5 / 500)
 */
export function getRealisticScienceSubjects(): SubjectScore[] {
  return [
    { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', score: 106.5, maxScore: 125, grade: 'A' },
    { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', score: 58.5, maxScore: 75, grade: 'B' },
    { id: 'phys', nameKm: 'រូបវិទ្យា', nameEn: 'Physics', score: 62.0, maxScore: 75, grade: 'B' },
    { id: 'chem', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry', score: 59.5, maxScore: 75, grade: 'B' },
    { id: 'bio', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology', score: 55.5, maxScore: 75, grade: 'C' },
    { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', score: 41.0, maxScore: 50, grade: 'B' },
    { id: 'lang', nameKm: 'ភាសាបរទេស (អង់គ្លេស)', nameEn: 'Foreign Language (English)', score: 21.5, maxScore: 25, grade: 'A' }
  ];
}

/**
 * Creates realistic default subject results for Social Science track (approx Grade B, 407.5 / 500)
 */
export function getRealisticSocialSubjects(): SubjectScore[] {
  return [
    { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', score: 104.5, maxScore: 125, grade: 'A' },
    { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', score: 56.5, maxScore: 75, grade: 'B' },
    { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', score: 62.0, maxScore: 75, grade: 'B' },
    { id: 'geo', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography', score: 60.5, maxScore: 75, grade: 'B' },
    { id: 'morals', nameKm: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', nameEn: 'Moral and Civics', score: 64.0, maxScore: 75, grade: 'A' },
    { id: 'earth', nameKm: 'ផែនដី និងបរិស្ថានវិទ្យា', nameEn: 'Earth Science', score: 39.0, maxScore: 50, grade: 'B' },
    { id: 'lang', nameKm: 'ភាសាបរទេស (អង់គ្លេស)', nameEn: 'Foreign Language (English)', score: 21.0, maxScore: 25, grade: 'A' }
  ];
}

/**
 * Sanitize and validate any ExamResult to guarantee exact MoEYS mathematical adherence:
 * - maxTotalScore is 500
 * - subject maxScores match the track (summing to 500)
 * - subject scores never exceed maxScore
 * - totalScore is the exact sum of subject scores and never exceeds 500
 * - overallStatus and grade match official MoEYS thresholds
 */
export function normalizeExamResult(result: ExamResult): ExamResult {
  const isSocial = result.track === 'Social Science';
  const configList = isSocial ? SOCIAL_SUBJECTS_CONFIG : SCIENCE_SUBJECTS_CONFIG;
  const configMap = new Map(configList.map(c => [c.id, c]));

  let subjects: SubjectScore[] = [];

  // Check if existing subjects need conversion/scaling
  if (result.subjects && result.subjects.length > 0) {
    // If subjects were previously defined with wrong max scores (e.g. 100 on everything),
    // scale them cleanly to the official MoEYS maxScores
    const hasOutdatedMaxScores = result.subjects.some(s => {
      const expected = configMap.get(s.id);
      return expected ? s.maxScore !== expected.maxScore : s.maxScore > 125;
    });

    if (hasOutdatedMaxScores) {
      subjects = result.subjects.map(s => {
        const expected = configMap.get(s.id) || { maxScore: 75, nameKm: s.nameKm, nameEn: s.nameEn };
        const oldMax = s.maxScore || 100;
        // Scale proportionally to the new official maxScore
        const ratio = Math.min(1.0, Math.max(0, s.score / oldMax));
        const newScore = parseFloat((ratio * expected.maxScore).toFixed(1));
        return {
          id: s.id,
          nameKm: expected.nameKm || s.nameKm,
          nameEn: expected.nameEn || s.nameEn,
          score: newScore,
          maxScore: expected.maxScore,
          grade: calculateSubjectGrade(newScore, expected.maxScore)
        };
      });
    } else {
      subjects = result.subjects.map(s => {
        const expected = configMap.get(s.id);
        const maxScore = expected ? expected.maxScore : (s.maxScore || 75);
        const score = Math.min(maxScore, Math.max(0, s.score));
        return {
          ...s,
          score,
          maxScore,
          grade: s.grade || calculateSubjectGrade(score, maxScore)
        };
      });
    }
  } else {
    // Fallback to track realistic subjects
    subjects = isSocial ? getRealisticSocialSubjects() : getRealisticScienceSubjects();
  }

  // Calculate true sum
  const totalScore = parseFloat(subjects.reduce((sum, s) => sum + s.score, 0).toFixed(1));
  const grade = calculateOverallGrade(totalScore);
  const overallStatus = totalScore >= PASSING_SCORE_THRESHOLD ? 'PASS' : 'FAIL';
  const percentile = parseFloat(Math.min(99.9, Math.max(5.0, (totalScore / MAX_BACII_TOTAL_SCORE) * 100 + 1.2)).toFixed(2));

  return {
    ...result,
    totalScore,
    maxTotalScore: MAX_BACII_TOTAL_SCORE,
    grade,
    overallStatus,
    percentile,
    subjects
  };
}
