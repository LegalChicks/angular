import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/password-reset/password-reset.component').then(c => c.PasswordResetComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'overview', loadComponent: () => import('./features/dashboard/overview/members-dashboard.component').then(c => c.MembersDashboardComponent) },
      { path: 'analytics', loadComponent: () => import('./features/dashboard/analytics/analytics.component').then(c => c.AnalyticsComponent) },
      { path: 'business', loadComponent: () => import('./features/dashboard/business/business-suite.component').then(c => c.BusinessSuiteComponent) },
      { path: 'profile', loadComponent: () => import('./features/dashboard/profile/profile.component').then(c => c.ProfileComponent) },
      { path: 'directory', loadComponent: () => import('./features/dashboard/directory/member-directory.component').then(c => c.MemberDirectoryComponent) },
      { path: 'membership', loadComponent: () => import('./features/dashboard/membership/membership.component').then(c => c.MembershipComponent) },
      { path: 'supplies', loadComponent: () => import('./features/dashboard/supplies/supply-ordering.component').then(c => c.SupplyOrderingComponent) },
      { 
        path: 'settings', 
        loadComponent: () => import('./features/dashboard/settings/settings.component').then(c => c.SettingsComponent),
        canActivate: [authGuard] // All authenticated users can access settings
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];