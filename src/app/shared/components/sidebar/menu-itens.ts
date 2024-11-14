export class MenuItens{
    menuItems = [
        {
            route: "notification",
            iconClass: 'pi pi-bell',
            tooltip: 'Notificações',
            name: 'Notificações',
            submenu: []
        },
        {
            route: "dashboard",
            iconClass: 'pi pi-chart-bar',
            tooltip: 'Dashboard',
            name: 'Dashboard',
            submenu: []
        },
        {
            iconClass: "pi pi-check-square",
            tooltip: "Cadastros",
            name: 'Cadastros',
            submenu: [
                {
                    name: 'Pessoas',
                    submenu: [
                    {
                        route: "register/personMembers",
                        name: 'Membros',
                    },
                    {
                        route: "dashboard",
                        name: 'Fornecedores',
                    }
                    ]
                },
                {
                    name: 'Outros',
                    submenu: [
                      {
                          route: "register/positions",
                          name: 'Cargos',
                      }
                    ]
                }
            ]
        },
        {
            iconClass: "pi pi-money-bill",
            tooltip: "Financeiro",
            name: 'Fiannceiro',
            submenu: [
                {
                    name: 'Receitas',
                    route:'register'
                },
                {
                    name: 'Despesas',
                    route: 'register'
                }
            ]
        }
    ];
}
