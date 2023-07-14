import { BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

function getWaitingTime(proc, wt) {
  wt[0] = 0;

  for (let i = 1; i < proc.length; i++) {
    let serviceTime = proc[i - 1][1] + wt[i - 1];
    wt[i] = Math.max(0, serviceTime - proc[i][0]);
  }
}

function getTurnaroundTime(proc, wt, tat) {
  for (let i = 0; i < proc.length; i++) {
    tat[i] = proc[i][1] + wt[i];
  }
}

export default function simulatePriority_non_pre(proc) {
  const wt = new Array(proc.length).fill(0);
  const tat = new Array(proc.length).fill(0);
  let wavg = 0;
  let tavg = 0;

  getWaitingTime(proc, wt);
  getTurnaroundTime(proc, wt, tat);

  pColor(
    "Process_no\tStart_time\tComplete_time\tTurn_Around_Time\tWaiting_Time",
    GREEN
  );

  for (let i = 0; i < proc.length; i++) {
    wavg += wt[i];
    tavg += tat[i];

    console.log(
      proc[i][3] +
        "\t\t" +
        proc[i][0] +
        "\t\t" +
        (tat[i] + proc[i][0]) +
        "\t\t" +
        tat[i] +
        "\t\t\t" +
        wt[i]
    );
  }

  console.log("Average waiting time is: " + wavg / proc.length);
  console.log("Average turnaround time: " + tavg / proc.length);

  let ganttChart = generateGanttChart(proc);
  pColor("Gantt Chart:\n", BRIGHT_BLUE);
  console.log(ganttChart);
}

function generateGanttChart(proc) {
  let ganttChart = "";
  let currentTime = 0;

  for (let i = 0; i < proc.length; i++) {
    ganttChart += "P" + proc[i][3] + " ";
    currentTime += proc[i][1];
  }

  return ganttChart;
}
