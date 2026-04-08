import { useAuthStore } from '@/auth/authStore';
import DashboardChatsManager from './chat-users/manager';
import DashboardChats from './chat-users/tenant-landlord';

export default function DashboardChatsHome() {
  const { user } = useAuthStore();

  const managerRole = user?.role?.includes('manager');

  return <>{managerRole ? <DashboardChatsManager /> : <DashboardChats />}</>;
}
