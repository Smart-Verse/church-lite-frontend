import {inject} from "@angular/core";
import {TranslateService} from "../../shared/services/translate/translate.service";


export class MenuItens{
    translate = inject(TranslateService);
    menuItems = [
        {
            route: "notification",
            iconClass: 'pi pi-bell',
            tooltip: this.translate.translate("notification"),
            name: this.translate.translate("notification"),
            submenu: []
        },
        {
          route: "dashboard",
          iconClass: 'pi pi-chart-bar',
          tooltip: this.translate.translate("dashboard"),
          name: this.translate.translate("dashboard"),
          submenu: []
        },
        {
          route: "scheduler",
          iconClass: 'pi pi-calendar',
          tooltip: this.translate.translate("scheduler"),
          name: this.translate.translate("scheduler"),
          submenu: []
        },
        {
            iconClass: "pi pi-home",
            tooltip: this.translate.translate("registrations"),
            name: this.translate.translate("registrations"),
            submenu: [
                {
                    name: this.translate.translate("registrations_persons"),
                    submenu: [
                      {
                          route: "register/personMembers",
                          name: this.translate.translate("registrations_persons_members"),
                      },
                      {
                        route: "register/personNewConvert",
                        name: this.translate.translate("registrations_persons_new_convert"),
                      },
                      {
                          route: "register/personSupplier",
                          name: this.translate.translate("registrations_persons_suppliers"),
                      },
                      {
                        route: "register/personVisitor",
                        name: this.translate.translate("registrations_persons_visitor"),
                      }
                    ]
                },
                {
                  name: 'Financeiro',
                  submenu: [
                    {
                      route: "planAccount",
                      name: 'Plano de contas',
                    },
                    {
                      route: "costCenter",
                      name: 'Centro de custo',
                    },
                    {
                      route: "register/cash",
                      name: 'Caixas',
                    },
                    {
                      route: "register/bank",
                      name: 'Bancos',
                    }
                  ]
                },
                {
                    name: 'Outros',
                    submenu: [
                      {
                          route: "register/positions",
                          name: 'Cargos',
                      },
                      {
                        route: "register/eventsType",
                        name: 'Tipo de eventos',
                      }
                    ]
                }
            ]
        },
        {
            iconClass: "pi pi-dollar",
            tooltip: "Financeiro",
            name: 'Financeiro',
            submenu: [
                {
                    name: 'Receitas',
                    route:'register/revenues'
                },
                {
                    name: 'Despesas',
                    route: 'register/expenses'
                },
                {
                  name: 'Movimentações',
                  submenu: [
                    {
                      name: 'Caixas',
                      route:'transactions'
                    },
                    {
                      name: 'Extrato Bancário',
                      route:'bank-statament'
                    },
                    {
                      name: 'Histórico Fechamento',
                      route:'cash-history'
                    },
                  ]
                }
            ]
        },
        {
          iconClass: 'pi pi-cog',
          tooltip: 'Configurações',
          name: 'Configurações',
          submenu: [
            {
              name: 'Cadastro de usuários',
              route:'register/revenues'
            },
            {
              name: 'Cadastro de igrejas',
              route:'register/personChurch'
            },
            {
              name: 'Configurações do usuário',
              route:'user-configuration'
            },
            {
              name: 'Configurações do globais',
              submenu: [
                {
                  name: 'Traduções',
                  route:''
                },
                {
                  name: 'Permissionamento',
                  route:''
                },
                {
                  name: 'Cabeçalho Relatórios',
                  route:''
                },
              ]
            },

            {
              name: 'Logout',
              route:'login'
            },
          ]
        },
    ];
}
