import { Component } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';

@Component({
  selector: 'rating-starts',
  standalone: true,
  imports: [StarRatingModule],
  templateUrl: './starts.component.html',
  styleUrl: './starts.component.css'
})
export class StartsComponent {

}
