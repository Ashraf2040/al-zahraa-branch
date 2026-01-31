'use client';

import { PlanFields, Subject, ID } from './types';
import { Toolbar } from './Toolbar';
import { useRef } from 'react';

export function SubjectEditors({
  subjects, isArabic, planData, onChange, toDisplay,
}: {
  subjects: Subject[];
  isArabic: (name: string) => boolean;
  planData: Record<ID, PlanFields>;
  onChange: (id: ID, field: keyof PlanFields, v: string) => void;
  toDisplay: (name: string) => string;
}) {
  const refs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const refKey = (subId: ID, field: keyof PlanFields) => `${subId}:${field}`;
  const wrap = (subId: ID, field: keyof PlanFields, delim: string) => {
    const ta = refs.current[refKey(subId, field)];
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    if (selectionStart == null || selectionEnd == null || selectionStart === selectionEnd) return;
    const nv = value.slice(0, selectionStart) + delim + value.slice(selectionStart, selectionEnd) + delim + value.slice(selectionEnd);
    onChange(subId, field, nv);
    requestAnimationFrame(() => ta.focus());
  };

  return (
    <div className="space-y-6">
      {[...subjects.filter((s) => !isArabic(s.name)), ...subjects.filter((s) => isArabic(s.name))].map((sub) => {
        const data = planData[sub.id] || { lessons: '', homework: '', classwork: '', unit: '', pages: '' };
        const dir: 'rtl' | 'ltr' = isArabic(sub.name) ? 'rtl' : 'ltr';
        return (
          <div key={sub.id} className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-medium text-[#064e4f]" style={{ direction: dir }}>
              {toDisplay(sub.name)}
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12" dir={dir}>
              <div className="md:col-span-4">
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{dir === 'rtl' ? '[translate:الدروس]' : 'Lessons'}</label>
                  <Toolbar onWrap={(d) => wrap(sub.id, 'lessons', d)} />
                </div>
                <textarea
                  ref={(el) => { refs.current[refKey(sub.id, 'lessons')] = el; }}
                  value={data.lessons}
                  onChange={(e) => onChange(sub.id, 'lessons', e.target.value)}
                  rows={5}
                  className={`block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be] ${dir === 'rtl' ? 'text-right' : ''}`}
                  style={{ direction: dir }}
                />
              </div>
              <div className="md:col-span-4">
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{dir === 'rtl' ? '[translate:الواجب]' : 'Homework'}</label>
                  <Toolbar onWrap={(d) => wrap(sub.id, 'homework', d)} />
                </div>
                <textarea
                  ref={(el) => { refs.current[refKey(sub.id, 'homework')] = el; }}
                  value={data.homework}
                  onChange={(e) => onChange(sub.id, 'homework', e.target.value)}
                  rows={5}
                  className={`block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be] ${dir === 'rtl' ? 'text-right' : ''}`}
                  style={{ direction: dir }}
                />
              </div>
              <div className="md:col-span-4">
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{dir === 'rtl' ? '[translate:عمل الحصة]' : 'Class work'}</label>
                  <Toolbar onWrap={(d) => wrap(sub.id, 'classwork', d)} />
                </div>
                <textarea
                  ref={(el) => { refs.current[refKey(sub.id, 'classwork')] = el; }}
                  value={data.classwork}
                  onChange={(e) => onChange(sub.id, 'classwork', e.target.value)}
                  rows={5}
                  className={`block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be] ${dir === 'rtl' ? 'text-right' : ''}`}
                  style={{ direction: dir }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
