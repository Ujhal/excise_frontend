import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { Account } from '../../shared/models/accounts';
import { SiteAdminService } from '../site-admin-service';
import { EditUserComponent } from './edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-user',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['slNo', 'firstName', 'middleName', 'lastName', 'username', 'phoneNumber', 'email', 'district', 'subDivision', 'role', 'createdBy', 'actions'];
  users = new MatTableDataSource<Account>();
  allUsers: Account[] = [];

  constructor(
    base: BaseDependency,
    private siteAdminService: SiteAdminService,
    private dialog: MatDialog
  ) {
    super(base);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.siteAdminService.getUsers().subscribe(
      (data) => {  
        if (data) {
          if (Array.isArray(data)) {
            this.users.data = data; 
          } else {
            this.users.data = [data];
          }
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  
  

  onEdit(user: Account): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }

  onDelete(user: Account): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.deleteUser(user.username).subscribe(
          () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            this.loadUsers();
          },
          (error) => {
            Swal.fire('Error!', 'Failed to delete the user.', 'error');
            console.error('Error deleting user:', error);
          }
        );
      }
    });
  }
}

