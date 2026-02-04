import {Component, OnInit, Renderer2} from '@angular/core';
import {Employee} from "../../../interface/Employee";
import {EmployeeService} from "../../../services/employee.service";
import {AlertService} from "../alert.service";
import {PositionService} from "../../../services/position.service";
import {Position} from "../../../interface/Position";
import {MatDialog} from "@angular/material/dialog";
import {DeleteEmployeeComponent} from "../delete-employee/delete-employee.component";
import {DetailEmployeeComponent} from "../detail-employee/detail-employee.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employeeList: Employee[] = [];
  positionList: Position[] =[];
  totalPagination: number = 0;
  indexPagination: number = 1;
  search!: FormGroup;


  constructor(private employeeService: EmployeeService, private alertService: AlertService,
              private positionService: PositionService, private dialog: MatDialog,
              private renderer:Renderer2,
              private titleService:Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle("Quản Lý Nhân Viên");
    this.getList();
    this.search = new FormGroup({
      nameSearch: new FormControl(''),
      typeSearch: new FormControl(''),
    })
  }

  getList() {
    this.employeeService.getAllEmployee().subscribe((data) => {
      this.employeeList = data.content;
      this.totalPagination = data.totalPages;
    });
    this.positionService.findAllPosition().subscribe((data)=>{
      this.positionList = data;
    })
  }

  delete(id: String, fullName: String) {
    const dialog = this.dialog.open(DeleteEmployeeComponent, {
      width: '500px',
      data: {employeeId: id,name: fullName}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  view(id: String) {
    const dialog = this.dialog.open(DetailEmployeeComponent, {
      width: '500px',
      height: '500px',
      data: {employeeId: id}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  searchE() {
    this.employeeService.getSearchEmployee(this.search.value.nameSearch,this.search.value.typeSearch).subscribe((data) => {
      this.employeeList = data.content;
      this.totalPagination = data.totalPages;
    },()=> {
      this.alertService.showMessageErrors("Không tìm thấy!");
    });
    try {
      const errorField = this.renderer.selectRootElement('.tb');
      errorField.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"} );
    } catch (err) {

    }
  }
  getPage(page: number) {
    this.employeeService.searchEmployee(this.search.value.nameSearch,this.search.value.typeSearch,page).subscribe((data) => {
      this.employeeList = data.content;
      this.indexPagination  = data.pageable.pageNumber + 1;
      this.totalPagination = data.totalPages;
    });
    try {
      const errorField = this.renderer.selectRootElement('.tb');
      errorField.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"} );
    } catch (err) {

    }
  }
}
