
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
})
export class LoginComponent {
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  t = this.translationService.t;

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['admin@legalchicks.vip', [Validators.required, Validators.email]],
    password: ['admin', [Validators.required]]
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Please enter a valid email and password.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;
    
    const result = await this.authService.login(email, password);

    if (!result.success) {
      this.errorMessage.set(result.message);
    }
    
    this.loading.set(false);
  }
}
