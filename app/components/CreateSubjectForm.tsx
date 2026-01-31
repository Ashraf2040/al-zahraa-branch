// app/admin/components/CreateSubjectForm.tsx
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface Props {
  show: boolean;
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  toast: typeof toast;
  onSuccess: () => void;
  pending: number;
}

export default function CreateSubjectForm({
  show,
  track,
  fetchJson,
  toast,
  onSuccess,
  pending,
}: Props) {
  const t = useTranslations('CreateSubjectForm');

  const [name, setName] = useState('');

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await toast.promise(
      track(
        (async () => {
          await fetchJson('/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          });
          setName('');
          onSuccess();
        })()
      ),
      {
        loading: t('toast.creating'),
        success: t('toast.success'),
        error: (e) => `${t('toast.error')} ${e.message}`,
      }
    );
  };

  return (
    <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">
        {t('title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.name')}
          </label>
          <input
            placeholder={t('placeholders.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending > 0}
          className="w-full rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {pending > 0 ? t('buttons.working') : t('buttons.create')}
        </button>
      </form>
    </div>
  );
}