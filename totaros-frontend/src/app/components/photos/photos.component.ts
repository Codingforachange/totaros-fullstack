import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent implements OnInit {
  // Empty array to catch your live image object payloads from the database
  galleryPhotos: any[] = [];
  isLoading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchGalleryPhotos();
  }

  fetchGalleryPhotos(): void {
    this.dataService.getPhotos().subscribe({
      next: (data: any[]) => {
        this.galleryPhotos = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to stream photo gallery records from backend:', err);
        this.isLoading = false;
      }
    });
  }
}