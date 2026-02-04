import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Position} from "../../../interface/Position";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../../../services/employee.service";
import {PositionService} from "../../../services/position.service";
import {AlertService} from "../alert.service";
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  editEmployee!: FormGroup;
  positionList: Position[] =[];
  // @ts-ignore
  id: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,private employeeService: EmployeeService,
              private positionService: PositionService,private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.editEmployee = new FormGroup({
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
    });
    this.getAllPosition();
    this.activatedRoute.paramMap.subscribe((paramap) => {
      // @ts-ignore
      this.id = paramap.get('id');
      this.employeeService.getEmployeeById(this.id).subscribe(data => {
        console.log(data);
        this.editEmployee.patchValue(data);
      });
    });
  }
  getAllPosition(){
    this.positionService.findAllPosition().subscribe((data) => {
      this.positionList = data;
    })
  }

  edit() {
    if (this.editEmployee.valid){
      this.employeeService.update(this.editEmployee.value,this.id).subscribe((data) =>{
        this.router.navigate(['/listEmployee']);
        this.alertService.showAlertSuccess("Cập Nhật Thành Công!")
      })
    }
  }
}
