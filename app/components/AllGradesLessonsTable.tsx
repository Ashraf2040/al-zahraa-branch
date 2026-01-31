'use client';


import LessonsTable from './LessonsTable';


interface Lesson {
  id: string;
  subject?: { name: string };
  unit?: string;
  lesson?: string;
  objective?: string;
  pages?: string;
  homework?: string;
  comments?: string;
  __className?: string;
}

interface Props {
  loading: boolean;
  dataByClass: Record<string, Lesson[]>;
  date: string;
  onPrint?: () => void;   // optional – we provide a fallback
}

/* ------------------------------------------------------------------
   PRINT-ONLY CONTAINER – off-screen but fully rendered for the printer
   ------------------------------------------------------------------ */
function PrintOnlyContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '210mm',           // A4 width
        padding: '15mm',
        background: 'white',
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   Global print handler – builds a real document with proper CSS
   ------------------------------------------------------------------ */
// Helper to sort subjects in a custom order (edit as needed)
function subjectSortIndex(subjectName: string): number {
  // Example: custom order for common subjects
  const order = [
    'Islamic',
    'Arabic',
    'Quran',
    'Math',
    'Science',
    'English',
    'Social Studies',
    'PE',
    'Art',
  ];
  const idx = order.indexOf(subjectName);
  return idx === -1 ? order.length : idx;
}

function printAllGrades(dataByClass: Record<string, Lesson[]>, date: string) {
  const w = window.open('', '_blank');
  if (!w) {
    alert('Please allow pop-ups to print.');
    return;
  }

  const dateStr = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build HTML for every class (same markup as LessonsTable)
  const sections = Object.entries(dataByClass)
    .map(([classId, lessons]) => {
      const className = lessons[0]?.__className ?? 'Unknown Class';

      if (lessons.length === 0) return '';

      const rows = lessons
        .sort(
          (a, b) =>
            subjectSortIndex(a.subject?.name ?? '') - subjectSortIndex(b.subject?.name ?? '')
        )
        .map((l, i) => {
          const bg = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
          return `
            <tr class="${bg}">
              <td class="px-6 py-3 font-medium text-gray-800">${l.subject?.name ?? ''}</td>
              <td class="px-6 py-3">${l.unit ?? ''}</td>
              <td class="px-6 py-3">${l.lesson ?? ''}</td>
              <td class="px-6 py-3">${l.objective ?? ''}</td>
              <td class="px-6 py-3">${l.pages ?? ''}</td>
              <td class="px-6 py-3">${l.homework || '—'}</td>
              <td class="px-6 py-3 text-sm" dir="${
                ['Islamic', 'Arabic'].includes(l.subject?.name ?? '') ? 'rtl' : 'ltr'
              }">${l.comments || '—'}</td>
            </tr>
          `;
        })
        .join('');

      return `
        <div style="page-break-after:always; margin-bottom:40px;">
          <div style="background:#006d77; color:white; padding:8px 12px; font-weight:bold; font-size:1.1rem;">
            ${className} – ${dateStr}
          </div>
          <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:0.9rem;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Subject</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Unit</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Lesson</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Objective</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Pages</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Homework</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left;">Comments</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    })
    .join('');

  const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Grades – ${dateStr}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 15mm; }
    h1 { text-align: center; color: #064e4f; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #006d77; color: white; }
    tr:nth-child(even) { background: #f8fafc; }
    @page { size: A4; margin: 15mm; }
  </style>
</head>
<body>
  <h1>All Grades Academic Plan – ${dateStr}</h1>
  ${sections}
</body>
</html>`;

  w.document.write(printHTML);
  w.document.close();
  w.focus();
  w.onload = () => setTimeout(() => w.print(), 600);
}

export default function AllGradesLessonsTable({
  loading,
  dataByClass,
  date,
  onPrint,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#006d77] border-t-transparent" />
        <span className="ml-2 text-gray-600">Loading all grades…</span>
      </div>
    );
  }

  const classIds = Object.keys(dataByClass);
  if (classIds.length === 0) {
    return <p className="text-center text-gray-500">No lessons found for the selected date.</p>;
  }

  return (
    <>
      {/* ---------- OFF-SCREEN PRINTABLE CONTENT ---------- */}
      <PrintOnlyContainer>
        {classIds.map(classId => {
          const lessons = dataByClass[classId];
          const className = lessons[0]?.__className ?? 'Unknown Class';

          return lessons.length === 0 ? null : (
            <div key={classId} style={{ pageBreakAfter: 'always', marginBottom: '40px' }}>
              <div style={{ background: '#006d77', color: 'white', padding: '8px 12px', fontWeight: 'bold' }}>
                {className} – {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>

              <LessonsTable show={true} loading={false} lessons={lessons} onPrint={() => {}} />
            </div>
          );
        })}
      </PrintOnlyContainer>

      {/* ---------- VISIBLE UI (same as before) ---------- */}
      <div className="mt-8 space-y-12">
        {classIds.map(classId => {
          const lessons = dataByClass[classId];
          const className = lessons[0]?.__className ?? 'Unknown Class';

          return (
            <section key={classId} className="grade-section">
              <div className="grade-header">
                {className} – {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>

              <LessonsTable show={true} loading={false} lessons={lessons} onPrint={() => {}} />
            </section>
          );
        })}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (onPrint) onPrint();
              else printAllGrades(dataByClass, date);
            }}
            className="btn-primary"
          >
            Print All Grades
          </button>
        </div>
      </div>
    </>
  );
}