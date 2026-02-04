import {Component, OnInit} from '@angular/core';
import {Position} from "../../../interface/Position";
import {PositionService} from "../../../services/position.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {EmployeeService} from "../../../services/employee.service";
import {AlertService} from "../alert.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [ ReactiveFormsModule , CommonModule],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
}) 
export class CreateEmployeeComponent implements OnInit {
  createEmployee!: FormGroup;
  positionList: Position[] =[];

  constructor(private positionService: PositionService, private router: Router, private employeeService: EmployeeService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.positionService.findAllPosition().subscribe((data) => {
      this.positionList= data;
    });
    this.createEmployee = new FormGroup({
      idEmployee: new FormControl('', [Validators.required, Validators.pattern("^(NV-)+[0-9]{4}")]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullName: new FormControl('',[Validators.required]),
      dateOfBirth: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^(090)+[0-9]{7}")]),
      positionId: new FormControl('',[Validators.required]),
      userName: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      avtUrl: new FormControl('',[Validators.required]),
    })
  }
  create() {
    if (this.createEmployee.valid){
      this.employeeService.createEmployee(this.createEmployee.value).subscribe((data) =>{
        this.router.navigate(['/listEmployee']);
        this.alertService.showAlertSuccess("Tạo Mới Thành Công!")
    })
    }
  }
}
