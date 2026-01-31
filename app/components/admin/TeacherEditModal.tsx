'use client';

type EditingTeacher = {
  id: string;
  username: string;
  name: string;
  password?: string;
  classIds: string[];
  subjectIds: string[];
};

type Item = { id: string; name: string };

type Props = {
  editingTeacher: EditingTeacher;
  setEditingTeacher: (t: EditingTeacher) => void;
  classes: Item[];
  subjects: Item[];
  pending: boolean;
  onClose: () => void;
  onSave: (payload: EditingTeacher) => Promise<void>;
};

export default function TeacherEditModal({
  editingTeacher,
  setEditingTeacher,
  classes,
  subjects,
  pending,
  onClose,
  onSave,
}: Props) {
  const availableClasses = classes.filter((c) => !(editingTeacher.classIds ?? []).includes(c.id));
  const assignedClasses = classes.filter((c) => (editingTeacher.classIds ?? []).includes(c.id));
  const availableSubjects = subjects.filter((s) => !(editingTeacher.subjectIds ?? []).includes(s.id));
  const assignedSubjects = subjects.filter((s) => (editingTeacher.subjectIds ?? []).includes(s.id));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#064e4f]">Edit Teacher</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100" aria-label="Close">
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSave(editingTeacher);
          }}
          className="grid grid-cols-1 gap-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={editingTeacher.username}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, username: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editingTeacher.name}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password <span className="text-gray-400">(leave blank to keep)</span>
              </label>
              <input
                type="password"
                value={editingTeacher.password ?? ''}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, password: e.target.value })}
                placeholder="Leave empty to keep current password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-[#064e4f]">Classes</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Available</div>
                <div className="max-h-44 overflow-auto">
                  {availableClasses.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEditingTeacher({ ...editingTeacher, classIds: [...(editingTeacher.classIds ?? []), c.id] })}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      {c.name}
                    </button>
                  ))}
                  {availableClasses.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">No more classes</div>}
                </div>
              </div>

              <div className="grid place-items-center">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTeacher({
                        ...editingTeacher,
                        classIds: [...(editingTeacher.classIds ?? []), ...availableClasses.map((c) => c.id)],
                      })
                    }
                    className="rounded-md bg-[#83c5be] px-3 py-1.5 text-sm text-slate-900 ring-1 ring-[#83c5be]/40"
                  >
                    Add all →
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTeacher({ ...editingTeacher, classIds: [] })}
                    className="rounded-md bg-[#e29578] px-3 py-1.5 text-sm text-white ring-1 ring-[#e29578]/20"
                  >
                    ← Remove all
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Assigned</div>
                <div className="max-h-44 overflow-auto">
                  {assignedClasses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">{c.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTeacher({
                            ...editingTeacher,
                            classIds: (editingTeacher.classIds ?? []).filter((id) => id !== c.id),
                          })
                        }
                        className="rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(editingTeacher.classIds ?? []).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">No classes assigned</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-[#064e4f]">Subjects</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Available</div>
                <div className="max-h-44 overflow-auto">
                  {availableSubjects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setEditingTeacher({
                          ...editingTeacher,
                          subjectIds: [...(editingTeacher.subjectIds ?? []), s.id],
                        })
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      {s.name}
                    </button>
                  ))}
                  {availableSubjects.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">No more subjects</div>}
                </div>
              </div>

              <div className="grid place-items-center">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTeacher({
                        ...editingTeacher,
                        subjectIds: [...(editingTeacher.subjectIds ?? []), ...availableSubjects.map((s) => s.id)],
                      })
                    }
                    className="rounded-md bg-[#83c5be] px-3 py-1.5 text-sm text-slate-900 ring-1 ring-[#83c5be]/40"
                  >
                    Add all →
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTeacher({ ...editingTeacher, subjectIds: [] })}
                    className="rounded-md bg-[#e29578] px-3 py-1.5 text-sm text-white ring-1 ring-[#e29578]/20"
                  >
                    ← Remove all
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-600">Assigned</div>
                <div className="max-h-44 overflow-auto">
                  {assignedSubjects.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">{s.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTeacher({
                            ...editingTeacher,
                            subjectIds: (editingTeacher.subjectIds ?? []).filter((id) => id !== s.id),
                          })
                        }
                        className="rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(editingTeacher.subjectIds ?? []).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">No subjects assigned</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" disabled={pending} className="rounded-lg bg-[#006d77] px-4 py-2.5 text-white">
              {pending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
