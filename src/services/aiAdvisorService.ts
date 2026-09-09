import { AdvisorAnalysisResponse, SubjectGradeLetter, Language } from '../types';

const GRADE_POINTS: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0
};

export interface AdvisorAnalysisParams {
  candidateNumber?: string;
  school?: string;
  province?: string;
  grades: Record<string, SubjectGradeLetter | string>;
  track?: 'Science' | 'Social Science';
  lang?: Language;
}

/**
 * Intelligent Counselor Engine calibrated for Cambodia MoEYS Bac II 2026.
 * Runs client-side (for static GitHub Pages deploys and offline resilience)
 * as well as server-side fallback.
 */
export function generateSmartAdvisorAnalysis(params: AdvisorAnalysisParams): AdvisorAnalysisResponse {
  const {
    candidateNumber = '123-456-789',
    school = 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ',
    province = 'រាជធានីភ្នំពេញ',
    grades,
    track = 'Science',
    lang = 'km'
  } = params;

  const isKm = lang === 'km';
  const isScience = track === 'Science';

  // Calculate score average
  const subjectEntries = Object.entries(grades);
  let totalPts = 0;
  subjectEntries.forEach(([_, gr]) => {
    const letter = (typeof gr === 'string' ? gr.charAt(0).toUpperCase() : 'C');
    totalPts += GRADE_POINTS[letter] ?? 2;
  });
  const avg = subjectEntries.length > 0 ? totalPts / subjectEntries.length : 3;

  let overallGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'C';
  let overallStatus: 'PASS' | 'FAIL' = 'PASS';

  if (avg >= 4.4) overallGrade = 'A';
  else if (avg >= 3.5) overallGrade = 'B';
  else if (avg >= 2.7) overallGrade = 'C';
  else if (avg >= 1.9) overallGrade = 'D';
  else if (avg >= 1.1) overallGrade = 'E';
  else {
    overallGrade = 'F';
    overallStatus = 'FAIL';
  }

  // Sort subjects by points
  const sorted = [...subjectEntries].sort((a, b) => {
    const ptA = GRADE_POINTS[(a[1] || 'C').charAt(0).toUpperCase()] ?? 2;
    const ptB = GRADE_POINTS[(b[1] || 'C').charAt(0).toUpperCase()] ?? 2;
    return ptB - ptA;
  });

  const cleanSubjectName = (name: string) => {
    return name.replace(/\s*\(\d+\s*pts\)/i, '').trim();
  };

  const strongest = sorted.slice(0, 2);
  const weakest = sorted.slice(-2).reverse();

  const strongList = strongest.map(([name, gr]) => {
    const clean = cleanSubjectName(name);
    return {
      subject: clean,
      grade: gr || 'B',
      reason: isKm
        ? `និទ្ទេស ${gr} ក្នុងមុខវិជ្ជា ${clean} បង្ហាញពីមូលដ្ឋានគ្រឹះរឹងមាំសម្រាប់ជំនាញឧត្តមសិក្សា និងឱកាសអាហារូបករណ៍។`
        : `Grade ${gr} in ${clean} indicates exceptional foundational aptitude and high suitability for competitive university programs.`
    };
  });

  const weakList = weakest.map(([name, gr]) => {
    const clean = cleanSubjectName(name);
    return {
      subject: clean,
      grade: gr || 'D',
      reason: isKm
        ? `មុខវិជ្ជា ${clean} គួរតែទទួលបានការរំលឹក និងពង្រឹងបន្ថែមដើម្បីត្រៀមប្រឡងចូល ឬថ្នាក់ឆ្នាំសិក្សាមូលដ្ឋាន (Foundation Year)។`
        : `Needs consolidation in ${clean} before sitting for university entrance examinations.`
    };
  });

  const isFail = overallGrade === 'F' || overallGrade === 'E';

  return {
    studentSummary: {
      candidateNumber,
      school,
      province,
      overallGrade,
      status: overallStatus,
      overallAnalysis: isKm
        ? `ផ្អែកលើការវាយតម្លៃលទ្ធផលបាក់ឌុបសរុប បេក្ខជនទទួលបាននិទ្ទេសរួម «${overallGrade}» (${overallStatus === 'PASS' ? 'ជាប់ជាស្ថាពរ' : 'ធ្លាក់/មិនទាន់ជាប់'}) សម្រាប់សម័យប្រឡងឆ្នាំ២០២៦។ មុខវិជ្ជាលេចធ្លោជាងគេរួមមាន ${strongest.map(s => cleanSubjectName(s[0])).join(' និង ')}។`
        : `Based on your Bac II performance evaluation, your overall Mention is evaluated as "${overallGrade}" (${overallStatus === 'PASS' ? 'Successful Pass' : 'Needs Retake / TVET'}). Your primary academic strengths are centered in ${strongest.map(s => cleanSubjectName(s[0])).join(' & ')}.`,
      strongestSubjects: strongList,
      weakestSubjects: weakList
    },
    universityMatchmaker: {
      recommendedMajors: [
        {
          majorName: isScience
            ? (isKm ? 'វិស្វកម្មសូហ្វវែរ និងវិទ្យាសាស្ត្រកុំព្យូទ័រ' : 'Computer Science & Software Engineering')
            : (isKm ? 'ហិរញ្ញវត្ថុ ធនាគារ និងពាណិជ្ជកម្មអន្តរជាតិ' : 'Finance, Banking & International Business'),
          category: isScience ? 'STEM / Technology' : 'Business & Finance',
          suitabilityReason: isKm
            ? 'ស៊ីសង្វាក់យ៉ាងល្អឥតខ្ចោះជាមួយមុខវិជ្ជាគណិតវិទ្យា និងការគិតបែបរិះគន់ដែលមានតម្រូវការទីផ្សារការងារខ្ពស់។'
            : 'Strong alignment with your quantitative scores and high industry demand across ASEAN.',
          careerProspects: isKm ? 'អ្នកអភិវឌ្ឍន៍កម្មវិធី, Data Analyst, Cloud Architect' : 'Software Developer, Data Analyst, Financial Analyst'
        },
        {
          majorName: isScience
            ? (isKm ? 'ទូរគមនាគមន៍ និងបណ្តាញកុំព្យូទ័រ' : 'ច្បាប់ និងរដ្ឋបាលសាធារណៈ')
            : (isKm ? 'ទំនាក់ទំនងអន្តរជាតិ និងការទូត' : 'International Relations & Diplomacy'),
          category: isScience ? 'Engineering' : 'Social Sciences',
          suitabilityReason: isKm
            ? 'ឱកាសការងារទូលំទូលាយក្នុងវិស័យរដ្ឋ និងឯកជន ស្របនឹងក្របខ័ណ្ឌអភិវឌ្ឍន៍ឌីជីថលកម្ពុជា។'
            : 'Broad career avenues within ministries, international NGOs, and corporate institutions.',
          careerProspects: isKm ? 'Network Engineer, មន្ត្រីរាជការ, អ្នកប្រឹក្សាយោបល់' : 'Telecommunication Engineer, Diplomat, Legal Consultant'
        },
        {
          majorName: isKm ? 'គ្រប់គ្រងប្រព័ន្ធព័ត៌មានវិទ្យា (MIS)' : 'Management Information Systems (MIS)',
          category: 'Interdisciplinary',
          suitabilityReason: isKm
            ? 'ការរួមបញ្ចូលរវាងបច្ចេកវិទ្យាឌីជីថល និងការគ្រប់គ្រងអាជីវកម្មទំនើប។'
            : 'Effective bridge between digital technology and business management.',
          careerProspects: isKm ? 'IT Project Manager, Business Analyst' : 'IT Project Manager, Business Analyst'
        }
      ],
      matchingInstitutions: [
        {
          nameEn: 'Royal University of Phnom Penh (RUPP)',
          nameKm: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)',
          type: 'Public',
          recommendedFaculty: isKm ? 'មហាវិទ្យាល័យវិទ្យាសាស្ត្រ និងវិស្វកម្ម / FE' : 'Faculty of Engineering & Science',
          admissionRequirement: isKm ? 'និទ្ទេស A, B, C ឬ D (មានការប្រឡងប្រជែងអាហារូបករណ៍)' : 'Grades A to D (Entrance Exam for Scholarship)',
          notableStrengths: isKm ? 'សាកលវិទ្យាល័យរដ្ឋធំជាងគេ មានប្រវត្តិយូរអង្វែង និងដៃគូអន្តរជាតិច្រើន' : 'Cambodia’s flagship public university with extensive research partnerships'
        },
        {
          nameEn: 'Institute of Technology of Cambodia (ITC)',
          nameKm: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (តិចណូ / ITC)',
          type: 'Institute',
          recommendedFaculty: isKm ? 'ដេប៉ាតឺម៉ង់វិស្វកម្មព័ត៌មានវិទ្យា និងទំនាក់ទំនង' : 'Dept of Information & Communication Tech',
          admissionRequirement: isKm ? 'ត្រូវប្រឡងប្រជែងថ្នាក់ឆ្នាំសិក្សាមូលដ្ឋាន (Concours d’entrée)' : 'Competitive Entrance Concours exam required',
          notableStrengths: isKm ? 'ស្តង់ដារបណ្តុះបណ្តាលវិស្វកម្មកម្រិតខ្ពស់ និងទទួលស្គាល់ដោយប្រទេសបារាំង' : 'Premier engineering academy recognized by international accreditation bodies'
        },
        {
          nameEn: 'Cambodia Academy of Digital Technology (CADT)',
          nameKm: 'បណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា (CADT)',
          type: 'Public',
          recommendedFaculty: isKm ? 'វិទ្យាស្ថានបច្ចេកវិទ្យាឌីជីថល (IDT)' : 'Institute of Digital Technology',
          admissionRequirement: isKm ? 'និទ្ទេស A, B, C (អាហារូបករណ៍ទេពកោសល្យឌីជីថល)' : 'Grades A-C with Digital Talent assessment',
          notableStrengths: isKm ? 'ជំនាញ AI, Cybersecurity, Data Science និងសម្ភារៈទំនើបបំផុត' : 'Specialized institute for AI, cybersecurity, and digital entrepreneurship'
        },
        {
          nameEn: 'National University of Management (NUM)',
          nameKm: 'សាកលវិទ្យាល័យជាតិគ្រប់គ្រង (NUM)',
          type: 'Public',
          recommendedFaculty: isKm ? 'មហាវិទ្យាល័យសេដ្ឋកិច្ច និងបច្ចេកវិទ្យាឌីជីថល' : 'Faculty of Economics & Digital Tech',
          admissionRequirement: isKm ? 'និទ្ទេស A ដល់ E' : 'Grades A through E',
          notableStrengths: isKm ? 'ឈានមុខគេផ្នែកពាណិជ្ជកម្ម សហគ្រិនភាព និង Fintech' : 'Top public university for business management, entrepreneurship and fintech'
        },
        {
          nameEn: 'Paññāsāstra University of Cambodia (PUC)',
          nameKm: 'សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា (PUC)',
          type: 'Private',
          recommendedFaculty: isKm ? 'Faculty of Business & Humanities' : 'Faculty of Business & Humanities',
          admissionRequirement: isKm ? 'និទ្ទេស A ដល់ E (បង្រៀនជាភាសាអង់គ្លេស ១០០%)' : 'Grades A to E (100% English curriculum)',
          notableStrengths: isKm ? 'ជំនាញភាសាអង់គ្លេសខ្ពស់ និងទំនាក់ទំនងអន្តរជាតិ' : 'English-medium instruction with prominent international curriculum'
        }
      ],
      scholarshipPathways: [
        {
          title: isKm ? 'អាហារូបករណ៍រដ្ឋាភិបាលកម្ពុជា (MoEYS)' : 'MoEYS National Government Scholarship',
          provider: 'Ministry of Education, Youth and Sport',
          criteria: isKm ? 'ផ្តល់ជូនបេក្ខជននិទ្ទេស A, B និង C តាមរយៈការដាក់ពាក្យផ្លូវការ' : 'Awarded to Grade A, B, and top C graduates via national quota',
          benefits: isKm ? 'ការលើកលែងថ្លៃសិក្សា ១០០% រយៈពេល ៤ ឆ្នាំពេញ' : '100% full tuition exemption for 4-year degree',
          applicationWindow: isKm ? 'ខែតុលា - វិច្ឆិកា ជារៀងរាល់ឆ្នាំ' : 'October - November annually'
        },
        {
          title: isKm ? 'អាហារូបករណ៍ទេពកោសល្យឌីជីថលតេជោ (Techo Digital Talent)' : 'Techo Digital Talent Scholarship',
          provider: 'Ministry of Post and Telecom (MPTC / CADT)',
          criteria: isKm ? 'បេក្ខជនមាននិទ្ទេស A, B, C និងប្រឡងជាប់សមត្ថភាពគណិត-ព័ត៌មានវិទ្យា' : 'Grades A-C with strong STEM aptitude test result',
          benefits: isKm ? 'ថ្លៃសិក្សា ១០០% + ប្រាក់ឧបត្ថម្ភប្រចាំខែ + កុំព្យូទ័រ Laptop' : 'Full tuition + monthly living stipend + modern laptop',
          applicationWindow: isKm ? 'ខែវិច្ឆិកា ក្រោយប្រកាសលទ្ធផលបាក់ឌុប' : 'November, post-Bac II announcement'
        },
        {
          title: isKm ? 'អាហារូបករណ៍សម្តេចតេជោ និងមូលនិធិសាកលវិទ្យាល័យ' : 'Samdech Techo & University Merit Scholarships',
          provider: 'Various Universities & Foundations',
          criteria: isKm ? 'និទ្ទេស A និង B ទទួលបានការបញ្ចុះតម្លៃពី ៥០% ដល់ ១០០%' : 'Merit-based discounts (50% - 100%) for A & B grades',
          benefits: isKm ? 'ការកាត់បន្ថយថ្លៃសិក្សា ឬសិក្សាឥតគិតថ្លៃ' : 'Partial to full tuition waiver',
          applicationWindow: isKm ? 'ខែវិច្ឆិកា - ធ្នូ' : 'November - December'
        }
      ]
    },
    empatheticGuide: {
      encouragingMessage: isFail
        ? (isKm 
            ? 'ប្អូនៗជាទីស្រឡាញ់ លទ្ធផលបាក់ឌុបគ្រាន់តែជាជំហានមួយតូចនៅក្នុងជីវិតប៉ុណ្ណោះ មិនមែនជាការកំណត់វាសនា ឬសមត្ថភាពពិតរបស់ប្អូនឡើយ។ មនុស្សជោគជ័យជាច្រើនបានរកឃើញផ្លូវដ៏ត្រចះត្រចង់តាមរយៈការសិក្សាជំនាញបច្ចេកទេស (TVET) ឬការតស៊ូប្រឡងឡើងវិញ។ ភាពក្លាហានមិនចុះចាញ់គឺជាគន្លឹះនៃអនាគត!'
            : 'Dear student, remember that a high school exam result is simply one milestone, never a measure of your worth or future potential. Many remarkable leaders have carved inspiring pathways through hands-on technical training (TVET), associate pathways, or resilient re-testing. Your determination will define your success!')
        : (isKm
            ? 'សូមអបអរសាទរចំពោះការខិតខំប្រឹងប្រែង និងលទ្ធផលដ៏គាប់ប្រសើរដែលប្អូនសម្រេចបាន! នេះគឺជាផ្លែផ្កានៃការតស៊ូជាច្រើនឆ្នាំ។ ឥឡូវនេះ គឺជាពេលវេលាដ៏សំខាន់ក្នុងការជ្រើសរើសជំនាញដែលប្អូនស្រឡាញ់ និងរៀបចំយុទ្ធសាស្ត្រចាប់យកអាហារូបករណ៍!'
            : 'Congratulations on your achievements and dedication! This is the culmination of years of hard work. Now is the pivotal moment to select a field you are truly passionate about and seize available university and scholarship opportunities!'),
      pathwayType: isFail ? 'tvet_vocational_retake' : (overallGrade === 'A' || overallGrade === 'B' ? 'top_achiever' : 'solid_pass'),
      practicalNextSteps: isFail
        ? [
            {
              stepNumber: 1,
              title: isKm ? 'កម្មវិធីបណ្តុះបណ្តាលជំនាញវិជ្ជាជីវៈ និងបច្ចេកទេស (TVET 1.5 លាននាក់)' : 'National TVET 1.5M Youth Skills Training Program',
              description: isKm
                ? 'កម្មវិធីជាតិពិសេសរបស់រាជរដ្ឋាភិបាល៖ រៀនឥតគិតថ្លៃ ១០០% ថែមទាំងទទួលបានប្រាក់ឧបត្ថម្ភប្រចាំខែ ២៨០,០០០ រៀល។ រៀនចប់មានការងារធ្វើភ្លាមៗក្នុងរយៈពេល ៤ ទៅ ៨ ខែ។'
                : 'Government flagship initiative: 100% free tuition plus a monthly allowance of 280,000 KHR (~$70). High job placement rate within 4-8 months.',
              actionableLinkOrContact: 'Ministry of Labour and Vocational Training (MLVT)'
            },
            {
              stepNumber: 2,
              title: isKm ? 'ចុះឈ្មោះរៀនកម្រិតបរិញ្ញាបត្ររង (Associate Degree - ២ឆ្នាំ)' : 'Enroll in a 2-Year Associate Degree',
              description: isKm
                ? 'ចូលរៀនថ្នាក់បរិញ្ញាបត្ររងដោយមិនតម្រូវឱ្យជាប់បាក់ឌុបនៅតាមសាកលវិទ្យាល័យជាច្រើន។ បន្ទាប់ពីបញ្ចប់ ២ ឆ្នាំ ប្អូនអាចបន្តចូលឆ្នាំទី ៣ បរិញ្ញាបត្រពេញលេញបានយ៉ាងរលូន។'
                : 'Enables high school leavers to enroll directly into a 2-year Associate program, which can bridge smoothly into year 3 of a full Bachelor’s degree.',
              actionableLinkOrContact: 'Available at NUM, PPI, Norton, Western, etc.'
            },
            {
              stepNumber: 3,
              title: isKm ? 'ការរៀបចំផែនការប្រឡងបាក់ឌុបឡើងវិញ (Retake Preparation)' : 'Structured Bac II Retake Preparation Plan',
              description: isKm
                ? 'ផ្តោតលើការកែតម្រូវមុខវិជ្ជាខ្សោយចម្បងៗ (គណិត, រូប, គីមី ឬអក្សរសាស្ត្រ) ដោយចូលរួមថ្នាក់បំប៉ន និងធ្វើវិញ្ញាសាចាស់ៗពី ៥ ឆ្នាំចុងក្រោយ។'
                : 'Target your weakest subject areas by reviewing past MoEYS exam papers from the last 5 years with a dedicated study schedule.',
              actionableLinkOrContact: 'MoEYS Digital Learning Platform'
            }
          ]
        : [
            {
              stepNumber: 1,
              title: isKm ? 'ប្រមូលព័ត៌មាន និងដាក់ពាក្យប្រឡងអាហារូបករណ៍រដ្ឋ (MoEYS & MPTC)' : 'Register for National Scholarship Exams',
              description: isKm
                ? 'ពិនិត្យសេចក្តីជូនដំណឹងរបស់ក្រសួងអប់រំ និងត្រៀមឯកសារសញ្ញាបត្របណ្តោះអាសន្ន សំបុត្រកំណើត និងរូបថត ៤x៦។'
                : 'Prepare provisional graduation certificates, birth certificate copies, and 4x6 photos for national scholarship entry.',
              actionableLinkOrContact: 'scholarship.moeys.gov.kh'
            },
            {
              stepNumber: 2,
              title: isKm ? 'ត្រៀមខ្លួនសម្រាប់វិញ្ញាសាប្រឡងចូល (University Entrance Concours)' : 'Prepare for Specific University Entrance Exams',
              description: isKm
                ? 'សម្រាប់ស្ថាប័នដូចជា ITC (តិចណូ), RUPP Engineering, CADT, និងសាកលវិទ្យាល័យវិទ្យាសាស្ត្រសុខាភិបាល (UHS) ត្រូវត្រៀមមុខវិជ្ជាគណិត វិទ្យាសាស្ត្រ និងភាសាអង់គ្លេស។'
                : 'Institutions like ITC, CADT, and UHS require passing specialized entrance tests in Math, Science, and English.',
              actionableLinkOrContact: 'ITC & CADT Concours'
            },
            {
              stepNumber: 3,
              title: isKm ? 'ពង្រឹងភាសាបរទេស និងជំនាញឌីជីថល' : 'Elevate English & Digital Competencies',
              description: isKm
                ? 'ឯកសារស្រាវជ្រាវ និងកម្មវិធីសិក្សាឧត្តមភាគច្រើនប្រើប្រាស់ភាសាអង់គ្លេស។ ការពង្រឹងភាសានឹងផ្តល់ប្រៀបខ្លាំងក្នុងការដណ្តើមឱកាសផ្លាស់ប្តូរការសិក្សាក្រៅប្រទេស។'
                : 'Most university research and international exchange grants rely on English fluency and digital problem solving.',
              actionableLinkOrContact: 'IELTS / TOEFL Foundation'
            }
          ],
      tvetVocationalOptions: [
        {
          programName: isKm ? 'បច្ចេកវិទ្យាកុំព្យូទ័រ និងបណ្តាញ (Computer Hardware & Networking)' : 'Computer Hardware & Network Tech',
          institution: isKm ? 'វិទ្យាស្ថានជាតិពហុបច្ចេកទេសកម្ពុជា (NPIC)' : 'National Polytechnic Institute of Cambodia (NPIC)',
          duration: isKm ? '៤ ទៅ ១២ ខែ' : '4 - 12 Months',
          benefit: isKm ? 'រៀនអនុវត្តជាក់ស្តែង ៨០% មានការធានាការងារធ្វើ' : '80% practical hands-on training with industry internships'
        },
        {
          programName: isKm ? 'អគ្គិសនី និងប្រព័ន្ធស្វ័យប្រវត្តិកម្មឧស្សាហកម្ម' : 'Electrical & Industrial Automation',
          institution: isKm ? 'វិទ្យាស្ថានបណ្តុះបណ្តាលបច្ចេកទេស (NTI)' : 'National Technical Training Institute (NTTI)',
          duration: isKm ? '៦ ខែ (កម្រិតវិញ្ញាបនបត្រ ១-៣)' : '6 Months (Certificate I-III)',
          benefit: isKm ? 'តម្រូវការទីផ្សារខ្ពស់ក្នុងតំបន់សេដ្ឋកិច្ចពិសេស និងរោងចក្រទំនើប' : 'High market demand in Special Economic Zones'
        },
        {
          programName: isKm ? 'រចនាក្រាហ្វិក និងពហុព័ត៌មាន (Graphic & Digital Media)' : 'Graphic Design & Digital Media',
          institution: isKm ? 'មជ្ឈមណ្ឌលសហប្រតិបត្តិការកម្ពុជា-ជប៉ុន (CJCC)' : 'Cambodia-Japan Cooperation Center (CJCC)',
          duration: isKm ? '៣ ទៅ ៦ ខែ' : '3 - 6 Months',
          benefit: isKm ? 'ឱកាសការងារ Freelance និងទីផ្សារការងារឌីជីថល' : 'Fast-track entry into creative and freelance economy'
        }
      ],
      retakeStrategy: {
        targetSubjects: isScience 
          ? [isKm ? 'គណិតវិទ្យា (មេគុណខ្ពស់)' : 'Mathematics', isKm ? 'រូបវិទ្យា' : 'Physics', isKm ? 'អក្សរសាស្ត្រខ្មែរ' : 'Khmer Literature']
          : [isKm ? 'អក្សរសាស្ត្រខ្មែរ (មេគុណខ្ពស់)' : 'Khmer Literature', isKm ? 'ប្រវត្តិវិទ្យា' : 'History', isKm ? 'គណិតវិទ្យា' : 'Mathematics'],
        studyTimeline: isKm ? 'ផែនការ ៩០ ថ្ងៃ៖ ៣០ថ្ងៃមេរៀនគ្រឹះ + ៣០ថ្ងៃអនុវត្តលំហាត់ + ៣០ថ្ងៃដោះស្រាយវិញ្ញាសា' : '90-Day Strategy: 30 days core concepts, 30 days problem solving, 30 days past exam mock papers',
        keyAdvice: isKm ? 'កុំព្យាយាមទន្ទេញតែរូបមន្ត ត្រូវយល់ពីរបៀបបកស្រាយ និងសរសេរលំអិតតាមទម្រង់ក្រសួង' : 'Focus on step-by-step MoEYS standard solutions rather than rote memorization'
      }
    }
  };
}

/**
 * Main dispatch function: attempts server-side endpoint first.
 * If running on GitHub Pages (static), server is unreachable, or returns an error,
 * automatically falls back to generateSmartAdvisorAnalysis.
 */
export async function getAdvisorAnalysis(params: AdvisorAnalysisParams): Promise<AdvisorAnalysisResponse> {
  // Always build reliable fallback result ready
  const fallback = generateSmartAdvisorAnalysis(params);

  // Determine api endpoint URL (handling relative path if hosted under subfolder like GitHub Pages)
  const base = ((import.meta as any).env?.BASE_URL as string) || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const endpoint = `${cleanBase}/api/ai/advisor-analysis`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidateNumber: params.candidateNumber,
        school: params.school,
        province: params.province,
        track: params.track,
        grades: params.grades,
        lang: params.lang
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // If server returned ok and is valid json
    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.studentSummary && data.universityMatchmaker) {
          return data as AdvisorAnalysisResponse;
        }
      }
    }
  } catch (e) {
    console.info('Using client-side MoEYS AI counselor engine (offline/GitHub Pages mode):', e);
  }

  // Gracefully return authentic Cambodia MoEYS analysis
  return fallback;
}
