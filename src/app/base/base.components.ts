import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseDependency } from './dependency/base.dependendency';
import { StateStorageService } from '../core/config/state-storage.service';
import { AccountService } from '../core/services/account.service';
import { ApiService } from '../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  template: '', // Base component has no template. Designed for inheritance.
})
export class BaseComponent implements OnDestroy {
  // Angular router and route for navigation and URL parameter handling
  protected route: ActivatedRoute;
  protected router: Router;

  // Service to manage session/local storage state
  protected stateStorgeService: StateStorageService;

  // Toast notification service for user feedback
  protected toastrService: ToastrService;

  // Manages account/user-related data
  protected accountService: AccountService;

  // Handles API requests across the app
  protected apiService: ApiService;

  // SweetAlert instance for alert modals
  protected myswal: any;

  /**
   * Constructor injects a base dependency object that bundles all core services.
   * This allows shared services to be used by any component extending BaseComponent.
   */
  constructor(protected baseDependency: BaseDependency) {
    this.route = baseDependency.route;
    this.router = baseDependency.router;
    this.stateStorgeService = baseDependency.stateStorageService;
    this.toastrService = baseDependency.toastrService;
    this.accountService = baseDependency.accountService;
    this.myswal = Swal;
    this.apiService = baseDependency.apiService;
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * Can be overridden by child components to handle cleanup.
   */
  ngOnDestroy(): void {}
}
