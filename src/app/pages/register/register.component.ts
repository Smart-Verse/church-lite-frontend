import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { DataTable } from '../../components/datatable/datatable';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  datatable: DataTable = new DataTable();

  constructor(

  ){
    this.datatable.values = [
      {
        id: "id",
        name: "Geovane",
        idade: "30"
      },
      {
        id: "id",
        name: "Helena",
        idade: "30"
      }
    ];
    this.datatable.fields = [
      {
        field: "name",
        header: "Nome"
      },
      {
        field: "idade",
        header: "Idade"
      }
    ];
  }
}
