import { StudentProfile, ExamResult, AppNotification } from './types';

export const CAMBODIAN_PROVINCES = [
  'រាជធានីភ្នំពេញ (Phnom Penh)',
  'កណ្តាល (Kandal)',
  'សៀមរាប (Siem Reap)',
  'បាត់ដំបង (Battambang)',
  'កំពង់ចាម (Kampong Cham)',
  'ព្រះសីហនុ (Preah Sihanouk)',
  'កំពត (Kampot)',
  'តាកែវ (Takeo)',
  'ព្រៃវែង (Prey Veng)',
  'ស្វាយរៀង (Svay Rieng)',
  'កំពង់ឆ្នាំង (Kampong Chhnang)',
  'កំពង់ធំ (Kampong Thom)',
  'កំពង់ស្ពឺ (Kampong Speu)',
  'ពោធិ៍សាត់ (Pursat)',
  'បន្ទាយមានជ័យ (Banteay Meanchey)',
  'ត្បូងឃ្មុំ (Tboung Khmum)',
  'ក្រចេះ (Kratie)',
  'ស្ទឹងត្រែង (Stung Treng)',
  'រតនគិរី (Ratanakiri)',
  'មណ្ឌលគិរី (Mondulkiri)',
  'ឧត្តរមានជ័យ (Oddar Meanchey)',
  'ព្រះវិហារ (Preah Vihear)',
  'កោះកុង (Koh Kong)',
  'កែប (Kep)',
  'ប៉ៃលិន (Pailin)'
];

export const SCHOOLS_BY_PROVINCE: Record<string, string[]> = {
  'រាជធានីភ្នំពេញ (Phnom Penh)': [
    'វិទ្យាល័យ បាក់ទូក (Bak Touk High School)',
    'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ (Preah Sisowath High School)',
    'វិទ្យាល័យ ជា ស៊ីម សាមគ្គី (Chea Sim Samaki High School)',
    'វិទ្យាល័យ ឥន្ទ្រទេវី (Indradevi High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ភ្នំពេញថ្មី (Hun Sen Phnom Penh Thmey High School)',
    'វិទ្យាល័យ ច្បារអំពៅ (Chbar Ampov High School)',
    'វិទ្យាល័យ ទួលទំពូង (Toul Tompoung High School)',
    'វិទ្យាល័យ ជា ស៊ីម បឹងកេងកង (Chea Sim Boeung Keng Kang High School)',
    'វិទ្យាល័យ ឫស្សីកែវ (Russei Keo High School)',
    'វិទ្យាល័យ ទួលស្វាយព្រៃ (Toul Svay Prey High School)'
  ],
  'កណ្តាល (Kandal)': [
    'វិទ្យាល័យ ហ៊ុន សែន តាខ្មៅ (Hun Sen Takhmao High School)',
    'វិទ្យាល័យ ជា ស៊ីម ព្រែកហូរ (Chea Sim Prek Ho High School)',
    'វិទ្យាល័យ ហ៊ុន សែន សេរីភាព (Hun Sen Sereypheap High School)',
    'វិទ្យាល័យ ហ៊ុន សែន កៀនស្វាយ (Hun Sen Kien Svay High School)',
    'វិទ្យាល័យ ហ៊ុន សែន អង្គស្នួល (Hun Sen Ang Snuol High School)',
    'វិទ្យាល័យ ហ៊ុន សែន កោះធំ (Hun Sen Koh Thom High School)'
  ],
  'សៀមរាប (Siem Reap)': [
    'វិទ្យាល័យ អង្គរ (Angkor High School)',
    'វិទ្យាល័យ ១០ មករា ១៩៧៩ (10 Makara 1979 High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ប្រាសាទបាគង (Hun Sen Prasat Bakong High School)',
    'វិទ្យាល័យ សម្តេចឪ សៀមរាប (Samdech Euv High School)',
    'វិទ្យាល័យ ពួក (Pouk High School)',
    'វិទ្យាល័យ ជីក្រែង (Chikreng High School)'
  ],
  'បាត់ដំបង (Battambang)': [
    'វិទ្យាល័យ នេត យ៉ង់ (Net Yang High School)',
    'វិទ្យាល័យ ព្រះមុនីវង្ស (Preah Monivong High School)',
    'វិទ្យាល័យ សម្តេចឪ បាត់ដំបង (Samdech Euv High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ថ្មគោល (Hun Sen Thma Koul High School)',
    'វិទ្យាល័យ មោងឫស្សី (Moung Ruessei High School)',
    'វិទ្យាល័យ សង្កែ (Sangkae High School)'
  ],
  'កំពង់ចាម (Kampong Cham)': [
    'វិទ្យាល័យ ព្រះសីហនុ (Preah Sihanouk High School)',
    'វិទ្យាល័យ ហ៊ុន សែន កំពង់ចាម (Hun Sen Kampong Cham High School)',
    'វិទ្យាល័យ ដីដុះ (Dei Doh High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (Hun Sen Skun High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ព្រៃទទឹង (Hun Sen Prey Totueng High School)',
    'វិទ្យាល័យ ចំការលើ (Chamkar Leu High School)'
  ],
  'ព្រះសីហនុ (Preah Sihanouk)': [
    'វិទ្យាល័យ ក្រុងព្រះសីហនុ (Sihanoukville High School)',
    'វិទ្យាល័យ សម្តេចតេជោ ហ៊ុន សែន ព្រៃនប់ (Prey Nob High School)',
    'វិទ្យាល័យ ស្ទឹងហាវ (Stung Hav High School)',
    'វិទ្យាល័យ វាលរេញ (Veal Rinh High School)'
  ],
  'កំពត (Kampot)': [
    'វិទ្យាល័យ ព្រះរាជសម្ភារ (Preah Reach Sambhar High School)',
    'វិទ្យាល័យ កំពង់ត្រាច (Kampong Trach High School)',
    'វិទ្យាល័យ ឈូក (Chhouk High School)',
    'វិទ្យាល័យ ហ៊ុន សែន អង្គជ័យ (Hun Sen Ang Chey High School)',
    'វិទ្យាល័យ ទូកមាស (Touk Meas High School)'
  ],
  'តាកែវ (Takeo)': [
    'វិទ្យាល័យ ហ៊ុន សែន តាកែវ (Hun Sen Takeo High School)',
    'វិទ្យាល័យ ជា ស៊ីម តាកែវ (Chea Sim Takeo High School)',
    'វិទ្យាល័យ ហ៊ុន សែន អង្គតាសោម (Hun Sen Ang Ta Saom High School)',
    'វិទ្យាល័យ គិរីវង់ (Kirivong High School)',
    'វិទ្យាល័យ ត្រាំកក់ (Tram Kak High School)',
    'វិទ្យាល័យ បាទី (Bati High School)'
  ],
  'ព្រៃវែង (Prey Veng)': [
    'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ ព្រៃវែង (Preah Sisowath Prey Veng High School)',
    'វិទ្យាល័យ ហ៊ុន សែន កំពង់លាវ (Hun Sen Kampong Leav High School)',
    'វិទ្យាល័យ បាភ្នំ (Ba Phnom High School)',
    'វិទ្យាល័យ ពារាំង (Pea Reang High School)',
    'វិទ្យាល័យ ស្វាយអន្ទរ (Svay Antor High School)'
  ],
  'ស្វាយរៀង (Svay Rieng)': [
    'វិទ្យាល័យ ស្វាយរៀង (Svay Rieng High School)',
    'វិទ្យាល័យ ហ៊ុន សែន រមាសហែក (Hun Sen Romeas Hek High School)',
    'វិទ្យាល័យ បាវិត (Bavet High School)',
    'វិទ្យាល័យ ព្រះរាជាណាចក្រកម្ពុជា (Kingdom of Cambodia High School)'
  ],
  'កំពង់ឆ្នាំង (Kampong Chhnang)': [
    'វិទ្យាល័យ ព្រះបាទសុរាម្រឹត (Preah Bat Suramarit High School)',
    'វិទ្យាល័យ ហ៊ុន សែន កំពង់ត្រឡាច (Hun Sen Kampong Tralach High School)',
    'វិទ្យាល័យ រលាប្អៀរ (Rolea Bier High School)',
    'វិទ្យាល័យ បរិបូរណ៍ (Boribor High School)'
  ],
  'កំពង់ធំ (Kampong Thom)': [
    'វិទ្យាល័យ កំពង់ធំ (Kampong Thom High School)',
    'វិទ្យាល័យ ស្ទោង (Stoung High School)',
    'វិទ្យាល័យ តាំងក្រសាំង (Tang Krasang High School)',
    'វិទ្យាល័យ បារាយណ៍ (Baray High School)'
  ],
  'កំពង់ស្ពឺ (Kampong Speu)': [
    'វិទ្យាល័យ កំពង់ស្ពឺ (Kampong Speu High School)',
    'វិទ្យាល័យ ឧដុង្គ (Oudong High School)',
    'វិទ្យាល័យ សម្តេចព្រះសង្ឃរាជ ជួន ណាត (Chuon Nath High School)',
    'វិទ្យាល័យ គងពិសី (Kong Pisei High School)'
  ],
  'ពោធិ៍សាត់ (Pursat)': [
    'វិទ្យាល័យ ពោធិ៍សាត់ (Pursat High School)',
    'វិទ្យាល័យ ក្រគរ (Krakor High School)',
    'វិទ្យាល័យ បាកាន (Bakan High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ភ្នំក្រវាញ (Phnom Kravanh High School)'
  ],
  'បន្ទាយមានជ័យ (Banteay Meanchey)': [
    'វិទ្យាល័យ សិរីសោភ័ណ (Serei Saophoan High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ខ្លាកូន (Hun Sen Khla Kaun High School)',
    'វិទ្យាល័យ ម៉ាឡៃ (Malai High School)',
    'វិទ្យាល័យ ប៉ោយប៉ែត (Poipet High School)',
    'វិទ្យាល័យ មង្គលបូរី (Mongkol Borei High School)'
  ],
  'ត្បូងឃ្មុំ (Tboung Khmum)': [
    'វិទ្យាល័យ ហ៊ុន សែន មេមត់ (Hun Sen Memot High School)',
    'វិទ្យាល័យ ត្បូងឃ្មុំ (Tboung Khmum High School)',
    'វិទ្យាល័យ សួង (Suong High School)',
    'វិទ្យាល័យ ក្រូចឆ្មារ (Krouch Chhmar High School)'
  ],
  'ក្រចេះ (Kratie)': [
    'វិទ្យាល័យ ព្រះមហាក្សត្រីយានី កុសុមៈ (Kossamak High School)',
    'វិទ្យាល័យ ស្នួល (Snuol High School)',
    'វិទ្យាល័យ ឆ្លូង (Chhloung High School)'
  ],
  'ស្ទឹងត្រែង (Stung Treng)': [
    'វិទ្យាល័យ ព្រះរាជបូជនីយកិច្ច (Preah Reach Bochaneyakich High School)',
    'វិទ្យាល័យ សេសាន (Sesan High School)',
    'វិទ្យាល័យ ថាឡាបរិវ៉ាត់ (Thala Borivat High School)'
  ],
  'រតនគិរី (Ratanakiri)': [
    'វិទ្យាល័យ សម្តេចឪ សម្តេចម៉ែ បានលុង (Banlung High School)',
    'វិទ្យាល័យ បរកែវ (Borkeo High School)',
    'វិទ្យាល័យ អណ្តូងមាស (Andoung Meas High School)'
  ],
  'មណ្ឌលគិរី (Mondulkiri)': [
    'វិទ្យាល័យ ហ៊ុន សែន សែនមនោរម្យ (Sen Monorom High School)',
    'វិទ្យាល័យ កែវសីមា (Keo Seima High School)',
    'វិទ្យាល័យ កោះញែក (Koh Nhek High School)'
  ],
  'ឧត្តរមានជ័យ (Oddar Meanchey)': [
    'វិទ្យាល័យ សំរោង (Samraong High School)',
    'វិទ្យាល័យ អន្លង់វែង (Anlong Veng High School)',
    'វិទ្យាល័យ ត្រពាំងប្រាសាទ (Trapeang Prasat High School)'
  ],
  'ព្រះវិហារ (Preah Vihear)': [
    'វិទ្យាល័យ ជា ស៊ីម ត្បែងមានជ័យ (Tbeng Meanchey High School)',
    'វិទ្យាល័យ រវៀង (Rovieng High School)',
    'វិទ្យាល័យ ឆែប (Chhaeb High School)'
  ],
  'កោះកុង (Koh Kong)': [
    'វិទ្យាល័យ ប៉ាក់ខ្លង (Pak Khlang High School)',
    'វិទ្យាល័យ ហ៊ុន សែន ចាំយាម (Cham Yeam High School)',
    'វិទ្យាល័យ ស្រែអំបិល (Sre Ambel High School)'
  ],
  'កែប (Kep)': [
    'វិទ្យាល័យ ប៊ុន រ៉ានី ហ៊ុន សែន ចរិយាវង្ស (Chariya Vong High School)',
    'វិទ្យាល័យ កែប (Kep High School)'
  ],
  'ប៉ៃលិន (Pailin)': [
    'វិទ្យាល័យ ហ៊ុន សែន ក្រុងទេពនិម្មិត ប៉ៃលិន (Tep Nimit Pailin High School)',
    'វិទ្យាល័យ សាលាក្រៅ (Sala Krau High School)'
  ]
};

export const OTHER_SCHOOL_OPTION = 'វិទ្យាល័យផ្សេងទៀត... (Other High School...)';

export function getSchoolsForProvince(prov: string): string[] {
  const list = SCHOOLS_BY_PROVINCE[prov];
  if (list && list.length > 0) {
    return [...list, OTHER_SCHOOL_OPTION];
  }
  return [
    'វិទ្យាល័យ ប្រចាំខេត្ត (Provincial High School)',
    'វិទ្យាល័យ ហ៊ុន សែន (Hun Sen High School)',
    OTHER_SCHOOL_OPTION
  ];
}

export const POPULAR_SCHOOLS = [
  'វិទ្យាល័យ បាក់ទូក (Bak Touk High School)',
  'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ (Preah Sisowath High School)',
  'វិទ្យាល័យ ជា ស៊ីម សាមគ្គី (Chea Sim Samaki High School)',
  'វិទ្យាល័យ ឥន្ទ្រទេវី (Indradevi High School)',
  'វិទ្យាល័យ ហ៊ុន សែន កំពង់ចាម (Hun Sen Kampong Cham High School)',
  'វិទ្យាល័យ អង្គរ (Angkor High School)',
  'វិទ្យាល័យ នេត យ៉ង់ (Net Yang High School - Battambang)',
  'វិទ្យាល័យ ព្រះមុនីវង្ស (Preah Monivong High School)',
  'វិទ្យាល័យ ហ៊ុន សែន ភ្នំពេញថ្មី (Hun Sen Phnom Penh Thmey High School)',
  'វិទ្យាល័យ ច្បារអំពៅ (Chbar Ampov High School)'
];

export const DEFAULT_STUDENT: StudentProfile = {
  id: 'student-001',
  fullNameLatin: 'Sok Seiha',
  fullNameKm: 'សុខ សីហា',
  dob: '2008-04-18',
  gender: 'male',
  phoneNumber: '012 889 977',
  email: 'sok.seiha@student.edu.kh',
  candidateNumber: '123-456-789',
  school: 'វិទ្យាល័យ បាក់ទូក (Bak Touk High School)',
  province: 'រាជធានីភ្នំពេញ (Phnom Penh)',
  examCenter: 'មណ្ឌលវិទ្យាល័យបាក់ទូក (បន្ទប់ 14)',
  examYear: 2026,
  track: 'Science',
  registeredAt: '2026-07-15',
  isExamLocked: true
};

export const DEFAULT_RESULT_2026: ExamResult = {
  id: 'result-2026-001',
  year: 2026,
  candidateNumber: '123-456-789',
  studentNameLatin: 'Sok Seiha',
  studentNameKm: 'សុខ សីហា',
  school: 'វិទ្យាល័យ បាក់ទូក (Bak Touk High School)',
  province: 'រាជធានីភ្នំពេញ (Phnom Penh)',
  examCenter: 'មណ្ឌលវិទ្យាល័យបាក់ទូក (Bak Touk Center)',
  roomNumber: '14',
  deskNumber: '28',
  isReleased: true,
  releaseDate: '2026-09-06',
  overallStatus: 'PASS',
  grade: 'B',
  totalScore: 404.50,
  maxTotalScore: 500.00,
  percentile: 85.50,
  track: 'Science',
  verificationHash: 'MOEYS-BACII-2026-88A9F4C20B',
  subjects: [
    { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', score: 106.5, maxScore: 125, grade: 'A' },
    { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', score: 58.5, maxScore: 75, grade: 'B' },
    { id: 'phys', nameKm: 'រូបវិទ្យា', nameEn: 'Physics', score: 62.0, maxScore: 75, grade: 'B' },
    { id: 'chem', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry', score: 59.5, maxScore: 75, grade: 'B' },
    { id: 'bio', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology', score: 55.5, maxScore: 75, grade: 'C' },
    { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', score: 41.0, maxScore: 50, grade: 'B' },
    { id: 'lang', nameKm: 'ភាសាបរទេស (អង់គ្លេស)', nameEn: 'Foreign Language (English)', score: 21.5, maxScore: 25, grade: 'A' }
  ]
};

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'result',
    titleKm: 'លទ្ធផលបាក់ឌុបរបស់អ្នករួចរាល់ហើយ',
    titleEn: 'Your Bac II Result Is Ready',
    bodyKm: 'លទ្ធផលប្រឡងបាក់ឌុបផ្លូវការរបស់អ្នករួចរាល់ហើយ។ សូមបើកកម្មវិធីដើម្បីពិនិត្យលទ្ធផលដោយសម្ងាត់។',
    bodyEn: 'Your official Bac II examination result is now available. Open the app to view it privately.',
    timestamp: 'ទើបតែចេញ (Just now)',
    read: false,
    isSensitive: true // Ensures no score preview on locked screens
  },
  {
    id: 'notif-2',
    type: 'system',
    titleKm: 'ប្រព័ន្ធត្រូវបានធ្វើបច្ចុប្បន្នភាពសុវត្ថិភាព',
    titleEn: 'System Security Update',
    bodyKm: 'ប្រព័ន្ធលទ្ធផលបាក់ឌុបផ្ទាល់ខ្លួន ត្រូវបានធ្វើបច្ចុប្បន្នភាពបណ្តាញតភ្ជាប់ MoEYS សុវត្ថិភាពខ្ពស់។',
    bodyEn: 'The personal Bac II portal has completed security hardening for authenticated delivery.',
    timestamp: 'ម្សិលមិញ (Yesterday)',
    read: true
  },
  {
    id: 'notif-3',
    type: 'schedule',
    titleKm: 'បញ្ជាក់លេខតុ និងមណ្ឌលប្រឡង',
    titleEn: 'Examination Center & Desk Confirmed',
    bodyKm: 'លេខសម្គាល់បេក្ខជន 123-456-789 ត្រូវបានផ្គូផ្គងរួចរាល់នៅមណ្ឌលវិទ្យាល័យបាក់ទូក បន្ទប់ 14 តុ 28។',
    bodyEn: 'Candidate number 123-456-789 verified at Bak Touk Exam Center, Room 14, Desk 28.',
    timestamp: '៣ ថ្ងៃមុន (3 days ago)',
    read: true
  }
];
