import {Type} from "@angular/core";
import {PersonMembersComponent} from "../../components/person-members/person-members.component";

export const config: RegisterRoutes[] = [
  {
    view: "personMembers",
    route: "person",
    component: PersonMembersComponent
  }
]

export class RegisterRoutes {

  view: string = "";
  route: string = "person";
  component?: Type<any> | null;
}
