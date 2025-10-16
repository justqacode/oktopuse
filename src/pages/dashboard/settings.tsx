import {
  ProfileSettings,
  PaymentSettings,
  PasswordSettings,
  NotificationSettings,
} from '@/components/dashboard-main/settings';

export default function Settings() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='space-y-6'>
              {/* Header */}
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
                <p className='text-muted-foreground'>
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Profile Information Card */}
              <ProfileSettings />

              {/* Payment Information Card */}
              <PaymentSettings />

              {/* Change Password Card */}
              <PasswordSettings />

              {/* Notification Preferences Card */}
              <NotificationSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
