import { useAuthStore } from '@/auth/authStore';
import DashboardHomeTenant from './tenant/dashboard-home-tenant';
import DashboardHomeLandlord from './landlord/dashboard-home-landord';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const tenant = user?.role.includes('tenant');
  const landlord = user?.role.includes('landlord');

  return (
    <>
      {tenant && <DashboardHomeTenant />}
      {landlord && <DashboardHomeLandlord />}
    </>
  );
}
