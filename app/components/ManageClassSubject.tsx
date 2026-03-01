'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface Props {
  show: boolean;
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  toast: typeof toast;
  onSuccess?: () => void;
  pending: number;
}

export default function ManageClassSubject({ show, track, fetchJson, toast, onSuccess, pending }: Props) {
  const t = useTranslations('ManageClassSubject');
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    const [cls, subs] = await Promise.all([
      fetchJson('/api/classes'),
      fetchJson('/api/subjects'),
    ]);
    setClasses(Array.isArray(cls) ? cls : []);
    setSubjects(Array.isArray(subs) ? subs : []);
  };

  const handleEdit = async (type: 'class' | 'subject', id: string, name: string) => {
    const endpoint = type === 'class' ? `/api/classes/${id}` : `/api/subjects/${id}`;
    await toast.promise(
      track(fetchJson(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })),
      { loading: 'Updating...', success: 'Updated!', error: 'Failed' }
    );
    setEditingId(null);
    fetchData();
    onSuccess?.();
  };

  const handleDelete = async (type: 'class' | 'subject', id: string) => {
    if (!confirm('Are you sure?')) return;
    const endpoint = type === 'class' ? `/api/classes/${id}` : `/api/subjects/${id}`;
    await toast.promise(
      track(fetchJson(endpoint, { method: 'DELETE' })),
      { loading: 'Deleting...', success: 'Deleted!', error: 'Failed' }
    );
    fetchData();
    onSuccess?.();
  };

  if (!show) return null;

  const items = activeTab === 'classes' ? classes : subjects;
  const type = activeTab === 'classes' ? 'class' : 'subject';

  return (
    <div className="mx-auto mb-8 max-w-4xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">{t('title')}</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('classes')} className={`px-6 py-2 rounded-xl ${activeTab === 'classes' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}>
          Classes ({classes.length})
        </button>
        <button onClick={() => setActiveTab('subjects')} className={`px-6 py-2 rounded-xl ${activeTab === 'subjects' ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}>
          Subjects ({subjects.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white group">
            {editingId === item.id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" autoFocus />
                <button onClick={() => handleEdit(type, item.id, editName)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save</button>
                <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{item.name}</span>
                <div className="hidden group-hover:flex gap-2">
                  <button onClick={() => { setEditingId(item.id); setEditName(item.name); }} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg">✏️</button>
                  <button onClick={() => handleDelete(type, item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}