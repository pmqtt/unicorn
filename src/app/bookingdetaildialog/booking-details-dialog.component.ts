import { Component } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'ns-booking-details-dialog',
  templateUrl: './booking-details-dialog.component.html',
  styleUrls: ['./booking-details-dialog.component.css']
})
export class BookingDetailsDialogComponent {

  customerName: string = '';
  customerCount: number = 0;
  actionRemove: boolean = false;

  constructor(private params: ModalDialogParams) {
    if (params.context && params.context.customerName) {
      this.customerName = params.context.customerName;
      this.customerCount = params.context.customerCount;
    }
  }

  remove(): void{
    this.actionRemove = true;
    this.close(true);
  }

  close(result: boolean) {
    if (result) {
      console.log("close(true)");
      this.params.closeCallback({
        'customerName': this.customerName,
        'customerCount': this.customerCount,
        'actionRemove': this.actionRemove
      });
    } else {
      console.log("close(false)");
      this.params.closeCallback(null);
    }
  }
}
