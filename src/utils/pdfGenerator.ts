import { jsPDF } from 'jspdf';
import { ExamResult, AdvisorAnalysisResponse, Language } from '../types';
import { normalizeExamResult } from './scoreCalculator';

export function generateAdvisorReportPdf(analysis: AdvisorAnalysisResponse, lang: Language): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Decorative Border
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1.0);
  doc.rect(10, 10, pageWidth - 20, 277);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.rect(13, 13, pageWidth - 26, 271);

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text('CAMBODIAN BAC II ACADEMIC & UNIVERSITY ROADMAP', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Ministry of Education, Youth and Sport (MoEYS) Career Counseling Guidance', pageWidth / 2, 27, { align: 'center' });

  // Candidate Summary Box
  const summary = analysis.studentSummary;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(18, 33, pageWidth - 36, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Candidate ID: ${summary.candidateNumber}`, 24, 40);
  doc.text(`High School: ${summary.school}`, 24, 46);
  doc.text(`Province: ${summary.province}`, 24, 52);

  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text(`Evaluated Mention: ${summary.overallGrade} (${summary.status})`, pageWidth - 24, 43, { align: 'right' });

  // Overall Score Breakdown Section
  let curY = 68;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SCORE BREAKDOWN & SUBJECT ANALYSIS', 18, curY);
  curY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const analysisLines = doc.splitTextToSize(summary.overallAnalysis, pageWidth - 36);
  doc.text(analysisLines, 18, curY);
  curY += analysisLines.length * 4.5 + 4;

  // Strongest vs Weakest
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52); // Emerald
  doc.text('Standout Strengths:', 18, curY);
  curY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  summary.strongestSubjects.forEach(s => {
    const line = `* ${s.subject} (Grade ${s.grade}): ${s.reason}`;
    const spl = doc.splitTextToSize(line, pageWidth - 36);
    doc.text(spl, 22, curY);
    curY += spl.length * 4 + 1;
  });

  curY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('Areas for Growth & Foundation Prep:', 18, curY);
  curY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  summary.weakestSubjects.forEach(w => {
    const line = `* ${w.subject} (Grade ${w.grade}): ${w.reason}`;
    const spl = doc.splitTextToSize(line, pageWidth - 36);
    doc.text(spl, 22, curY);
    curY += spl.length * 4 + 1;
  });

  // Section 2: University & Major Matches
  curY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MATCHED MAJORS & CAMBODIAN INSTITUTIONS', 18, curY);
  curY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text('Recommended Majors:', 18, curY);
  curY += 4.5;

  analysis.universityMatchmaker.recommendedMajors.forEach(m => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`- ${m.majorName} [${m.category}]`, 22, curY);
    curY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const subL = doc.splitTextToSize(`  ${m.suitabilityReason} (Careers: ${m.careerProspects})`, pageWidth - 42);
    doc.text(subL, 22, curY);
    curY += subL.length * 3.5 + 2;
  });

  curY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text('Top Cambodian Institutions:', 18, curY);
  curY += 4.5;

  analysis.universityMatchmaker.matchingInstitutions.slice(0, 4).forEach(inst => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`* ${inst.nameEn} (${inst.type})`, 22, curY);
    curY += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`  Faculty: ${inst.recommendedFaculty} | Entry: ${inst.admissionRequirement}`, 22, curY);
    curY += 4.5;
  });

  // Section 3: Empathetic Support & TVET / Next Steps
  curY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. NEXT STEPS & VOCATIONAL OPPORTUNITIES', 18, curY);
  curY += 5.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const empLines = doc.splitTextToSize(`"${analysis.empatheticGuide.encouragingMessage}"`, pageWidth - 36);
  doc.text(empLines, 18, curY);
  curY += empLines.length * 4 + 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  analysis.empatheticGuide.practicalNextSteps.slice(0, 3).forEach(st => {
    doc.setFont('helvetica', 'bold');
    doc.text(`Step ${st.stepNumber}: ${st.title}`, 22, curY);
    curY += 3.8;
    doc.setFont('helvetica', 'normal');
    const descSpl = doc.splitTextToSize(st.description, pageWidth - 42);
    doc.text(descSpl, 22, curY);
    curY += descSpl.length * 3.5 + 2;
  });

  // Footer
  const footerY = 270;
  doc.setDrawColor(226, 232, 240);
  doc.line(18, footerY, pageWidth - 18, footerY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via Cambodian Bac II AI Academic Advisor. Designed for student private guidance.', 18, footerY + 5);

  doc.save(`BacII_Roadmap_${summary.candidateNumber || 'Student'}.pdf`);
}


export function generateResultPdf(rawResult: ExamResult): void {
  const result = normalizeExamResult(rawResult);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Outer Border & Decorative Frame
  doc.setDrawColor(30, 64, 175); // #1E40AF Navy
  doc.setLineWidth(1.2);
  doc.rect(10, 10, pageWidth - 20, 277);

  doc.setDrawColor(226, 232, 240); // Slate-200 Inner Border
  doc.setLineWidth(0.4);
  doc.rect(13, 13, pageWidth - 26, 271);

  // Top Header - Kingdom of Cambodia
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138); // Navy 900
  doc.text('KINGDOM OF CAMBODIA', pageWidth / 2, 24, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Nation - Religion - King', pageWidth / 2, 30, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('MINISTRY OF EDUCATION, YOUTH AND SPORT', pageWidth / 2, 37, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('NATIONAL EXAMINATION BOARD - BAC II EXAMINATION', pageWidth / 2, 42, { align: 'center' });

  // Divider
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 45, 46, pageWidth / 2 + 45, 46);

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL BAC II RESULT CERTIFICATE', pageWidth / 2, 55, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Examination Session: ${result.year}`, pageWidth / 2, 61, { align: 'center' });

  // Student Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, 68, pageWidth - 40, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text('CANDIDATE IDENTIFICATION', 25, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  // Left Column
  doc.text('Full Name (Latin):', 25, 83);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(result.studentNameLatin, 60, 83);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Candidate Number:', 25, 91);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(result.candidateNumber, 60, 91);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Track / Major:', 25, 99);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(result.track + ' Track', 60, 99);

  // Right Column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('High School:', 110, 83);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(result.school.length > 28 ? result.school.substring(0, 28) + '...' : result.school, 135, 83);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Exam Center:', 110, 91);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.examCenter} (Rm ${result.roomNumber}, Desk ${result.deskNumber})`, 135, 91);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Province / City:', 110, 99);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(result.province, 135, 99);

  // Overall Status Banner
  const isPass = result.overallStatus === 'PASS';
  if (isPass) {
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.setDrawColor(191, 219, 254); // Blue-200
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
  }
  doc.roundedRect(20, 116, pageWidth - 40, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(isPass ? 30 : 185, isPass ? 64 : 28, isPass ? 175 : 28);
  doc.text('OVERALL EXAMINATION RESULT', 26, 124);

  doc.setFontSize(18);
  doc.text(isPass ? 'PASS (JIAB)' : 'FAIL (THLAK)', 26, 135);

  if (result.grade) {
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text(`Official Grade: ${result.grade}`, 115, 126);
  }
  if (result.totalScore !== undefined) {
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Total Score: ${result.totalScore.toFixed(2)} / ${result.maxTotalScore || 500}`, 115, 135);
  }

  // Subject Table Header
  let startY = 150;
  doc.setFillColor(30, 64, 175);
  doc.rect(20, startY, pageWidth - 40, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('#', 24, startY + 6);
  doc.text('EXAMINATION SUBJECT', 35, startY + 6);
  doc.text('MAX SCORE', 120, startY + 6, { align: 'right' });
  doc.text('OBTAINED SCORE', 155, startY + 6, { align: 'right' });
  doc.text('GRADE', 180, startY + 6, { align: 'center' });

  startY += 9;

  // Subject rows
  const subjects = result.subjects || [];
  subjects.forEach((sub, idx) => {
    const rowY = startY + (idx * 8.5);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, rowY, pageWidth - 40, 8.5, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(20, rowY + 8.5, pageWidth - 20, rowY + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${idx + 1}`, 24, rowY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(sub.nameEn, 35, rowY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${sub.maxScore}`, 120, rowY + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${sub.score.toFixed(1)}`, 155, rowY + 6, { align: 'right' });

    doc.setTextColor(30, 64, 175);
    doc.text(sub.grade || '-', 180, rowY + 6, { align: 'center' });
  });

  // Total Summary Row
  const totalRowY = startY + (subjects.length * 8.5) + 3;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(20, totalRowY, pageWidth - 40, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL COMPOSITE SCORE', 35, totalRowY + 6.5);
  doc.text(`${result.maxTotalScore || 500}`, 120, totalRowY + 6.5, { align: 'right' });
  doc.setTextColor(30, 64, 175);
  doc.text(`${result.totalScore?.toFixed(2) || '0.00'}`, 155, totalRowY + 6.5, { align: 'right' });
  doc.text(result.grade || '-', 180, totalRowY + 6.5, { align: 'center' });

  // Verification and Security Footer
  const footerY = 240;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('SECURITY VERIFICATION HASH:', 20, footerY + 6);
  doc.setFont('courier', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(result.verificationHash, 75, footerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('This digital certificate was directly retrieved from the authenticated Student Bac II account.', 20, footerY + 12);
  doc.text('Certified by Ministry of Education, Youth and Sport (MoEYS) automated examination matching engine.', 20, footerY + 16);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 20, footerY + 20);

  // Official Stamp simulation
  doc.setDrawColor(185, 28, 28); // Official Red Stamp
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth - 65, footerY + 3, 45, 20, 2, 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(185, 28, 28);
  doc.text('OFFICIAL RESULT', pageWidth - 42.5, footerY + 10, { align: 'center' });
  doc.text('MoEYS CAMBODIA', pageWidth - 42.5, footerY + 15, { align: 'center' });
  doc.text('DIGITALLY VERIFIED', pageWidth - 42.5, footerY + 19, { align: 'center' });

  // Save the PDF
  doc.save(`BacII_Result_${result.candidateNumber}_${result.year}.pdf`);
}
