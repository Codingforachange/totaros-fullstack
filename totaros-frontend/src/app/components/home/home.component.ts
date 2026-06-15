import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { BioComponent } from '../bio/bio.component';
import { MenuComponent } from '../menu/menu.component';
import { PhotosComponent } from '../photos/photos.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { BookingComponent } from '../booking/booking.component'; // If you have a separate booking section
import { ScheduleComponent } from '../schedule/schedule.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    BioComponent,
    MenuComponent,
    PhotosComponent,
    ReviewsComponent,
    BookingComponent,
    ScheduleComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Your component logic stays here
}
