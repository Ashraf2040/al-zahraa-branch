import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Grade, WeeklyPlan } from '../components/types';
import { fetchJson, usePending } from '../components/hooks';

export function useAuthCheck(
  setGrades: (grades: Grade[]) => void,
  setWeeklyPlans: (plans: WeeklyPlan[]) => void
) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { track } = usePending();
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (status === 'loading' || loadedOnce.current) return;
    if (!session || (session.user as any)?.role !== 'COORDINATOR') {
      router.push('/login');
      return;
    }
    loadedOnce.current = true;

    const loadData = async () => {
      try {
        const [gradesData, plansData] = await toast.promise(
          track(Promise.all([
            fetchJson<Grade[]>('/api/grades'),
            fetchJson<WeeklyPlan[]>('/api/weekly-plans'),
          ])),
          {
            loading: 'Loading data…',
            success: 'Data loaded',
            error: (e) => `Failed to load: ${String((e as any)?.message || e)}`,
          }
        );
        setGrades(gradesData);
        setWeeklyPlans(plansData);
      } catch {}
    };

    loadData();
  }, [session, status, router, track, setGrades, setWeeklyPlans]);
}