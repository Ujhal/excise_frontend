import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ActivatedRoute } from '@angular/router';

interface Notification {
  date: string;
  subject: string;
  category: string;
}

@Component({
  selector: 'app-main-links',
  imports: [MaterialModule],
  templateUrl: './main-links.component.html',
  styleUrl: './main-links.component.scss'
})
export class MainLinksComponent implements OnInit{
  page: string | null= '';
  selectedCategory: string = 'all';

  notifications: Notification[] = [
    { date: '26/09/1974', subject: 'Circular Regarding Settlement of Excise License for the Year 2025-2026', category: 'circular' },
    { date: '26/09/1974', subject: 'DRY DAY NOTIFIATION - 2025', category: 'circular' },
    { date: '14/08/2024', subject: 'Gazette No 394 - Suspension on issue of New Foreign Liquor Retail License', category: 'act' },
    { date: '08/02/2024', subject: 'Notification No 01/Excise - License Renewal for FY 2024-25', category: 'rule' },
    { date: '01/12/2023', subject: 'Notification No 31/Ex - License Fees and others', category: 'act' },
    { date: '20/05/2023', subject: 'Notification No 25/Excise - Departmental Promotional Committee Members', category: 'rule' },
  ];

  displayedColumns: string[] = ['date', 'subject', 'download'];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
  }

  constructor(private route: ActivatedRoute) {}

  get filteredNotifications(): Notification[] {
    if (this.selectedCategory === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(notification => notification.category === this.selectedCategory);
  }

  downloadFile(notification: Notification) {
    alert(`Downloading file: ${notification.subject}`);
  }
  
  raidsColumns: string[] = ['photo', 'caption'];

  dataSource = [
    {
      photoUrl: '../../assets/images/main/preventive-raids/preventive-raids.jpg',
      publishedOn: 'Apr 20 2021 12:00AM',
      caption: 'Raid conducted by Sikkim State Excise',
      captionLink: 'Excise Raids on illicit dens in Remote Villages.'
    }
  ];
}
