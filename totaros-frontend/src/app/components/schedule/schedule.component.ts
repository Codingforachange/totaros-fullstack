import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  //Empty array to hold data fetched from the live Python database api
  upcomingStops: any[] = [];
  isLoading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchSchedule();
  }

  fetchSchedule(): void {
    this.dataService.getEvents().subscribe({
      next: (data: any[]) => {
        this.upcomingStops = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to stream schedule pipeline from backend:', err);
        this.isLoading = false;
      }
      
    });
  }

}
