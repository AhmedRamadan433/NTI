import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { API_ROUTES } from "../constants/api.constants";
import { AuthRequest, AuthResponse } from "../models/auth.model";
import { StorageService } from "./storage";

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  login(credentials: AuthRequest): Observable<AuthResponse> {
    const payload = this.normalizeCredentials(credentials);
    return this.http
      .post<AuthResponse>(API_ROUTES.AUTH.LOGIN, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  register(
    data: AuthRequest & {
      firstName: string;
      lastName: string;
      username: string;
      passwordConfirm: string;
    },
  ): Observable<AuthResponse> {
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };
    return this.http
      .post<AuthResponse>(API_ROUTES.AUTH.REGISTER, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    this.storage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.storage.getAccessToken();
  }

  private persistSession(res: AuthResponse): void {
    this.storage.setAccessToken(res.token);
    // Do not try to save res.user because the backend does not return it
  }

  private normalizeCredentials(credentials: AuthRequest): AuthRequest {
    return {
      ...credentials,
      email: credentials.email.trim().toLowerCase(),
    };
  }
}
