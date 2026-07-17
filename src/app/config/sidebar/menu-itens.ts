import { inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate/translate.service';

export class MenuItens {
  menuItems: any[];

  constructor(private readonly translate: TranslateService) {
    this.menuItems = [
      {
        route: 'notification',
        iconClass: 'pi pi-bell',
        tooltip: this.translate.translate('notification'),
        name: this.translate.translate('notification'),
        submenu: [],
      },
      {
        route: 'dashboard',
        iconClass: 'pi pi-chart-bar',
        tooltip: this.translate.translate('dashboard'),
        name: this.translate.translate('dashboard'),
        submenu: [],
      },
      {
        route: 'scheduler',
        iconClass: 'pi pi-calendar',
        tooltip: this.translate.translate('scheduler'),
        name: this.translate.translate('scheduler'),
        submenu: [],
      },
      {
        iconClass: 'pi pi-address-book',
        tooltip: this.translate.translate('registrations'),
        name: this.translate.translate('registrations'),
        submenu: [
          {
            name: this.translate.translate('registrations'),
            submenu: [
              {
                route: 'register/personMembers',
                name: this.translate.translate('registrations_persons_members'),
              },
              {
                route: 'register/personNewConvert',
                name: this.translate.translate(
                  'registrations_persons_new_convert',
                ),
              },
              {
                route: 'register/personSupplier',
                name: this.translate.translate(
                  'registrations_persons_suppliers',
                ),
              },
              {
                route: 'register/personVisitor',
                name: this.translate.translate('registrations_persons_visitor'),
              },
            ],
          },
          {
            name: this.translate.translate('financial_page_financial'),
            submenu: [
              {
                route: 'planAccount',
                name: this.translate.translate('financial_planAccount'),
              },
              {
                route: 'costCenter',
                name: this.translate.translate('financial_costCenter'),
              },
              {
                route: 'register/cash',
                name: this.translate.translate('entity_cash_title'),
              },
              {
                route: 'register/bank',
                name: this.translate.translate('entity_bank_title'),
              },
            ],
          },
          {
            name: this.translate.translate('entity_others'),
            submenu: [
              {
                route: 'register/positions',
                name: this.translate.translate('entity_positions_title'),
              },
              {
                route: 'register/memberFunctions',
                name: this.translate.translate('entity_member_function_title'),
              },
              {
                route: 'register/eventsType',
                name: this.translate.translate('entity_event_type_title'),
              },
            ],
          },
        ],
      },
      {
        iconClass: 'pi pi-users',
        tooltip: this.translate.translate('cells_menu'),
        name: this.translate.translate('cells_menu'),
        submenu: [
          {
            name: this.translate.translate('cells_organization'),
            route: 'cells/organization',
          },
          {
            name: this.translate.translate('cells_list'),
            route: 'register/cells',
          },
          {
            name: this.translate.translate('cells_leadership_members'),
            route: 'cells/team',
          },
          {
            name: this.translate.translate('cells_meetings'),
            route: 'cells/meetings',
          },
          {
            name: this.translate.translate('cells_visitors'),
            route: 'cells/visitors',
          },
          {
            name: this.translate.translate('cells_settings'),
            route: 'cells/settings',
          },
        ],
      },
      {
        iconClass: 'pi pi-dollar',
        tooltip: this.translate.translate('financial_page_financial'),
        name: this.translate.translate('financial_page_financial'),
        submenu: [
          {
            name: this.translate.translate('financial_page_revenues'),
            route: 'register/revenues',
          },
          {
            name: this.translate.translate('financial_page_expenses'),
            route: 'register/expenses',
          },
          {
            name: this.translate.translate('cash_approvals_title'),
            route: 'cash-approvals',
          },
          {
            name: this.translate.translate('financial_page_transactions'),
            submenu: [
              {
                name: this.translate.translate('entity_cash_title'),
                route: 'transactions',
              },
              {
                name: this.translate.translate('bank_statament'),
                route: 'bank-statament',
              },
              {
                name: this.translate.translate('history'),
                route: 'cash-history',
              },
            ],
          },
        ],
      },
      {
        iconClass: 'pi pi-cog',
        tooltip: this.translate.translate('menu_settings'),
        name: this.translate.translate('menu_settings'),
        submenu: [
          {
            name: this.translate.translate('church_configuration_title'),
            route: 'church-configuration',
          },
          {
            name: this.translate.translate('entity_users_title'),
            route: 'register/users',
          },
          {
            name: this.translate.translate('user_configuration'),
            route: 'user-configuration',
          },
          {
            name: this.translate.translate('menu_global_settings'),
            submenu: [
              {
                name: this.translate.translate('translations'),
                route: 'translations',
              },
              {
                name: this.translate.translate('menu_permissions'),
                route: 'permission-groups',
              },
              {
                name: this.translate.translate('menu_report_header'),
                route: 'report-template',
              },
            ],
          },

          {
            name: this.translate.translate('menu_logout'),
            route: 'login',
          },
        ],
      },
    ];
  }
}
