
'use client';

import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { useAdminData } from '@/hooks/useAdminData';
import { useAssignedTeachers } from '@/hooks/useAssignedTeachers';
import CreateTeacherForm from '@/app/components/CreateTeacherForm';
import CreateClassForm from '@/app/components/CreateClassForm';
import CreateSubjectForm from '@/app/components/CreateSubjectForm';
import TeacherList from '@/app/components/TeacherList';
import EditTeacherModal from '@/app/components/EditTeacherModal';
import LessonsFilter from '@/app/components/LessonsFilter';
import LessonsTable from '@/app/components/LessonsTable';
import AllGradesLessonsTable from '@/app/components/AllGradesLessonsTable';
import AssignedTeachersTable from '@/app/components/AssignedTeachersTable';
import EditSchedule from '@/app/components/EditSchedule';

// Imports kept intact


export default function AdminDashboard() {
  const t = useTranslations('AdminDashboard');
  const { data: session } = useSession();
  const router = useRouter();

  // ——— Admin Data ———
  const {
    teachers,
    classes,
    subjects,
    isLoading: adminLoading,
    error: adminError,
    pending,
    track,
    fetchJson,
    refreshTeachers,
    refreshClasses,
    refreshSubjects,
  } = useAdminData();

  // ——— UI Toggles ———
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  const [assignedData, setAssignedData] = useState<any[]>([]);
  const [allGradesLessons, setAllGradesLessons] = useState<Record<string, any[]>>({});
  const [allGradesLoading, setAllGradesLoading] = useState(false);
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // ——— Filter & Lessons ———
  const [filter, setFilter] = useState({ classId: '', date: '' });
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState({});

  // ——— Edit Modal ———
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // FIX: Use useRef to track if initial data has been loaded
  const hasInitialized = useRef(false);

  const today = new Date().toISOString().slice(0, 10);

  // ——— CSV Helpers ———
  const toCsv = (array: any[][]) => array.map(row => row.map(item => `"${item}"`).join(',')).join('\n');

  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleToggleLog = (name: string) => {
    console.log(`[AdminDashboard] Clicking: ${name}`);
  };

  const handleFilter = async () => {
    if (!filter.classId || !filter.date) {
      toast.error(t('errors.selectClassAndDate'));
      return;
    }
    try {
      setLessonsLoading(true);
      const data = await fetch(`/api/lessons?classId=${filter.classId}&date=${filter.date}`)
        .then((r) => r.json())
        .catch(() => []);
      setLessons(data ?? []);
      setShowLessons(true);
    } catch (err) {
      toast.error(t('errors.loadLessons'));
      console.error(err);
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    if (filter.classId) {
      fetch(`/api/schedule?classId=${filter.classId}`)
        .then((res) => res.json())
        .then((data) => setScheduleInfo(data.schedule || {}));
    }
  }, [filter.classId]);

  const newAssigned = useAssignedTeachers({
    lessons,
    teachers,
    filter,
    scheduleInfo,
    subjects,
  });

  useEffect(() => {
    if (Array.isArray(newAssigned) && newAssigned.length > 0) {
      setAssignedData(newAssigned);
    }
  }, [newAssigned]);

  const handleShowAssigned = async () => {
    if (!filter.classId || !filter.date) {
      toast.error(t('errors.selectClassAndDate'));
      return;
    }
    const res = await fetch(`/api/schedule?classId=${filter.classId}`);
    const data = await res.json();
    setScheduleInfo(data.schedule || {});
    setShowAssigned(true);
  };

  const handleSaveAllGrades = async () => {
    if (!filter.date) {
      toast.error(t('errors.selectDateFirst'));
      return;
    }
    setAllGradesLoading(true);
    setShowAllGrades(true);
    setShowLessons(false);
    setShowAssigned(false);
    try {
      const promises = classes.map((cls) =>
        fetch(`/api/lessons?classId=${cls.id}&date=${filter.date}`)
          .then((r) => r.json())
          .then((data) => ({ classId: cls.id, className: cls.name, lessons: data ?? [] }))
          .catch(() => ({ classId: cls.id, className: cls.name, lessons: [] }))
      );

      const results = await Promise.all(promises);
      const grouped: Record<string, any[]> = {};
      results.forEach((r) => {
        grouped[r.classId] = r.lessons.map((l: any) => ({
          ...l,
          __className: r.className,
        }));
      });
      setAllGradesLessons(grouped);
    } catch (err) {
      toast.error(t('errors.loadAllGrades'));
      console.error(err);
    } finally {
      setAllGradesLoading(false);
    }
  };

const handlePrint = () => {
  const w = window.open('', '_blank');
  if (!w) return;
  
  const date = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const cls = classes.find((c) => c.id === filter.classId);
  const html = document.getElementById('lessons-table')?.outerHTML ?? '';
  
w.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cls?.name ?? ''} - ${date}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --primary-color: #006d77;
      --primary-dark: #064e4f;
      --primary-light: #83c5be;
      --accent-color: #e29578;
      --text-dark: #1a1a2e;
      --text-light: #4a5568;
      --bg-light: #f8fafc;
      --bg-white: #ffffff;
      --border-color: #e2e8f0;
      --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    @page {
      size: A4;
      margin: 15mm 10mm 25mm 10mm;
    }

    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      font-size: 12pt;
      line-height: 1.7;
      color: var(--text-dark);
      background: var(--bg-white);
      direction: rtl;
      text-align: right;
      -webkit-font-smoothing: antialiased;
    }

    .page-container {
      max-width: 310mm;
      margin: 0 auto;
      padding: 10mm;
      padding-bottom: 30mm;
    }

    .report-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-white) 100%);
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }

    .report-header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, var(--primary-color), var(--accent-color));
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #ffffff 0%, var(--bg-light) 100%);
      border-radius: 14px;
      border: 2px solid var(--primary-light);
      box-shadow: 0 2px 8px rgba(0, 109, 119, 0.15);
      padding: 8px;
    }

    .logo-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .logo-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .institution-info h2 {
      font-size: 18pt;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 4px;
    }

    .institution-info p {
      font-size: 10pt;
      color: var(--text-light);
      font-weight: 500;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 12px 16px;
      background: var(--bg-white);
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }

    .report-date {
      font-size: 11pt;
      color: var(--text-dark);
      font-weight: 600;
    }

    .report-id {
      font-size: 9pt;
      color: var(--primary-color);
      font-weight: 600;
      padding: 4px 10px;
      background: rgba(0, 109, 119, 0.08);
      border-radius: 20px;
    }

    .report-title {
      text-align: center;
      padding: 28px 20px;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-white) 100%);
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
    }

    .report-title h1 {
      font-size: 22pt;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 10px;
    }

    .accent-line {
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-color), var(--primary-light), var(--primary-color));
      border-radius: 2px;
      margin: 12px auto;
    }

    .title-class-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
    }

    .report-title .class-name {
      font-size: 15pt;
      color: var(--primary-color);
      font-weight: 600;
      padding: 6px 20px;
      background: rgba(0, 109, 119, 0.08);
      border-radius: 25px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-card {
      background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-white) 100%);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px 18px;
      border-right: 4px solid var(--primary-color);
      box-shadow: var(--shadow);
    }

    .info-card .label {
      font-size: 9pt;
      color: var(--text-light);
      margin-bottom: 6px;
      font-weight: 500;
    }

    .info-card .value {
      font-size: 12pt;
      color: var(--text-dark);
      font-weight: 600;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 24px 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }

    .data-table th {
      background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      font-weight: 600;
      font-size: 11pt;
      padding: 16px 14px;
      text-align: right;
      border-bottom: 3px solid var(--primary-dark);
    }

    .data-table th:first-child { border-top-right-radius: 11px; }
    .data-table th:last-child { border-top-left-radius: 11px; }

    .data-table tbody tr:nth-child(odd) { background: var(--bg-light); }
    .data-table tbody tr:nth-child(even) { background: var(--bg-white); }

    .data-table td {
      padding: 14px;
      border-bottom: 1px solid var(--border-color);
      font-size: 10pt;
    }

    .data-table tbody tr:last-child td { border-bottom: none; }
    .data-table tbody tr:last-child td:first-child { border-bottom-right-radius: 11px; }
    .data-table tbody tr:last-child td:last-child { border-bottom-left-radius: 11px; }

    .report-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      font-size: 8pt;
      color: var(--text-light);
      background: var(--bg-light);
      border-top: 1px solid var(--border-color);
    }

    @media print {
      html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .report-header, .report-title, .info-card, .data-table { box-shadow: none !important; }
      .data-table { page-break-inside: auto; }
      .data-table tr { page-break-inside: avoid; }
      .data-table thead { display: table-header-group; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <header class="report-header">
      <div class="header-right">
        <div class="logo-container">
          <img src="/forqan-logo.jpeg" alt="شعار مدرسة الفرقان" onerror="this.outerHTML='<div class=\\'logo-fallback\\'>ف</div>'">
        </div>
        <div class="institution-info">
          <h2>مدرسة الفرقان الأهلية</h2>
          <p>وزارة التربية والتعليم</p>
        </div>
      </div>
      <div class="header-left">
        <div class="report-date">${date}</div>
        <div class="report-id">رقم التقرير: ${Date.now().toString(36).toUpperCase()}</div>
      </div>
    </header>

    <div class="report-title">
      <h1>${t('print.dailyPlan')}</h1>
      <div class="accent-line"></div>
      <div class="title-class-wrapper">
        <div class="class-name">${cls?.name ?? 'غير محدد'}</div>
      </div>
    </div>

   

    <main>
      ${html.replace(/<table/g, '<table class="data-table"')}
    </main>

    <footer class="report-footer">
      <span>تم إنشاء هذا التقرير تلقائياً • نظام إدارة الخطط الدراسية</span>
      <span>© ${new Date().getFullYear()} جميع الحقوق محفوظة</span>
    </footer>
  </div>

  <script>
    const table = document.querySelector('.data-table');
    if (table) {
      const rowCount = table.querySelectorAll('tbody tr').length;
      document.getElementById('record-count').textContent = rowCount.toLocaleString('ar-SA');
    }
    document.fonts.ready.then(() => setTimeout(() => window.print(), 300));
  </script>
</body>
</html>
`);
  
  w.document.close();
  w.focus();
};

  return (
    <div className="min-h-screen w-ful text-slate-900 relative overflow-hidden bg-slate-50 selection:bg-teal-100 selection:text-teal-900 pt-24">

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-slate-100/80 via-transparent to-transparent"></div>

        {/* Decorative Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-400/20 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4 border-b border-slate-100 pb-6">
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
      {t('title')}
      <span className="text-slate-400">.</span>
    </h1>
    <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
      {t('subtitle')}
    </p>
  </div>
  
  <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-xs font-semibold text-slate-600">
      {t('status')}
    </span>
  </div>
</div>

        {/* ================= QUICK ACTIONS GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">

          {/* Create Teacher */}
          <button
            onClick={() => {
              handleToggleLog('Create Teacher Form');
              setShowTeacherForm((v) => !v);
              // Close others for cleaner UI
              if (!showTeacherForm) { setShowClassForm(false); setShowSubjectForm(false); setShowTeacherDetails(false); }
            }}
            className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${showTeacherForm
                ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/10 shadow-md shadow-teal-500/5'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-1'
              }`}
          >
            <div className={`p-3 rounded-xl transition-all duration-300 ${showTeacherForm
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-600/20'
              }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <span className={`text-sm font-semibold transition-colors ${showTeacherForm ? 'text-teal-800' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
              {showTeacherForm ? t('buttons.hideCreateTeacher') : t('buttons.createTeacher')}
            </span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => {
              const header = [
                t('table.username'),
                t('table.name'),
                t('table.classes'),
                t('table.subjects'),
              ];
              const rows = teachers.map((teacher: any) => [
                teacher.username ?? '',
                teacher.name ?? '',
                (teacher.classes ?? []).map((c: any) => c.name ?? '').join(' | '),
                (teacher.subjects ?? []).map((s: any) => s.name ?? '').join(' | '),
              ]);
              downloadCsv(
                `teachers_${new Date().toISOString().slice(0, 10)}.csv`,
                toCsv([header, ...rows])
              );
            }}
            className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              {t('buttons.exportTeachersCsv')}
            </span>
          </button>

          {/* Show Teacher Details */}
          <button
            onClick={() => {
              handleToggleLog('Show Teacher Details');
              setShowTeacherDetails((v) => !v);
              if (!showTeacherDetails) { setShowTeacherForm(false); setShowClassForm(false); setShowSubjectForm(false); }
            }}
            className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${showTeacherDetails
                ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/10 shadow-md shadow-blue-500/5'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-1'
              }`}
          >
            <div className={`p-3 rounded-xl transition-all duration-300 ${showTeacherDetails
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20'
              }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 0h6m2 2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <span className={`text-sm font-semibold transition-colors ${showTeacherDetails ? 'text-blue-800' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
              {showTeacherDetails ? t('buttons.hideTeacherDetails') : t('buttons.showTeacherDetails')}
            </span>
          </button>

          {/* Cards View */}
          <button
            onClick={() => router.push('/admin/teacherData')}
            className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              {t('buttons.teachersCards')}
            </span>
          </button>

          {/* Create Class */}
          <button
            onClick={() => {
              handleToggleLog('Create Class Form');
              setShowClassForm((v) => !v);
              if (!showClassForm) { setShowTeacherForm(false); setShowSubjectForm(false); setShowTeacherDetails(false); }
            }}
            className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${showClassForm
                ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/10 shadow-md shadow-teal-500/5'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-1'
              }`}
          >
            <div className={`p-3 rounded-xl transition-all duration-300 ${showClassForm
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-600/20'
              }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <span className={`text-sm font-semibold transition-colors ${showClassForm ? 'text-teal-800' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
              {showClassForm ? t('buttons.hideCreateClass') : t('buttons.createClass')}
            </span>
          </button>

          {/* Create Subject */}
          <button
            onClick={() => {
              handleToggleLog('Create Subject Form');
              setShowSubjectForm((v) => !v);
              if (!showSubjectForm) { setShowTeacherForm(false); setShowClassForm(false); setShowTeacherDetails(false); }
            }}
            className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${showSubjectForm
                ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/10 shadow-md shadow-teal-500/5'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-1'
              }`}
          >
            <div className={`p-3 rounded-xl transition-all duration-300 ${showSubjectForm
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-600/20'
              }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <span className={`text-sm font-semibold transition-colors ${showSubjectForm ? 'text-teal-800' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
              {showSubjectForm ? t('buttons.hideCreateSubject') : t('buttons.createSubject')}
            </span>
          </button>

          {/* Manage Schedule */}
          <button
            onClick={() => {
              handleToggleLog('Manage Schedules');
              setShowScheduleModal(true);
            }}
            className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              {t('buttons.manageSchedules')}
            </span>
          </button>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Forms */}
          <CreateTeacherForm
            show={showTeacherForm}
            classes={classes}
            subjects={subjects}
            track={track}
            fetchJson={fetchJson}
            toast={toast}
            onSuccess={() => {
              setShowTeacherForm(false);
              refreshTeachers();
            }}
            pending={pending}
          />

          <CreateClassForm
            show={showClassForm}
            track={track}
            fetchJson={fetchJson}
            toast={toast}
            onSuccess={() => {
              setShowClassForm(false);
              refreshClasses();
            }}
            pending={pending}
          />

          <CreateSubjectForm
            show={showSubjectForm}
            track={track}
            fetchJson={fetchJson}
            toast={toast}
            onSuccess={() => {
              setShowSubjectForm(false);
              refreshSubjects();
            }}
            pending={pending}
          />

          {/* Teacher List */}
          <TeacherList
            show={showTeacherDetails}
            teachers={teachers}
            onEdit={(teacher) => {
              setEditingTeacher({
                id: teacher.id,
                username: teacher.username,
                name: teacher.name,
                password: '',
                classIds: teacher.classes.map((c: any) => c.id),
                subjectIds: teacher.subjects.map((s: any) => s.id),
              });
              setShowEditModal(true);
            }}
            onDelete={async (id) => {
              if (!confirm(t('confirm.deleteTeacher'))) return;
              await toast.promise(
                track(fetchJson(`/api/admin/teachers/${id}`, { method: 'DELETE' })),
                {
                  loading: t('toast.loading'),
                  success: t('toast.deleted'),
                  error: t('toast.failed'),
                }
              );
              refreshTeachers();
            }}
            pending={pending}
          />

          {/* Edit Modal */}
          {showEditModal && editingTeacher && (
            <EditTeacherModal
              teacher={editingTeacher}
              setTeacher={setEditingTeacher}
              classes={classes}
              subjects={subjects}
              onClose={() => {
                setShowEditModal(false);
                setEditingTeacher(null);
              }}
              onSave={async () => {
                const body: any = {
                  username: editingTeacher.username,
                  name: editingTeacher.name,
                  classIds: editingTeacher.classIds,
                  subjectIds: editingTeacher.subjectIds,
                };
                if (editingTeacher.password) body.password = editingTeacher.password;

                await toast.promise(
                  track(
                    fetchJson(`/api/admin/teachers/${editingTeacher.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    })
                  ),
                  {
                    loading: t('toast.saving'),
                    success: t('toast.updated'),
                    error: t('toast.failed'),
                  }
                );
                refreshTeachers();
                setShowEditModal(false);
                setEditingTeacher(null);
              }}
              pending={pending}
            />
          )}

          {/* Filter & Tables Container */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-slate-300">
            <LessonsFilter
              filter={filter}
              setFilter={setFilter}
              classes={classes}
              onFilter={handleFilter}
              showLessons={showLessons}
              setShowLessons={setShowLessons}
              showAssigned={showAssigned}
              setShowAssigned={setShowAssigned}
              pending={lessonsLoading}
            />

            {showLessons && (
              <LessonsTable
                show={showLessons}
                loading={lessonsLoading}
                lessons={lessons}
                onPrint={handlePrint}
              />
            )}

            {showAllGrades && (
              <AllGradesLessonsTable
                loading={allGradesLoading}
                dataByClass={allGradesLessons}
                date={filter.date}
              />
            )}

            {showAssigned && (
              <AssignedTeachersTable
                show={showAssigned}
                data={assignedData}
                loading={lessonsLoading}
                scheduleInfo={scheduleInfo}
                filter={filter}
              />
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && session?.user && (
        <EditSchedule
          show={showScheduleModal}
          onClose={() => {
            console.log("Closing Schedule Modal");
            setShowScheduleModal(false);
          }}
          classes={classes}
          subjects={subjects}
          user={{ ...session.user, id: session.user.email || 'unknown' } as any}
        />
      )}

      {/* Floating Action Button for "Save All Grades" */}
      <div className=" bottom-8 right-8 z-40">
        <button
          onClick={handleSaveAllGrades}
          disabled={allGradesLoading}
          className="group flex items-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl shadow-slate-900/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {allGradesLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          )}
          <span className="font-medium">{allGradesLoading ? t('buttons.savingAllGrades') : t('buttons.saveAllGrades')}</span>
        </button>
      </div>

      {/* Global loading overlay */}
      {pending > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-lg animate-pulse">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0 0l-3-3m-3 3l-3-3m3 3V4"></path></svg>
            </div>
            <p className="text-lg font-bold text-slate-800">{t('loading.working')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
