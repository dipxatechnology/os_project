import { BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

function findWaitingTime(processes, n, bt, wt) {
  wt[0] = 0;

  for (let i = 1; i < n; i++) {
    wt[i] = bt[i - 1] + wt[i - 1];
  }
}

function findTurnAroundTime(processes, n, bt, wt, tat) {
  for (let i = 0; i < n; i++) {
    tat[i] = bt[i] + wt[i];
  }
}

export default function simulateFCFS(processes, n, bt) {
  let wt = new Array(n);
  let tat = new Array(n);

  for (let i = 0; i < n; i++) {
    wt[i] = 0;
    tat[i] = 0;
  }

  let total_wt = 0;
  let total_tat = 0;

  findWaitingTime(processes, n, bt, wt);
  findTurnAroundTime(processes, n, bt, wt, tat);

  pColor("Processes\tBurst time\tWaiting time\tTurnaround time", GREEN);

  for (let i = 0; i < n; i++) {
    total_wt += wt[i];
    total_tat += tat[i];
    console.log(
      "P" + processes[i] + "\t\t" + bt[i] + "\t\t" + wt[i] + "\t\t" + tat[i]
    );
  }

  let avg_wt = total_wt / n;
  let avg_tat = total_tat / n;

  console.log("\nAverage waiting time = " + avg_wt);

  console.log("Average turnaround time = " + avg_tat);

  let ganttChart = generateGanttChart(processes, bt);
  pColor("\nGantt Chart:", BRIGHT_BLUE);
  console.log(ganttChart);
}

function generateGanttChart(processes, bt) {
  let ganttChart = "";

  for (let i = 0; i < processes.length; i++) {
    ganttChart += "P" + processes[i] + " | ";
  }

  ganttChart += "\n";

  let currentTime = 0;

  for (let i = 0; i < processes.length; i++) {
    currentTime += bt[i];
    ganttChart += currentTime + " ";
  }

  return ganttChart;
}
