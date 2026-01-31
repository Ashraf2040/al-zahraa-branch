// app/admin/components/EditTeacherModal.tsx
interface Teacher {
  id: string;
  username: string;
  name: string;
  password: string;
  classIds: string[];
  subjectIds: string[];
}

interface Props {
  teacher: Teacher;
  setTeacher: (t: Teacher) => void;
  classes: any[];
  subjects: any[];
  onClose: () => void;
  onSave: () => Promise<void>;
  pending: number;
}

export default function EditTeacherModal({
  teacher,
  setTeacher,
  classes,
  subjects,
  onClose,
  onSave,
  pending,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#064e4f]">Edit Teacher</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100">
            close
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="grid grid-cols-1 gap-6"
        >
          {/* Basic */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              placeholder="Username"
              value={teacher.username}
              onChange={(e) => setTeacher({ ...teacher, username: e.target.value })}
              required
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              placeholder="Name"
              value={teacher.name}
              onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
              required
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              type="password"
              placeholder="New password (leave blank to keep)"
              value={teacher.password}
              onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Classes */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-[#064e4f]">Classes</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Available</div>
                <div className="max-h-44 overflow-auto">
                  {classes
                    .filter((c) => !teacher.classIds.includes(c.id))
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setTeacher({ ...teacher, classIds: [...teacher.classIds, c.id] })
                        }
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {c.name}
                      </button>
                    ))}
                </div>
              </div>

              <div className="grid place-items-center">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = classes
                        .filter((c) => !teacher.classIds.includes(c.id))
                        .map((c) => c.id);
                      setTeacher({ ...teacher, classIds: [...teacher.classIds, ...remaining] });
                    }}
                    className="rounded-md bg-[#83c5be] px-3 py-1.5 text-sm text-slate-900"
                  >
                    Add all
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeacher({ ...teacher, classIds: [] })}
                    className="rounded-md bg-[#e29578] px-3 py-1.5 text-sm text-white"
                  >
                    Remove all
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Assigned</div>
                <div className="max-h-44 overflow-auto">
                  {classes
                    .filter((c) => teacher.classIds.includes(c.id))
                    .map((c) => (
                      <div key={c.id} className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm">{c.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setTeacher({
                              ...teacher,
                              classIds: teacher.classIds.filter((id) => id !== c.id),
                            })
                          }
                          className="rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subjects – identical pattern */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-[#064e4f]">Subjects</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Available</div>
                <div className="max-h-44 overflow-auto">
                  {subjects
                    .filter((s) => !teacher.subjectIds.includes(s.id))
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setTeacher({ ...teacher, subjectIds: [...teacher.subjectIds, s.id] })
                        }
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>

              <div className="grid place-items-center">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = subjects
                        .filter((s) => !teacher.subjectIds.includes(s.id))
                        .map((s) => s.id);
                      setTeacher({ ...teacher, subjectIds: [...teacher.subjectIds, ...remaining] });
                    }}
                    className="rounded-md bg-[#83c5be] px-3 py-1.5 text-sm text-slate-900"
                  >
                    Add all
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeacher({ ...teacher, subjectIds: [] })}
                    className="rounded-md bg-[#e29578] px-3 py-1.5 text-sm text-white"
                  >
                    Remove all
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Assigned</div>
                <div className="max-h-44 overflow-auto">
                  {subjects
                    .filter((s) => teacher.subjectIds.includes(s.id))
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm">{s.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setTeacher({
                              ...teacher,
                              subjectIds: teacher.subjectIds.filter((id) => id !== s.id),
                            })
                          }
                          className="rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800">
              Cancel
            </button>
            <button type="submit" disabled={pending > 0} className="btn-primary">
              {pending > 0 ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}