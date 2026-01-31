'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Interfaces
interface Class { id: string; name: string; }
interface Subject { id: string; name: string; }
interface User { id: string; name: string; }
interface ScheduleItem { dayIndex: number; subjectId: string; }
interface StoredSchedule { id: string; classId: string; className: string; items: ScheduleItem[]; createdAt: string; }

interface Props {
  show: boolean;
  onClose: () => void;
  classes: Class[];
  subjects: Subject[];
  user: User;
}

type Schedule = { [dayIndex: number]: string[] };
const weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EditSchedule({ show, onClose, classes, subjects, user }: Props) {
  
  // --- CRITICAL FIX: Define ALL hooks BEFORE any early returns ---
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [storedSchedules, setStoredSchedules] = useState<StoredSchedule[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
useEffect(() => {
  if (!user?.id) return;

  if (selectedClassIds.length > 0 && editMode && activeTab === 'edit') {
    setLoading(true);
    fetch(`/api/schedule?classId=${selectedClassIds[0]}`)
      .then(res => res.json())
      .then(({ schedule }) => setSchedule(schedule || {}))
      .finally(() => setLoading(false));
  } else if (editMode && activeTab === 'edit') {
    setSchedule({});
  }
}, [selectedClassIds, editMode, activeTab, user]);

// ====== EFFECT 2 ======
useEffect(() => {
  if (!user?.id) return;
  if (activeTab === 'history') {
    loadHistory();
  }
}, [activeTab, user]);
  // Now you can check props safely
    const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      if (data.schedules) {
        setStoredSchedules(data.schedules);
      }
    } catch (err) {
      toast.error('Failed to load schedule history');
    } finally {
      setLoadingHistory(false);
    }
  };


  if (!user || !user.id) {
    // We render a fallback instead of returning null to satisfy Hooks rules
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="bg-white p-6 rounded-lg shadow-xl text-red-600 font-semibold">
          User session is missing. Please refresh.
        </div>
      </div>
    );
  }





  const toggleSubjectForDay = (dayIndex: number, subjectId: string) => {
    setSchedule(prev => {
      const daySubjects = prev[dayIndex] || [];
      const newSubjects = daySubjects.includes(subjectId)
        ? daySubjects.filter(s => s !== subjectId)
        : [...daySubjects, subjectId];
      return { ...prev, [dayIndex]: newSubjects };
    });
  };

  const handleSave = async () => {
    if (selectedClassIds.length === 0) {
      toast.error('Please select at least one class.');
      return;
    }

    // VALIDATION: Ensure user exists before sending request
    if (!user || !user.id) {
      toast.error('User session invalid. Please login again.');
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          classId: selectedClassIds[0], 
          schedule, 
          createdBy: user.id // CRITICAL FIX: Pass valid user ID
        }),
      });

      toast.success('Schedule saved!');
      setEditMode(false);
      if (activeTab === 'history') loadHistory();
    } catch (error) {
      toast.error('Failed to save schedule');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadScheduleForEdit = (stored: StoredSchedule) => {
    const newSchedule: Schedule = {};
    stored.items.forEach(item => {
      if (!newSchedule[item.dayIndex]) newSchedule[item.dayIndex] = [];
      if (!newSchedule[item.dayIndex].includes(item.subjectId)) {
        newSchedule[item.dayIndex].push(item.subjectId);
      }
    });
    setSchedule(newSchedule);
    setSelectedClassIds([stored.classId]);
    setEditMode(true);
    setActiveTab('edit');
    toast.success(`Editing schedule for ${stored.className}`);
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule permanently?')) return;

    try {
      const res = await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Schedule deleted');
        setStoredSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const renderStoredSchedule = (stored: StoredSchedule) => {
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
    const scheduleMap: Schedule = {};

    stored.items.forEach(item => {
      if (!scheduleMap[item.dayIndex]) scheduleMap[item.dayIndex] = [];
      scheduleMap[item.dayIndex].push(item.subjectId);
    });

    return (
      <div className="space-y-3 text-sm p-6 bg-white/50 rounded-2xl border border-white/20">
        {weekdays.map((day, idx) => {
          const subs = (scheduleMap[idx] || [])
            .map(id => subjectMap.get(id))
            .filter(Boolean);
          if (subs.length === 0) return null;
          return (
            <div key={idx} className="flex gap-2 items-center justify-between bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
              <span className="font-medium text-teal-700 w-24">{day}:</span>
              <span className="text-slate-600 font-medium">{subs.join(', ')}</span>
            </div>
          );
        })}
        {Object.keys(scheduleMap).length === 0 && (
          <div className="text-center py-4 text-slate-400 italic">No subjects assigned</div>
        )}
      </div>
    );
  };

  if (!show) return null;

  function toggleClassSelection(id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[95vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-slate-100 bg-white/40">
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Schedule Manager</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="px-8 flex justify-center gap-6 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('edit')}
            className={`relative px-6 py-3 font-semibold transition-colors ${
              activeTab === 'edit'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/30'
                : 'text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Edit Schedule
            {activeTab === 'edit' && (
              <span className="absolute bottom-0 left-0 h-0.5 bg-teal-600 rounded-full animate-[width_300ms_ease-in-out_forwards]" style={{ width: '100%' }}></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`relative px-6 py-3 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/30'
                : 'text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            History
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 h-0.5 bg-teal-600 rounded-full animate-[width_300ms_ease-in-out_forwards]" style={{ width: '100%' }}></span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 overflow-y-auto bg-gradient-to-b from-white/20 to-slate-50/30">
          
          {/* EDIT TAB */}
          {activeTab === 'edit' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Class Selection Chips */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v8a2 2 0 00-2 2z"></path></svg>
                    Select Classes
                </label>
                <div className="flex flex-wrap gap-3">
                  {classes.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleClassSelection(c.id)}
                      className={`group relative px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-200 ${
                        selectedClassIds.includes(c.id)
                          ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:shadow-md'
                      }`}
                    >
                      {selectedClassIds.includes(c.id) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                      <span className="relative z-10">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Table */}
              {selectedClassIds.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Assign Subjects by Day</h3>
                    {selectedClassIds.length === 1 && (
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
                        {classes.find(c => c.id === selectedClassIds[0])?.name}
                      </span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-teal-50 text-teal-900 border-b border-teal-100">
                          <th className="p-4 font-bold text-left sticky left-0 bg-teal-50 backdrop-blur-md z-10">Day</th>
                          {subjects.map(s => (
                            <th key={s.id} className="p-4 font-semibold text-slate-700 text-center min-w-[130px]">
                              {s.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {weekdays.map((day, dayIndex) => (
                          <tr
                            key={dayIndex}
                            className="border-b border-slate-100 hover:bg-teal-50/10 transition-colors last:border-0"
                          >
                            <td className="p-4 font-bold text-teal-700 bg-white sticky left-0 z-0 border-r border-slate-100">
                              {day}
                            </td>
                            {subjects.map(subject => {
                              const isChecked = schedule[dayIndex]?.includes(subject.id) || false;
                              return (
                                <td key={subject.id} className="p-4 text-center hover:bg-white">
                                  <label className="relative flex items-center justify-center cursor-pointer group">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleSubjectForDay(dayIndex, subject.id)}
                                      className="peer sr-only"
                                    />
                                    <div className={`
                                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                      ${isChecked 
                                        ? 'bg-teal-600 border-teal-600 text-white shadow-md' 
                                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-teal-400'
                                      }
                                    `}>
                                      {isChecked && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                      )}
                                    </div>
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <div className="w-10 h-10 border-3 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <span className="mt-4 font-medium">Loading history...</span>
                </div>
              ) : storedSchedules.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-slate-500 font-medium">No saved schedules yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {storedSchedules.map((s, i) => (
                    <div
                      key={s.id}
                      className={`group bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-teal-200 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{s.className}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002 2v8a2 2 0 00-2 2z"></path></svg>
                            <span className="text-xs text-slate-400 font-medium">
                              Created on {new Date(s.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadScheduleForEdit(s)}
                            className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSchedule(s.id)}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {/* Preview of Schedule */}
                      {renderStoredSchedule(s)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}