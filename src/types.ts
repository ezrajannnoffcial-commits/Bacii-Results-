export type Language = 'km' | 'en';

export type Screen = 
  | 'welcome' 
  | 'register' 
  | 'signin' 
  | 'home' 
  | 'result' 
  | 'advisor'
  | 'history' 
  | 'notifications' 
  | 'profile';

export type Gender = 'male' | 'female';

export interface SubjectScore {
  id: string;
  nameKm: string;
  nameEn: string;
  score: number;
  maxScore: number;
  grade?: string;
}

export type ResultStatus = 'PASS' | 'FAIL';
export type MentionGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ExamResult {
  id: string;
  year: number;
  candidateNumber: string;
  studentNameLatin: string;
  studentNameKm: string;
  school: string;
  province: string;
  examCenter: string;
  roomNumber: string;
  deskNumber: string;
  isReleased: boolean;
  releaseDate?: string;
  overallStatus?: ResultStatus;
  grade?: MentionGrade;
  totalScore?: number;
  maxTotalScore?: number;
  percentile?: number;
  track: 'Science' | 'Social Science';
  subjects?: SubjectScore[];
  verificationHash: string;
}

export interface StudentProfile {
  id: string;
  fullNameLatin: string;
  fullNameKm: string;
  dob: string;
  gender: Gender;
  phoneNumber: string;
  email?: string;
  candidateNumber: string;
  school: string;
  province: string;
  examCenter: string;
  examYear: number;
  track: 'Science' | 'Social Science';
  registeredAt: string;
  isExamLocked: boolean; // Locked after registration to prevent tampering
}

export interface AppNotification {
  id: string;
  type: 'result' | 'system' | 'schedule';
  titleKm: string;
  titleEn: string;
  bodyKm: string;
  bodyEn: string;
  timestamp: string;
  read: boolean;
  isSensitive?: boolean;
}

export type SubjectGradeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SubjectAssessment {
  subject: string;
  grade: string;
  reason: string;
}

export interface RecommendedMajor {
  majorName: string;
  category: string;
  suitabilityReason: string;
  careerProspects: string;
}

export interface MatchingInstitution {
  nameEn: string;
  nameKm: string;
  type: 'Public' | 'Private' | 'Institute';
  recommendedFaculty: string;
  admissionRequirement: string;
  notableStrengths: string;
}

export interface ScholarshipPathway {
  title: string;
  provider: string;
  criteria: string;
  benefits: string;
  applicationWindow: string;
}

export interface PracticalNextStep {
  stepNumber: number;
  title: string;
  description: string;
  actionableLinkOrContact?: string;
}

export interface TvetOption {
  programName: string;
  institution: string;
  duration: string;
  benefit: string;
}

export interface RetakeStrategy {
  targetSubjects: string[];
  studyTimeline: string;
  keyAdvice: string;
}

export interface AdvisorAnalysisResponse {
  studentSummary: {
    candidateNumber: string;
    school: string;
    province: string;
    overallGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    status: 'PASS' | 'FAIL';
    overallAnalysis: string;
    strongestSubjects: SubjectAssessment[];
    weakestSubjects: SubjectAssessment[];
  };
  universityMatchmaker: {
    recommendedMajors: RecommendedMajor[];
    matchingInstitutions: MatchingInstitution[];
    scholarshipPathways: ScholarshipPathway[];
  };
  empatheticGuide: {
    encouragingMessage: string;
    pathwayType: 'top_achiever' | 'solid_pass' | 'tvet_vocational_retake';
    practicalNextSteps: PracticalNextStep[];
    tvetVocationalOptions?: TvetOption[];
    retakeStrategy?: RetakeStrategy;
  };
}

