import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../core/services/account.service';
import { ApiService } from '../../core/services/api.service';
import { StateStorageService } from '../../core/config/state-storage.service';

@Injectable({ providedIn: 'root' })
export class BaseDependency {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public accountService: AccountService,
    public toastrService: ToastrService,
    public apiService: ApiService,
    public stateStorageService: StateStorageService,

     ) {}
}
