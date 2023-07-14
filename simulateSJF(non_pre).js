class SJFScheduler {
  constructor(processes) {
    this.processes = processes;
  }

  nonPreemptiveSJF() {
    const n = this.processes.length;

    this.processes.sort((a, b) => a.at - b.at);

    let counter = n;
    let upperRange = 0;
    let tm = Math.min(
      Number.MAX_SAFE_INTEGER,
      this.processes[upperRange + 1]?.at
    );

    while (counter > 0) {
      for (; upperRange < n - 1; upperRange++) {
        if (this.processes[upperRange + 1].at > tm) {
          break;
        }
      }

      let minBurstTime = Number.MAX_SAFE_INTEGER;
      let minIndex = -1;

      for (let i = 0; i <= upperRange; i++) {
        if (this.processes[i].bt < minBurstTime && this.processes[i].bt > 0) {
          minBurstTime = this.processes[i].bt;
          minIndex = i;
        }
      }

      if (minIndex !== -1) {
        counter--;
        const index = minIndex;
        tm += this.processes[index].bt;

        this.processes[index].ct = tm;
        this.processes[index].tat =
          this.processes[index].ct - this.processes[index].at;
        this.processes[index].wt =
          this.processes[index].tat - this.processes[index].bt;

        this.processes[index].bt = Number.MAX_SAFE_INTEGER;
      } else {
        tm = this.processes[upperRange + 1]?.at || 0;
      }
    }
  }

  calculateAverageWaitingTime() {
    let totalWt = 0;
    for (let i = 0; i < this.processes.length; i++) {
      totalWt += this.processes[i].wt;
    }
    const avgWt = totalWt / this.processes.length;
    return avgWt;
  }

  calculateAverageTurnaroundTime() {
    let totalTat = 0;
    for (let i = 0; i < this.processes.length; i++) {
      totalTat += this.processes[i].tat;
    }
    const avgTat = totalTat / this.processes.length;
    return avgTat;
  }

  schedule() {
    this.nonPreemptiveSJF();
    const avgWt = this.calculateAverageWaitingTime();
    const avgTat = this.calculateAverageTurnaroundTime();

    const wt = this.processes.map((process) => process.wt);
    const tat = this.processes.map((process) => process.tat);
    const stime = this.processes.map((process) => process.at + process.wt);
    const ctime = this.processes.map((process) => process.ct);

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

const processes = [
  { id: 1, at: 1, bt: 7 },
  { id: 2, at: 2, bt: 5 },
  { id: 3, at: 3, bt: 1 },
  { id: 4, at: 4, bt: 2 },
  { id: 5, at: 5, bt: 8 },
];

const scheduler = new SJFScheduler(processes);
const output = scheduler.schedule();
console.log(output);
