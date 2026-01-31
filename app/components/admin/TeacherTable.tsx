'use client';

type Props = {
  teachers: any[];
  pending: boolean;
  onEdit: (teacher: any) => void;
  onDelete: (id: string) => Promise<void>;
};

export default function TeacherTable({ teachers, pending, onEdit, onDelete }: Props) {
  return (
    <div className="mx-auto mb-8 max-w-7xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">Teachers</h2>
      <div className="overflow-scroll rounded-xl ring-1 ring-gray-200 shadow-sm">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#006d77] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Username</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Password</th>
              <th className="px-4 py-3 text-left font-semibold">Classes</th>
              <th className="px-4 py-3 text-left font-semibold">Subjects</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((t: any, idx: number) => (
              <tr key={t.id} className={idx % 2 === 0 ? 'bg-white hover:bg-[#83c5be]/10' : 'bg-gray-50 hover:bg-[#83c5be]/10'}>
                <td className="px-4 py-3">{t.username}</td>
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3">{t.password ?? '-'}</td>
                <td className="px-4 py-3">{(t.classes ?? []).map((c: any) => c.name).join(', ')}</td>
                <td className="px-4 py-3">{(t.subjects ?? []).map((s: any) => s.name).join(', ')}</td>
                <td className="px-4 py-3 flex">
                  <button onClick={() => onEdit(t)} disabled={pending} className="rounded-md bg-[#0ea5e9] px-3 py-1.5 text-white">
                    Edit
                  </button>
                  <button onClick={() => onDelete(t.id)} disabled={pending} className="ml-4 rounded-md bg-[#e29578] px-3 py-1.5 text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
