import { useEffect, useState } from 'react';
import type { ResumeOverview } from '@application/use-cases/GetResumeOverview';
import { useDependencies } from '../context/DependenciesContext';

export type AsyncState<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: Error };

export function useResumeOverview(): AsyncState<ResumeOverview> {
  const { getResumeOverview } = useDependencies();
  const [state, setState] = useState<AsyncState<ResumeOverview>>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    getResumeOverview
      .execute()
      .then((data) => isActive && setState({ status: 'success', data }))
      .catch((error: unknown) => {
        const normalized = error instanceof Error ? error : new Error(String(error));
        if (isActive) setState({ status: 'error', error: normalized });
      });

    return () => {
      isActive = false;
    };
  }, [getResumeOverview]);

  return state;
}
