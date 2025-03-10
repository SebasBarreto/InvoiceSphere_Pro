import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from './analytics.service'; // Service to fetch analytics data

@Component({
  selector: 'app-user-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  userId: string = '';  // Initialize with a default value
  analyticsData: any = {};  // Analytics data
  invoicesData: any[] = []; // Invoices data
  loading = true; // Loading indicator

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Get the user ID from the URL
    this.userId = this.route.snapshot.paramMap.get('userId')!; // The '!' ensures it's not null or undefined
    this.getAnalytics();  // Fetch user analytics
    this.getInvoices();  // Fetch user invoices
  }

  // Method to fetch user analytics
  getAnalytics(): void {
    this.analyticsService.getUserAnalytics(this.userId).subscribe(
      (data) => {
        this.analyticsData = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching analytics data', error);
        this.loading = false;
      }
    );
  }

  // Method to fetch user invoices
  getInvoices(): void {
    this.analyticsService.getUserInvoices(this.userId).subscribe(
      (data) => {
        this.invoicesData = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching invoices data', error);
        this.loading = false;
      }
    );
  }
}
