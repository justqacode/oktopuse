import API from '@/lib/axios';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { toast } from './use-toast';

type UseGetQueryTypes = {
  queryKey?: QueryKey;
  trigger?: boolean;
  retry?: boolean;
};

export default function useGetReq(url: string, options: UseGetQueryTypes = {}) {
  const { trigger = true, retry = false, queryKey } = options;

  const query = useQuery({
    queryKey: queryKey ?? [url],
    queryFn: async () => {
      const response = await API(url);

      if (response?.status === 400) {
        toast({
          title: 'Session expired',
          description: `Session expired. Redirecting to login...`,
          duration: 1000,
        });
        throw new Error('Session expired');
      }

      return response;
    },
    enabled: trigger,
    retry: retry,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
