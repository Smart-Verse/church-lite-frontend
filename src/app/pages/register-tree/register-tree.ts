import {PersonMembersComponent} from "../../components/person-members/person-members.component";
import {PositionsComponent} from "../../components/positions/positions.component";
import {Type} from "@angular/core";

export const config: RegisterTreeRoutes[] = [
  {
    header: "Cadastro de plano de contas",
    view: "planAccount",
    route: "planAccount",
    component: PersonMembersComponent
  },
]

export class RegisterTreeRoutes {
  header: string = "";
  view: string = "";
  route: string = "planAccount";
  component: Type<any> = PersonMembersComponent;
}
