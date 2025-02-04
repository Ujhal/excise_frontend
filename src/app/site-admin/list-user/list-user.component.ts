import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SiteAdminService } from '../site-admin-service';
import { Account } from '../../shared/models/accounts';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-list-user',
  imports: [MaterialModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit {
  displayedColumns: string[] = ['srno','firstName', 'lastName', 'username', 'contactNumber','emailId', 'role', 'created_by', 'actions'];
  users: MatTableDataSource<Account> = new MatTableDataSource<Account>();
  constructor(private siteAdminService: SiteAdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Fetch users from the service
    this.siteAdminService.getUsers().subscribe((data: Account[]) => {
      // Sort users by role
      this.users.data = this.sortUsersByRole(data);
    },
    error => console.error('Error loading users', error)
    );
  }

  sortUsersByRole(users: Account[]): Account[] {
    const roleOrder = ['site_admin', '1', '2', '3', '4', '5', '6'];

    return users.sort((a, b) => {
      const roleA = roleOrder.indexOf(a.role);
      const roleB = roleOrder.indexOf(b.role);
      return roleA - roleB;
    });
  }

  getRoleName(role: string): string {
    const roleMapping: { [key: string]: string } = {
      'site_admin': 'Site Admin',
      '2': 'licensee',
      
    };
    return roleMapping[role] || 'Unknown Role';
  }

  showDetails(user: Account): void {
    alert(`Details of ${user.username}:
    \nPhone: ${user.phonenumber}
    \nEmail: ${user.email}`);
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.users.filter = filterValue;
  }
}
