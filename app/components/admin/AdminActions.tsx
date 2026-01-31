'use client';

type Props = {
  pending: boolean;
  showTeacherForm: boolean;
  toggleTeacherForm: () => void;
  showTeacherDetails: boolean;
  toggleTeacherDetails: () => void;
  showClassForm: boolean;
  toggleClassForm: () => void;
  showSubjectForm: boolean;
  toggleSubjectForm: () => void;
  onExportCsv: () => void;
  onGoTeacherData: () => void;
};

export default function AdminActions({
  pending,
  showTeacherForm,
  toggleTeacherForm,
  showTeacherDetails,
  toggleTeacherDetails,
  showClassForm,
  toggleClassForm,
  showSubjectForm,
  toggleSubjectForm,
  onExportCsv,
  onGoTeacherData,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button onClick={toggleTeacherForm} className="inline-flex items-center justify-center rounded-lg bg-[#006d77] px-4 py-2.5 text-white shadow-sm ring-1 ring-[#006d77]/20 transition hover:bg-[#006d77]/90 focus:outline-none focus:ring-2 focus:ring-[#006d77] focus:ring-offset-2" disabled={pending}>
        {showTeacherForm ? 'Hide Create Teacher' : 'Create Teacher'}
      </button>

      <button onClick={toggleTeacherDetails} className="inline-flex items-center justify-center rounded-lg bg-[#83c5be] px-4 py-2.5 text-slate-900 shadow-sm ring-1 ring-[#83c5be]/40 transition hover:bg-[#83c5be]/90 focus:outline-none focus:ring-2 focus:ring-[#83c5be] focus:ring-offset-2" disabled={pending}>
        {showTeacherDetails ? 'Hide Teacher Details' : 'Show Teacher Details'}
      </button>

      <button onClick={onExportCsv} className="inline-flex items-center justify-center rounded-lg bg-[#0ea5e9] px-4 py-2.5 text-white shadow-sm ring-1 ring-sky-200 transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2" disabled={pending} title="Export teacher details">
        Export Teacher CSV
      </button>

      <button onClick={onGoTeacherData} className="inline-flex items-center justify-center rounded-lg border border-[#0ea5e9]/30 bg-white px-4 py-2.5 text-[#0ea5e9] shadow-sm transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2" disabled={pending}>
        Teacher Data Page
      </button>

      <button onClick={toggleClassForm} className="inline-flex items-center justify-center rounded-lg border border-[#006d77]/30 bg-white px-4 py-2.5 text-[#006d77] shadow-sm transition hover:bg-[#006d77]/5 focus:outline-none focus:ring-2 focus:ring-[#006d77] focus:ring-offset-2" disabled={pending}>
        {showClassForm ? 'Hide Create Class' : 'Create Class'}
      </button>

      <button onClick={toggleSubjectForm} className="inline-flex items-center justify-center rounded-lg bg-[#e29578] px-4 py-2.5 text-white shadow-sm ring-1 ring-[#e29578]/20 transition hover:bg-[#e29578]/90 focus:outline-none focus:ring-2 focus:ring-[#e29578] focus:ring-offset-2" disabled={pending}>
        {showSubjectForm ? 'Hide Create Subject' : 'Create Subject'}
      </button>
    </div>
  );
}
