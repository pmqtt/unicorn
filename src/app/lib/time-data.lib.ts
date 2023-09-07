
export class TimeData{
  desc: string;
  index : number;
  constructor(desc: string, index: number){
    this.desc = desc;
    this.index = index;
  }
}

export function createTimeData(startTime: string, endTime: string, min: number): TimeData[] {
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

