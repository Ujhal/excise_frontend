import { Component, OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SiteAdminService } from '../site-admin-service';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { Account } from '../../shared/models/accounts';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-user',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['slNo','firstName', 'middleName', 'lastName', 'username', 'contactNumber','emailId', 'role', 'createdBy', 'actions'];
  users: MatTableDataSource<Account> = new MatTableDataSource<Account>();

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService) {
    super(base);
  }

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

  onEdit(element: Account): void {
    this.router.navigate([`..//${element.first_name}`]);
  }

  onView(element: Account): void {
      this.router.navigate([`..//${element.first_name}`]);
  }

  /*
  onDelete(element: Account): void {
      Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this subdivision!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel'
      }).then((result) => {
          if (result.isConfirmed) {
              this.siteAdminService.deleteUser(element.id).subscribe(
                  () => {
                      Swal.fire('Deleted!', 'Subdivision has been deleted.', 'success');
                      this.loadUsers(); // Reload data
                  },
                  error => {
                      console.error('Error deleting user:', error);
                      Swal.fire('Error!', 'User could not be deleted.', 'error');
                  }
              );
          }
      });
  }
  */

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
