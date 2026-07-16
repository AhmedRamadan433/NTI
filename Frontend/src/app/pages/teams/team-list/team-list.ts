import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList {
  protected teams = [
    { id: '1', name: 'Frontend Team', memberCount: 5 },
    { id: '2', name: 'Backend Team', memberCount: 4 },
    { id: '3', name: 'Design Team', memberCount: 3 },
  ];
}
