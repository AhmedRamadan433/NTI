import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { APP_ROUTES } from '../../../constants/app-routes.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly routes = APP_ROUTES;
  private auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}
