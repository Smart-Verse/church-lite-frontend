import {Type} from "@angular/core";
import {PersonMembersComponent} from "../../components/person-members/person-members.component";
import {PositionsComponent} from "../../components/positions/positions.component";

export const config: RegisterRoutes[] = [
  {
    header: "Cadastro de membros",
    view: "personMembers",
    route: "person",
    component: PersonMembersComponent
  },
  {
    header: "Cadastro de cargos",
    view: "positions",
    route: "positions",
    component: PositionsComponent
  }
]

export class RegisterRoutes {
  header: string = "";
  view: string = "";
  route: string = "person";
  component: Type<any> = PersonMembersComponent;
}
