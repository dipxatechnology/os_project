import { BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

export class Process_non_pre {
  constructor(pid, bt, art) {
    this.pid = pid; // Process ID
    this.bt = bt; // Burst Time
    this.art = art; // Arrival Time
  }
}

function findWaitingTime(proc, n, wt) {
  let rt = new Array(n);

  // Copy the burst time into rt[]
  for (let i = 0; i < n; i++) {
    rt[i] = proc[i].bt;
  }

  let complete = 0,
    t = 0,
    minm = Number.MAX_VALUE;
  let shortest = 0,
    finish_time;
  let check = false;

  // Process until all processes get completed
  while (complete != n) {
    // Find the process with the minimum remaining time among the processes that arrive till the current time
    for (let j = 0; j < n; j++) {
      if (proc[j].art <= t && rt[j] < minm && rt[j] > 0) {
        minm = rt[j];
        shortest = j;
        check = true;
      }
    }

    if (check == false) {
      t++;
      continue;
    }

    // Reduce the remaining time by one
    rt[shortest]--;

    // Update the minimum
    minm = rt[shortest];
    if (minm == 0) {
      minm = Number.MAX_VALUE;
    }

    // If a process gets completely executed
    if (rt[shortest] == 0) {
      // Increment complete
      complete++;
      check = false;

      // Find the finish time of the current process
      finish_time = t + 1;

      // Calculate the waiting time
      wt[shortest] = finish_time - proc[shortest].bt - proc[shortest].art;

      if (wt[shortest] < 0) {
        wt[shortest] = 0;
      }
    }
    // Increment time
    t++;
  }
}

function findTurnAroundTime(proc, n, wt, tat) {
  // Calculating turnaround time by adding bt[i] + wt[i]
  for (let i = 0; i < n; i++) {
    tat[i] = proc[i].bt + wt[i];
  }
}

export function findavgTime(proc, n) {
  let wt = new Array(n),
    tat = new Array(n);
  let total_wt = 0,
    total_tat = 0;

  // Function to find the waiting time of all processes
  findWaitingTime(proc, n, wt);

  // Function to find the turn around time for all processes
  findTurnAroundTime(proc, n, wt, tat);

  // Display processes along with all details
  pColor("Processes\tBurst time\tWaiting time\tTurnaround time", GREEN);
  for (let i = 0; i < n; i++) {
    console.log(`${proc[i].pid}\t\t${proc[i].bt}\t\t${wt[i]}\t\t${tat[i]}`);
    total_wt += wt[i];
    total_tat += tat[i];
  }

  // Calculate average waiting time and average turnaround time
  const avg_wt = total_wt / n;
  const avg_tat = total_tat / n;

  console.log(`Average waiting time = ${avg_wt}`);
  console.log(`Average turnaround time = ${avg_tat}`);
  // Display Gantt Chart
  pColor("\nGantt Chart:", BRIGHT_BLUE);
  let chart = "";
  let currentTime = proc[0].art;
  for (let i = 0; i < n; i++) {
    chart += `P${proc[i].pid} `;
    currentTime += proc[i].bt;
    if (i < n - 1) {
      chart += `| ${currentTime} `;
    }
  }
  console.log(chart);
}
