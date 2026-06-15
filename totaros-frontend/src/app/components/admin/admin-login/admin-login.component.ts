import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  credentials = { username: '', password: '' };
  isProcessing: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) return;

    this.isProcessing = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isProcessing = false;
        // Instantly switch client view screen to administration hub panels upon validation match
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = err.error?.detail || 'Authentication handshake rejected. Try again.';
        console.error('Login routing validation failed:', err);
      }
    });
  }
}

