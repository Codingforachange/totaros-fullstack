import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component"
import { HeroComponent } from "./components/hero/hero.component";
import { BioComponent } from "./components/bio/bio.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ReviewsComponent } from "./components/reviews/reviews.component";
import { BookingComponent } from "./components/booking/booking.component";
import { FooterComponent } from "./components/footer/footer.component";
import { PhotosComponent } from './components/photos/photos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeroComponent, PhotosComponent, BioComponent, MenuComponent, ScheduleComponent, ReviewsComponent, BookingComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'totaros-frontend';
}
