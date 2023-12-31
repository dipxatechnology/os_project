export class PriorityScheduler {
  constructor(processes) {
    this.processes = processes;
  }

  compareProcesses(a, b) {
    if (a.at === b.at) {
      return a.pr < b.pr;
    } else {
      return a.at < b.at;
    }
  }

  calculateWaitingTime() {
    const wt = new Array(this.processes.length).fill(0);
    const service = [];

    service[0] = this.processes[0].at;

    for (let i = 1; i < this.processes.length; i++) {
      service[i] = this.processes[i - 1].bt + service[i - 1];
      wt[i] = service[i] - this.processes[i].at;

      if (wt[i] < 0) {
        wt[i] = 0;
      }
    }

    return wt;
  }

  calculateTurnaroundTime(wt) {
    const tat = new Array(this.processes.length);

    for (let i = 0; i < this.processes.length; i++) {
      tat[i] = this.processes[i].bt + wt[i];
    }

    return tat;
  }

  calculateAverageTime() {
    const wt = this.calculateWaitingTime();
    const tat = this.calculateTurnaroundTime(wt);
    const stime = [];
    const ctime = [];

    stime[0] = this.processes[0].at;
    ctime[0] = stime[0] + tat[0];

    for (let i = 1; i < this.processes.length; i++) {
      stime[i] = ctime[i - 1];
      ctime[i] = stime[i] + tat[i] - wt[i];
    }

    const avgWt =
      wt.reduce((sum, time) => sum + time, 0) / this.processes.length;
    const avgTat =
      tat.reduce((sum, time) => sum + time, 0) / this.processes.length;

    return {
      wt,
      tat,
      stime,
      ctime,
      avgWt,
      avgTat,
    };
  }
}
