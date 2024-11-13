import {Type} from "@angular/core";
import {PersonMembersComponent} from "../../components/person-members/person-members.component";

export const config: RegisterRoutes[] = [
  {
    header: "Cadastro de membros",
    view: "personMembers",
    route: "person",
    component: PersonMembersComponent
  }
]

export class RegisterRoutes {
  header: string = "";
  view: string = "";
  route: string = "person";
  component: Type<any> = PersonMembersComponent;
}
