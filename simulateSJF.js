export class SJFScheduler {
  constructor(arrivalTimes, burstTimes) {
    this.processes = [];
    for (let i = 0; i < burstTimes.length; i++) {
      this.processes.push({
        id: i + 1,
        arrivalTime: arrivalTimes[i],
        burstTime: burstTimes[i],
        waitingTime: 0,
        turnaroundTime: 0,
      });
    }
  }

  sortProcessesByArrivalTime() {
    this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  }

  sortProcessesByBurstTime() {
    this.processes.sort((a, b) => a.burstTime - b.burstTime);
  }

  calculateWaitingTimes() {
    let total = 0;
    let currentTime = 0;
    for (let i = 0; i < this.processes.length; i++) {
      if (this.processes[i].arrivalTime > currentTime) {
        currentTime = this.processes[i].arrivalTime;
      }
      this.processes[i].waitingTime =
        currentTime - this.processes[i].arrivalTime;
      currentTime += this.processes[i].burstTime;
      total += this.processes[i].waitingTime;
    }
    const avgWt = total / this.processes.length;
    return avgWt;
  }

  calculateTurnaroundTimes() {
    let total = 0;
    for (let i = 0; i < this.processes.length; i++) {
      this.processes[i].turnaroundTime =
        this.processes[i].burstTime + this.processes[i].waitingTime;
      total += this.processes[i].turnaroundTime;
    }
    const avgTat = total / this.processes.length;
    return avgTat;
  }

  schedule() {
    this.sortProcessesByArrivalTime();
    this.sortProcessesByBurstTime();
    const avgWt = this.calculateWaitingTimes();
    const avgTat = this.calculateTurnaroundTimes();

    const wt = this.processes.map((process) => process.waitingTime);
    const tat = this.processes.map((process) => process.turnaroundTime);
    const stime = this.processes.map(
      (process) => process.arrivalTime + process.waitingTime
    );
    const ctime = this.processes.map(
      (process, index) => process.arrivalTime + tat[index]
    );

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

// Example usage
