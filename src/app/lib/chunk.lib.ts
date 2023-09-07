import { TimeData } from './time-data.lib';


export type Cell = {
  table: string;
  time: TimeData;
}

export class Chunck{
  start: Cell;
  end: Cell;
  customerName: string = "";
  customerCount: number = 0;

  constructor(start: Cell, end: Cell, customerName: string = "", customerCount: number = 0){
    this.start = start;
    this.end = end;
    this.customerName = customerName;
    this.customerCount = customerCount;
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
