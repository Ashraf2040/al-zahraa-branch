// app/admin/components/TeacherList.tsx
interface Props {
  show: boolean;
  teachers: any[];
  onEdit: (t: any) => void;
  onDelete: (id: string) => Promise<void>;
  pending: number;
}

export default function TeacherList({
  show,
  teachers,
  onEdit,
  onDelete,
  pending,
}: Props) {
  if (!show) return null;

  return (
    <div className="mx-auto mb-8 max-w-7xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">Teachers</h2>
      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200 shadow-sm">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#006d77] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Password</th>
              <th className="px-4 py-3 text-left">Classes</th>
              <th className="px-4 py-3 text-left">Subjects</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((t, i) => (
              <tr
                key={t.id}
                className={i % 2 === 0 ? 'bg-white hover:bg-[#83c5be]/10' : 'bg-gray-50 hover:bg-[#83c5be]/10'}
              >
                <td className="px-4 py-3">{t.username}</td>
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3">{t.password ?? '-'}</td>
                <td className="px-4 py-3">{t.classes?.map((c: any) => c.name).join(', ') ?? ''}</td>
                <td className="px-4 py-3">{t.subjects?.map((s: any) => s.name).join(', ') ?? ''}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    disabled={pending > 0}
                    className="rounded-md bg-[#0ea5e9] px-3 py-1.5 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    disabled={pending > 0}
                    className="rounded-md bg-[#e29578] px-3 py-1.5 text-white"
                  >
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