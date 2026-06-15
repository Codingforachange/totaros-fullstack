import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for form handling
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], // Injected FormsModule here
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  customerReviews: any[] = [];
  isLoading: boolean = true;

  // Form model fields properties
  newReview = {
    reviewer_name: '',
    review_text: ''
  };
  isSubmitting: boolean = false;
  successMessage: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.dataService.getReviews().subscribe({
      next: (data: any[]) => {
        this.customerReviews = data.filter(review => review.is_approved);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to stream reviews pipeline from backend:', err);
        this.isLoading = false;
      }
    });
  }

  submitReview(): void {
    if (!this.newReview.reviewer_name || !this.newReview.review_text) return;
    
    this.isSubmitting = true;
    
    // Assembling payload to match your backend model schema
    const payload = {
      customer_name: this.newReview.reviewer_name,
      comment_text: this.newReview.review_text,
      is_approved: false // Defaulted to false so you can approve them in your admin panel
    };

    this.dataService.postReview(payload).subscribe({
      next: () => { // Removed the unused 'response' parameter to clear ts(6133)
        this.isSubmitting = false;
        this.successMessage = 'Grazie! Your review has been submitted for approval.';
        
        // Reset the input form fields
        this.newReview = { reviewer_name: '', review_text: '' };
        
        // Clear message after a few seconds
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err: any) => { // Added the explicit ': any' type here to clear ts(7006)
        console.error('Failed to submit review to database table:', err);
        this.isSubmitting = false;
      }
    });
  }
}
