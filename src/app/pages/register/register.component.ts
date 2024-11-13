import {Component, OnInit} from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { DataTable } from '../../components/datatable/datatable';
import {RegisterService} from "../../services/register/register.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    RegisterService,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  datatable: DataTable = new DataTable();

  constructor(
      private readonly registerService: RegisterService
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
        header: "Nome",
        width: "70%"
      },
      {
        field: "idade",
        header: "Idade",
        width: "10%"
      }
    ];
  }

  ngOnInit(): void {

    this.registerService.loadModelRegister().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })

  }
}
