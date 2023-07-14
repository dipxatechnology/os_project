export class FCFScheduler {
  constructor(processes, arrivalTimes, burstTimes) {
    this.processes = processes;
    this.arrivalTimes = arrivalTimes;
    this.burstTimes = burstTimes;
  }

  findWaitingTime() {
    const n = this.processes.length;
    const wt = [0];

    for (let i = 1; i < n; i++) {
      const waitTime =
        this.burstTimes[i - 1] + wt[i - 1] - this.arrivalTimes[i];
      wt[i] = waitTime >= 0 ? waitTime : 0;
    }

    return wt;
  }

  findTurnaroundTime(waitingTimes) {
    const tat = [];
    for (let i = 0; i < this.processes.length; i++) {
      tat[i] = this.burstTimes[i] + waitingTimes[i];
    }
    return tat;
  }

  findAverageTime() {
    const n = this.processes.length;
    const waitingTimes = this.findWaitingTime();
    const turnaroundTimes = this.findTurnaroundTime(waitingTimes);
    const totalWt = waitingTimes.reduce((acc, wt) => acc + wt, 0);
    const totalTat = turnaroundTimes.reduce((acc, tat) => acc + tat, 0);
    const avgWt = totalWt / n;
    const avgTat = totalTat / n;

    const output = {
      wt: waitingTimes,
      tat: turnaroundTimes,
      stime: waitingTimes.map((wt, i) => wt + 1),
      ctime: turnaroundTimes.map((tat, i) => tat + 1),
      avgWt,
      avgTat,
    };

    return output;
  }
}

const processes = ["P1", "P2", "P3", "P4", "P5"];
const arrivalTimes = [0, 2, 2, 5, 6];
const burstTimes = [7, 6, 9, 3, 4];

const scheduler = new FCFScheduler(processes, arrivalTimes, burstTimes);
const result = scheduler.findAverageTime();

console.log(result);
