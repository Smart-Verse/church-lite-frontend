import {Type} from "@angular/core";
import {PersonComponent} from "../../components/person/person.component";
import {PositionsComponent} from "../../components/positions/positions.component";
import {BankComponent} from "../../components/bank/bank.component";
import {CashComponent} from "../../components/cash/cash.component";
import {FinancialComponent} from "../../components/financial/financial.component";
import {EventsTypeComponent} from "../../components/events-type/events-type.component";
import {UserAdminComponent} from "../../components/user-admin/user-admin.component";

export const config: RegisterRoutes[] = [
  {
    header: "registrations_persons_members",
    view: "personMembers",
    route: "person",
    paramExtra: "MEMBERS",
    defaultFilter: "type eq 0",
    component: PersonComponent
  },
  {
    header: "registrations_persons_suppliers",
    view: "personSupplier",
    route: "person",
    paramExtra: "SUPPLIER",
    defaultFilter: "type eq 1",
    component: PersonComponent
  },
  {
    header: "registrations_persons_new_convert",
    view: "personNewConvert",
    route: "person",
    paramExtra: "NEW_CONVERT",
    defaultFilter: "type eq 4",
    component: PersonComponent
  },
  {
    header: "registrations_persons_visitor",
    view: "personVisitor",
    route: "person",
    paramExtra: "SUPPLIER",
    defaultFilter: "type eq 3",
    component: PersonComponent
  },
  {
    header: "entity_churches_title",
    view: "personChurch",
    route: "person",
    paramExtra: "CHURCH",
    defaultFilter: "type eq 5",
    component: PersonComponent
  },
  {
    header: "entity_users_title",
    view: "users",
    route: "userConfiguration",
    paramExtra: "",
    defaultFilter: "",
    component: UserAdminComponent
  },
  {
    header: "entity_positions_title",
    view: "positions",
    route: "positions",
    paramExtra: "",
    defaultFilter: "",
    component: PositionsComponent
  },
  {
    header: "entity_event_type_title",
    view: "eventsType",
    route: "eventsType",
    paramExtra: "",
    defaultFilter: "",
    component: EventsTypeComponent
  },
  {
    header: "entity_bank_title",
    view: "bank",
    route: "bank",
    paramExtra: "",
    defaultFilter: "",
    component: BankComponent
  },
  {
    header: "entity_cash_title",
    view: "cash",
    route: "cash",
    paramExtra: "",
    defaultFilter: "",
    component: CashComponent
  },
  {
    header: "financial_page_revenues",
    view: "revenues",
    route: "financial",
    paramExtra: "",
    defaultFilter: "typeFinancial eq 0",
    component: FinancialComponent
  },
  {
    header: "financial_page_expenses",
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
