import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Pokemon Tunja';
}
