import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://totaros-backend-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  // ==========================================================================
  // 1. PUBLIC API CHANNELS
  // ==========================================================================

  postReview(reviewData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, reviewData);
  }
  
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/photos`);
  }

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews`);
  }

  // ==========================================================================
  // 2. PROTECTED ADMIN MANAGEMENT CHANNELS
  // ==========================================================================

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/events`, eventData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/events/${eventId}`);
  }

  addPhoto(photoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/photos`, photoData);
  }

  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/photos/${photoId}`);
  }

  updateReviewApproval(reviewId: number, isApproved: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/reviews/${reviewId}`, { is_approved: isApproved });
  }
}
