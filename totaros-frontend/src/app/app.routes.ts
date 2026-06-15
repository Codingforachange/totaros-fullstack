import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
// Import your main landing page component here too if it isn't already, for example:
// import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // 1. PUBLIC PATHS
  { path: '', component: HomeComponent }, // Example main landing route target
  
  // 2. ADMIN CONSOLE AUTH PATH
  { 
    path: 'admin-login', 
    component: AdminLoginComponent 
  },
  
  // 3. SECURED CONTROL HUB DASHBOARD PATH
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard] // The checkpoint that enforces valid PostgreSQL session tokens
  },

  // Fallback catch-all: redirects any weird URLs back to the homepage
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];