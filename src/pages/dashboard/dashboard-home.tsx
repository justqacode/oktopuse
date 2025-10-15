import { useAuthStore } from '@/auth/authStore';
import DashboardHomeTenant from './tenant/dashboard-home-tenant';
import DashboardHomeLandlord from './landlord/dashboard-home-landord';
import DashboardHomeManager from './manager/dashboard-home-manager';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const tenant = user?.role.includes('tenant');
  const landlord = user?.role.includes('landlord');
  const manager = user?.role.includes('manager');

  return (
    <>
      {tenant && <DashboardHomeTenant />}
      {landlord && <DashboardHomeLandlord />}
      {manager && <DashboardHomeManager />}
    </>
  );
}
