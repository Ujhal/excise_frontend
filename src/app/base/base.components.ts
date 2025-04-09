
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseDependency } from './dependency/base.dependendency';
import { StateStorageService } from '../core/config/state-storage.service';
import { AccountService } from '../core/services/account.service';
import { ApiService } from '../core/services/api.service';
import Swal from 'sweetalert2';
@Component({
  template: '',
})
export class BaseComponent implements OnDestroy {
  protected route: ActivatedRoute;
  protected router: Router;
  protected stateStorgeService: StateStorageService;
  protected toastrService: ToastrService;
  protected accountService: AccountService;
  protected apiService: ApiService;
  protected myswal: any;

  constructor(protected baseDependency: BaseDependency) {
    this.route = baseDependency.route;
    this.router = baseDependency.router;
    this.stateStorgeService = baseDependency.stateStorageService;
    this.toastrService = baseDependency.toastrService;
    this.accountService = baseDependency.accountService;
    this.myswal = Swal;
    this.apiService = baseDependency.apiService;
  }

  ngOnDestroy(): void {}


}
