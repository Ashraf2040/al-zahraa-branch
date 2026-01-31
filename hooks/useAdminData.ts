// hooks/useAdminData.ts
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdminData {
  teachers: any[];
  classes: any[];
  subjects: any[];
  isLoading: boolean;
  error: string | null;
  pending: number;
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>; // ← FIXED
  refreshTeachers: () => Promise<void>;
  refreshClasses: () => Promise<void>;
  refreshSubjects: () => Promise<void>;
}

export const useAdminData = (): AdminData => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const once = useRef(false);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [pending, setPending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track async operations (for spinner)
  const track = <T,>(p: Promise<T>): Promise<T> => {
    setPending((c) => c + 1);
    return p.finally(() => setPending((c) => Math.max(0, c - 1)));
  };

  // Safe JSON fetch with error handling
  const fetchJson = async (input: RequestInfo, init?: RequestInit): Promise<any> => {
    console.log(`Fetching: ${input}`);
    const res = await fetch(input, init);
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // non-JSON response
    }
    if (!res.ok) {
      const msg = data?.error ?? res.statusText ?? 'Request failed';
      console.error(`API error [${res.status}]: ${msg}`, { input, data });
      throw new Error(msg);
    }
    console.log(`Fetched: ${input} →`, data);
    return data;
  };

  // Individual refreshers
  const refreshTeachers = async () => {
    try {
      const data = await fetchJson('/api/admin/teachers');
      setTeachers(data);
    } catch (e: any) {
      toast.error(`Failed to refresh teachers: ${e.message}`);
    }
  };

  const refreshClasses = async () => {
    try {
      const data = await fetchJson('/api/classes');
      setClasses(data);
    } catch (e: any) {
      toast.error(`Failed to refresh classes: ${e.message}`);
    }
  };

  const refreshSubjects = async () => {
    try {
      const data = await fetchJson('/api/subjects');
      setSubjects(data);
    } catch (e: any) {
      toast.error(`Failed to refresh subjects: ${e.message}`);
    }
  };

  // Initial load
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user || session.user.role !== 'ADMIN') {
      console.warn('Not admin → redirecting to login');
      router.push('/login');
      return;
    }
    if (once.current) return;
    once.current = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      console.log('Starting admin data load...');

      try {
        await toast.promise(
          track(
            Promise.all([
              fetchJson('/api/admin/teachers'),
              fetchJson('/api/classes'),
              fetchJson('/api/subjects'),
            ]).then(([t, c, s]) => {
              setTeachers(t ?? []);
              setClasses(c ?? []);
              setSubjects(s ?? []);
              console.log('Admin data loaded:', {
                teachers: t?.length,
                classes: c?.length,
                subjects: s?.length,
              });
            })
          ),
          {
            loading: 'Loading admin data…',
            success: 'Data loaded successfully',
            error: (e) => `Failed: ${e.message}`,
          }
        );
      } catch (e: any) {
        console.error('Initial load failed:', e);
        setError(e.message);
        toast.error(`Load failed: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [session, status, router]);

  return {
    teachers,
    classes,
    subjects,
    isLoading,
    error,
    pending,
    track,
    fetchJson,
    refreshTeachers,
    refreshClasses,
    refreshSubjects,
  };
};