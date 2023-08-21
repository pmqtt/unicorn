import { Component, OnInit,ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from '@nativescript/angular';
import { BookingDetailsDialogComponent } from '../bookingdetaildialog/booking-details-dialog.component';


class TimeData{
  desc: string;
  index : number;
  constructor(desc: string, index: number){
    this.desc = desc;
    this.index = index;
  }
}

const time_data = [ new TimeData("08:00", 0), new TimeData("09:00", 1), new TimeData("10:00", 2),
                  new TimeData("11:00", 3), new TimeData("12:00", 4), new TimeData("13:00", 5),
                  new TimeData("14:00", 6), new TimeData("15:00", 7), new TimeData("16:00", 8),
                  new TimeData("17:00", 9), new TimeData("18:00", 10), new TimeData("19:00", 11),
                  new TimeData("20:00", 12), new TimeData("21:00", 13), new TimeData("22:00", 14),
                  new TimeData("23:00", 15), new TimeData("00:00", 16), new TimeData("01:00", 17),
                  new TimeData("02:00", 18), new TimeData("03:00", 19), new TimeData("04:00", 20),
                  new TimeData("05:00", 21)];

type Cell = {
  table: string;
  time: TimeData;
}
function createTimeData(startTime: string, endTime: string, min: number): TimeData[] {
    let result = [];
    let start = startTime.split(":");
    let end = endTime.split(":");
    let startHour = parseInt(start[0]);
    let startMin = parseInt(start[1]);
    let endHour = parseInt(end[0]);
    let endMin = parseInt(end[1]);
    let index = 0;
    while (startHour != endHour || startMin != endMin || index == 0) {
        // Format the time and push to result
        result.push(new TimeData(`${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`, index));

        // Increment time
        startMin += min;
        if (startMin >= 60) {
            startHour++;
            startMin %= 60;
        }
        if (startHour > 23) {
            startHour = 0;
        }

        index++;
    }
    return result;
}

class Chunck{
  start: Cell;
  end: Cell;
  customerName: string = "";
  customerCount: number = 0;

  constructor(start: Cell, end: Cell){
    this.start = start;
    this.end = end;
  }

  changeEnd(end: Cell):void{
    this.end = end;
  }

  startCell(): Cell{
    return this.start;
  }

  endCell(): Cell{
    return this.end;
  }

  in(cell: Cell): boolean{
    if(cell === undefined || cell == null){
      return false;
    }
    if(cell.table == this.start.table && cell.table == this.end.table){
      if(cell.time.index >= this.start.time.index && cell.time.index <= this.end.time.index){
        return true;
      }
    }
    return false;
  }
}

@Component({
  selector: "tablechart",
  templateUrl: "./tablechart.component.html",
  styleUrls: ["./tablechart.component.css"]
})
export class TableChartComponent implements OnInit {
  // Beispieldaten
  tables = [1 , 2, 3, 4, 5, 6, 7, 8, 9, 10];
  hours = createTimeData("16:00","03:30",30);//time_data;
  bookingStartCell: Cell | null = null;
  bookings: { [key: string]: Chunck } = {};
  currentDate: Date = new Date();
  currentTime: string;

  constructor(private modalService: ModalDialogService, private vcRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);  // Update every second
  }

  updateTime() {
    this.currentTime = this.currentDate.toLocaleTimeString();
  }

  goToNextDay() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.updateTime();
  }


  startBooking(table: string, time: TimeData) {
    this.bookingStartCell = {table: table, time: time};
  }

  endBooking(table: string, time: TimeData) {
    if (this.bookingStartCell !== null) {
      for (let i = this.bookingStartCell.time.index; i <= time.index; i++) {
        if(this.bookings[this.hashCell(this.bookingStartCell)] === undefined){
          this.bookings[this.hashCell(this.bookingStartCell)] = new Chunck({
                                                                             table: this.bookingStartCell.table,
                                                                             time: this.bookingStartCell.time},
                                                                             {table: table, time: time});
        }else{
          this.bookings[this.hashCell(this.bookingStartCell)].changeEnd({table: table, time: time});
        }
      }
      this.showBookingDetailsDialog(this.modalService, this.vcRef, this.bookings[this.hashCell(this.bookingStartCell)]);
      this.bookingStartCell = null;
    }else{
      const chunk = this.findChunk({table: table, time: time});
      if(chunk !== null){
        this.showBookingDetailsDialog(this.modalService, this.vcRef, chunk);
      }
    }
  }

  showBookingDetailsDialog(modalService: ModalDialogService, vcRef: ViewContainerRef, chunk: Chunck) {
      const options: ModalDialogOptions = {
        viewContainerRef: this.vcRef, // Sie müssen die ViewContainerRef injecten
        context: {
          customerName: chunk.customerName,
          customerCount: chunk.customerCount,
          actionRemove: false
        }
      };

      this.modalService.showModal(BookingDetailsDialogComponent, options)
        .then((result: any) => {
          console.log(result);
          if (result !== null) {
            chunk.customerName = result.customerName;
            chunk.customerCount = result.customerCount;
            if(result.actionRemove){
              delete this.bookings[this.hashCell(chunk.startCell())];
            }
          }
        });
  }

  isBooked(table: string, hour: TimeData): boolean {
    for(const key in this.bookings){
      if(this.bookings[key].in({table: table, time: hour})){
        return true;
      }
    }
    return false;
  }

  isWithinBookingSession(table: string, hour: TimeData): boolean {
    if(this.bookingStartCell === null && Object.keys(this.bookings).length === 0){
      return false;
    }
    if(this.bookingStartCell !== null && Object.keys(this.bookings).length === 0){
      if(this.bookingStartCell.table === table && this.bookingStartCell.time.index < hour.index){
        return true;
      }
      return false;
    }
    if(this.bookingStartCell === null){
      return false;
    }
    if(this.bookingStartCell.table !== table){
      return false;
    }


    //let chunk = this.findLeftChunk(this.bookingStartCell);
    let rightChunk = this.findRightChunk(this.bookingStartCell);
    if(rightChunk === null){
      let res = this.findChunk({table: table, time: hour});
      if(res !== null){
        return false;
      }
      if ( hour.index <= this.bookingStartCell.time.index){
        return false;
      }
      return true;
    }else{
      let res = this.findChunk({table: table, time: hour});
      if(res !== null){
        return false;
      }
      if ( hour.index <= this.bookingStartCell.time.index || hour.index >= rightChunk.startCell().time.index){
        return false;
      }
      return true;
    }
  }

  isLastInBookingSession(table: string, hour: TimeData): boolean {
    let chunk = this.findChunk({table: table, time: hour});
    if(chunk === null){
      return false;
    }
    if(chunk.endCell().time.index === hour.index && chunk.endCell().table === table){
      return true;
    }
    return false;
  }

  hashCell(cell: Cell): string{
    if(cell == null){
      return "";
    }
    return `${cell.table}-${cell.time.index}`;
  }

  findChunk(cell: Cell): Chunck | null{
    for(const key in this.bookings){
      if(this.bookings[key].in(cell)){
        return this.bookings[key];
      }
    }
    return null;
  }

  findLeftChunk(cell: Cell): Chunck | null{
    let maxChunk: Chunck = null;
    for (const key in this.bookings) {
      if (!this.bookings[key].in(cell) && this.bookings[key].endCell().table === cell.table) {
        let possibleChunk = this.bookings[key];
        if(possibleChunk.endCell().time.index < cell.time.index){
          if(maxChunk === null){
            maxChunk = possibleChunk;
          }else{
            if(maxChunk.endCell().time.index > possibleChunk.startCell().time.index){
              maxChunk = possibleChunk;
            }
          }
        }
      }
    }
    return maxChunk;
  }

  findRightChunk(cell: Cell): Chunck | null{
    let maxChunk: Chunck = null;
    for (const key in this.bookings) {
      if (!this.bookings[key].in(cell) && this.bookings[key].startCell().table === cell.table) {
        let possibleChunk = this.bookings[key];
        if(possibleChunk.startCell().time.index > cell.time.index){
          if(maxChunk === null){
            maxChunk = possibleChunk;
          }else{
            if(maxChunk.startCell().time.index < possibleChunk.startCell().time.index){
              maxChunk = possibleChunk;
            }
          }
        }
      }
    }
    return maxChunk;
  }

  isWithinBookingSessionMiddle(table: string, hour: TimeData): boolean {
    let chunk = this.findChunk({table: table, time: hour});
    if(chunk === null){
      return false;
    }
    if(chunk.startCell().time.index !== hour.index && chunk.endCell().time.index !== hour.index){
      return true;
    }
    return false;
  }

  getBookingData(table: string, hour: TimeData): string{
    let chunk = this.findChunk({table: table, time: hour});
    if(chunk === null){
      return "";
    }
    if(chunk.startCell().time.index === hour.index){
      return chunk.customerName + " ( " + chunk.customerCount + " )";
    }
    return "";
  }

  isNotCovered(table: string, hour: TimeData): boolean{
    let chunk = this.findChunk({table: table, time: hour});
    if(chunk === null){
      return true;
    }
    if(chunk.startCell().time.index === hour.index && chunk.startCell().table === table){
      return true;
    }

    return false;
  }

  getBookingDuration(table: string, hour: TimeData): number{
    let chunk = this.findChunk({table: table, time: hour});
    if(chunk === null){
      return 1;
    }
    if(chunk.startCell().time.index === hour.index){
      return chunk.endCell().time.index - chunk.startCell().time.index + 1;
    }
    return 1;
  }

  getFormattedDate(): string {
    let day = this.currentDate.getDate().toString();
    let month = (this.currentDate.getMonth() + 1).toString(); // Monate sind von 0-11, daher +1

    // Füge eine führende Null hinzu, wenn Tag oder Monat nur eine Ziffer haben
    day = day.length === 1 ? '0' + day : day;
    month = month.length === 1 ? '0' + month : month;

    return `${day}.${month}`;
  }

  getCurrentHour(hour: TimeData) : boolean{
    const hh = hour.desc.split(":")[0];
    //get the current hour in local Format
    console.log(hh);
    if(hh === "16"){
      console.log("true");
      return true;
    }
    return false;
  }

}
