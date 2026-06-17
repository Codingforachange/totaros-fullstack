import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'reviews';
  
  reviews: any[] = [];
  photos: any[] = [];
  events: any[] = [];

  newPhoto = { image_url: '', caption: '' };
  newEvent = { title: '', location: '', event_date: '' };

  private backendUrl = 'http://totaros-backend.onrender.com/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('totaro_admin_token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }

    if (!token) {
      console.warn('No administrative session token detected. Rerouting to login credentials screen.');
      return;
    }
    this.loadAllData();
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
    this.loadAllData();
  }

  private getAuthHeaders() {
    let token = localStorage.getItem('totaro_admin_token') || '';
    token = token.replace(/^"|"$/g, '');
    return {
      headers: new HttpHeaders({
        'Authorization': `bearer ${token}`
      })
    };
  }

  loadAllData(): void {
    if (this.activeTab === 'reviews') this.fetchReviews();
    if (this.activeTab === 'photos') this.fetchPhotos ;
    if (this.activeTab === 'events') this.fetchEvents();
  }

  // ==========================================
  // REVIEW HANDLERS
  // ==========================================
  fetchReviews(): void {
    this.http.get<any[]>(`${this.backendUrl}/reviews`, this.getAuthHeaders()).subscribe({
      next: (data) => {this.reviews = data},
      error: (err) => console.error('Error fetching reviews:', err)
    });
  }

  moderateReview(reviewId: number, approve: boolean): void {
    this.http.put(`${this.backendUrl}/reviews/${reviewId}`, { is_approved: approve }, this.getAuthHeaders()).subscribe({
      next: () => this.fetchReviews(),
      error: (err) => console.error('Error moderating review:', err)
    });
  }

  // ==========================================
  // PHOTO HANDLERS
  // ==========================================
  fetchPhotos(): void {
    this.http.get<any[]>(`${this.backendUrl.replace('/admin', '')}/photos`).subscribe({
      next: (data) => this.photos = data,
      error: (err) => console.error('Error fetching photos:', err)
    });
  }

  addPhotoAsset(): void {
    if (!this.newPhoto.image_url) return;
    this.http.post(`${this.backendUrl}/photos`, this.newPhoto, this.getAuthHeaders()).subscribe({
      next: () => {
        this.fetchPhotos();
        this.newPhoto = { image_url: '', caption: '' };
      },
      error: (err) => console.error('Error adding photo:', err)
    });
  }

  removePhotoAsset(photoId: number): void {
    this.http.delete(`${this.backendUrl}/photos/${photoId}`, this.getAuthHeaders()).subscribe({
      next: () => this.fetchPhotos(),
      error: (err) => console.error('Error removing photo:', err)
    });
  }

  // ==========================================
  // EVENT HANDLERS
  // ==========================================
  fetchEvents(): void {
    this.http.get<any[]>(`${this.backendUrl.replace('/admin', '')}/events`).subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  scheduleEvent(): void {
    if (!this.newEvent.title || !this.newEvent.event_date) return;
    this.http.post(`${this.backendUrl}/events`, this.newEvent, this.getAuthHeaders()).subscribe({
      next: () => {
        this.fetchEvents();
        this.newEvent = { title: '', location: '', event_date: '' };
      },
      error: (err) => console.error('Error scheduling event:', err)
    });
  }

  cancelEvent(eventId: number): void {
    this.http.delete(`${this.backendUrl}/events/${eventId}`, this.getAuthHeaders()).subscribe({
      next: () => this.fetchEvents(),
      error: (err) => console.error('Error canceling event:', err)
    });
  }
}