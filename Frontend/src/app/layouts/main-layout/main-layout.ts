import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/shared/navbar/navbar';
import { Sidebar } from '../../components/shared/sidebar/sidebar';
import { Footer } from '../../components/shared/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
