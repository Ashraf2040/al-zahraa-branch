'use client';

type Row = {
  id: string;
  username: string;
  name: string;
  submitted: boolean;
  submittedAt?: string | null;
};

const formatTime = (ts?: string | null) => {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

type Props = {
  rows: Row[];
};

export default function AssignedTeachersTable({ rows }: Props) {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-[#064e4f]">Assigned Teachers</h3>
      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 font-semibold">Username</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Submitted</th>
              <th className="px-3 py-2 font-semibold">First Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">{r.username}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.submitted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {r.submitted ? 'Submitted' : 'Not Submitted'}
                  </span>
                </td>
                <td className="px-3 py-2">{formatTime(r.submittedAt)}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                  No assigned teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
