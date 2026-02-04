import {Component, Inject, OnInit} from '@angular/core';
import {BillService} from "../../services/bill.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AlertService} from "../product/alert.service";
 
@Component({
  selector: 'app-duyet',
  standalone: true,
  imports: [ MatDialogModule ],
  templateUrl: './duyet.component.html',
  styleUrls: ['./duyet.component.css']
})
export class DuyetComponent implements OnInit {
  name: any;
  id:number=0;
  constructor(private billService: BillService,
              public dialog: MatDialogRef<DuyetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private alertService:AlertService) { }

  ngOnInit(): void {
    this.id= this.data.id;
  }

  close() {
    this.dialog.close();
  }

  duyet() {
    this.billService.duyet(this.id).subscribe((data) => {
      this.dialog.close();
      this.alertService.showAlertSuccess("Duyệt thành công!")
    })
  }
}
