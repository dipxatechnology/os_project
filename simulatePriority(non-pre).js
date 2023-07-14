class PriorityScheduler_nonpram {
  constructor(arrivalTime, burstTime, priority) {
    this.processes = [];
    for (let i = 0; i < arrivalTime.length; i++) {
      this.processes[i] = {
        at: arrivalTime[i],
        bt: burstTime[i],
        pr: priority[i],
        pno: i + 1,
      };
    }
  }

  compareProcesses(a, b) {
    if (a.at === b.at) {
      return a.pr < b.pr;
    } else {
      return a.at < b.at;
    }
  }

  getWaitingTime() {
    const service = [];
    const wt = new Array(this.processes.length);

    service[0] = this.processes[0].at;
    wt[0] = 0;

    for (let i = 1; i < this.processes.length; i++) {
      service[i] = this.processes[i - 1].bt + service[i - 1];
      wt[i] = service[i] - this.processes[i].at;

      if (wt[i] < 0) {
        wt[i] = 0;
      }
    }

    return wt;
  }

  getTurnaroundTime(wt) {
    const tat = new Array(this.processes.length);

    for (let i = 0; i < this.processes.length; i++) {
      tat[i] = this.processes[i].bt + wt[i];
    }

    return tat;
  }

  findGanttChart() {
    const wt = this.getWaitingTime();
    const tat = this.getTurnaroundTime(wt);
    const stime = [];
    const ctime = [];

    stime[0] = this.processes[0].at;
    ctime[0] = stime[0] + tat[0];

    for (let i = 1; i < this.processes.length; i++) {
      stime[i] = ctime[i - 1];
      ctime[i] = stime[i] + tat[i] - wt[i];
    }

    const wavg =
      wt.reduce((sum, time) => sum + time, 0) / this.processes.length;
    const tavg =
      tat.reduce((sum, time) => sum + time, 0) / this.processes.length;

    return {
      wt,
      tat,
      stime,
      ctime,
      avgWt: wavg,
      avgTat: tavg,
    };
  }
}

// Example usage
const arrivalTime = [1, 2, 3, 4, 5];
const burstTime = [3, 5, 1, 7, 4];
const priority = [3, 4, 1, 7, 8];

const scheduler = new PriorityScheduler_nonpram(
  arrivalTime,
  burstTime,
  priority
);
const output = scheduler.findGanttChart();
console.log(output);
