import {PersonMembersComponent} from "../../components/person-members/person-members.component";
import {PositionsComponent} from "../../components/positions/positions.component";
import {Type} from "@angular/core";
import {PlanAccountComponent} from "../../components/plan-account/plan-account.component";

export const config: RegisterTreeRoutes[] = [
  {
    header: "Cadastro de plano de contas",
    view: "planAccount",
    route: "planAccount",
    component: PlanAccountComponent
  },
]

export class RegisterTreeRoutes {
  header: string = "";
  view: string = "";
  route: string = "planAccount";
  component: Type<any> = PlanAccountComponent;
}
