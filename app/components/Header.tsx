import { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  showRecords: boolean;
  setShowRecords: Dispatch<SetStateAction<boolean>>;
  openAssignModal: () => void;
  openRemoveModal: () => void;
}

export function Header({ showRecords, setShowRecords, openAssignModal, openRemoveModal }: HeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between gap-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#064e4f]">Coordinator Dashboard</h1>
        <p className="text-sm text-gray-600">Create and manage weekly lesson plans for grades.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowRecords(s => !s)}
          className="inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-4 py-2.5 font-medium text-white shadow-sm ring-1 ring-[#0f766e]/30 transition hover:bg-[#115e59]"
        >
          {showRecords ? 'Hide Records' : 'Show Records'}
        </button>
        <button
          onClick={openAssignModal}
          className="inline-flex items-center justify-center rounded-lg bg-[#064e4f] px-4 py-2.5 font-medium text-white shadow-sm ring-1 ring-[#0ea5e9]/30 transition hover:bg-[#e29578]"
        >
          Assign Subjects
        </button>
        <button
          onClick={openRemoveModal}
          className="inline-flex items-center justify-center rounded-lg bg-[#f95959] px-4 py-2.5 font-medium text-white shadow-sm ring-1 ring-[#b91c1c]/30 transition hover:bg-[#991b1b]"
        >
          Remove Subjects
        </button>
      </div>
    </header>
  );
}