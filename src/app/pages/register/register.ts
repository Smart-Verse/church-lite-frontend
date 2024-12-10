import {Type} from "@angular/core";
import {PersonComponent} from "../../components/person/person.component";
import {PositionsComponent} from "../../components/positions/positions.component";
import {BankComponent} from "../../components/bank/bank.component";
import {CashComponent} from "../../components/cash/cash.component";
import {FinancialComponent} from "../../components/financial/financial.component";
import {EventsTypeComponent} from "../../components/events-type/events-type.component";

export const config: RegisterRoutes[] = [
  {
    header: "Cadastro de membros",
    view: "personMembers",
    route: "person",
    paramExtra: "MEMBERS",
    defaultFilter: "type eq 0",
    component: PersonComponent
  },
  {
    header: "Cadastro de fornecedores",
    view: "personSupplier",
    route: "person",
    paramExtra: "SUPPLIER",
    defaultFilter: "type eq 1",
    component: PersonComponent
  },
  {
    header: "Cadastro de novos convertidos",
    view: "personNewConvert",
    route: "person",
    paramExtra: "NEW_CONVERT",
    defaultFilter: "type eq 4",
    component: PersonComponent
  },
  {
    header: "Cadastro de visitantes",
    view: "personVisitor",
    route: "person",
    paramExtra: "SUPPLIER",
    defaultFilter: "type eq 3",
    component: PersonComponent
  },
  {
    header: "Cadastro de igrejas",
    view: "personChurch",
    route: "person",
    paramExtra: "CHURCH",
    defaultFilter: "type eq 5",
    component: PersonComponent
  },
  {
    header: "Cadastro de cargos",
    view: "positions",
    route: "positions",
    paramExtra: "",
    defaultFilter: "",
    component: PositionsComponent
  },
  {
    header: "Cadastro de tipos de eventos",
    view: "eventsType",
    route: "eventsType",
    paramExtra: "",
    defaultFilter: "",
    component: EventsTypeComponent
  },
  {
    header: "Cadastro de banco",
    view: "bank",
    route: "bank",
    paramExtra: "",
    defaultFilter: "",
    component: BankComponent
  },
  {
    header: "Cadastro de caixas",
    view: "cash",
    route: "cash",
    paramExtra: "",
    defaultFilter: "",
    component: CashComponent
  },
  {
    header: "Cadastro de receitas",
    view: "revenues",
    route: "financial",
    paramExtra: "",
    defaultFilter: "typeFinancial eq 0",
    component: FinancialComponent
  },
  {
    header: "Cadastro de despesas",
    view: "expenses",
    route: "financial",
    paramExtra: "",
    defaultFilter: "typeFinancial eq 1",
    component: FinancialComponent
  }
]

export class RegisterRoutes {
  header: string = "";
  view: string = "";
  route: string = "person";
  paramExtra: string = "";
  defaultFilter: string = "";
  component: Type<any> = PersonComponent;
}
