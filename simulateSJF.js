import { BOLD, BRIGHT_BLUE, GREEN, RESET, pColor } from "./ConsoleUtils.js";

export default function calculateAverageTimesSJF(n, burstTimes) {
  let A = [];
  let total = 0;
  let index, temp;
  let avg_wt, avg_tat;

  for (let i = 0; i < n; i++) {
    A.push([i + 1, burstTimes[i]]);
  }

  for (let i = 0; i < n; i++) {
    index = i;
    for (let j = i + 1; j < n; j++) {
      if (A[j][1] < A[index][1]) {
        index = j;
      }
    }
    temp = A[i][1];
    A[i][1] = A[index][1];
    A[index][1] = temp;

    temp = A[i][0];
    A[i][0] = A[index][0];
    A[index][0] = temp;
  }

  A[0][2] = 0;
  for (let i = 1; i < n; i++) {
    A[i][2] = 0;
    for (let j = 0; j < i; j++) {
      A[i][2] += A[j][1];
    }
    total += A[i][2];
  }

  avg_wt = total / n;
  total = 0;
  let output = [];
  let ganttChart = [];
  output.push([
    ` ${GREEN}${BOLD}Processes`,
    ` Burst time`,
    ` Waiting time`,
    ` Turnaround time${RESET}`,
  ]);

  for (let i = 0; i < n; i++) {
    A[i][3] = A[i][1] + A[i][2];
    total += A[i][3];
    output.push([`P${A[i][0]}`, A[i][1], A[i][2], A[i][3]]);

    // Add process to the Gantt Chart
    let processGantt = Array(A[i][1]).fill(`P${A[i][0]}`);
    ganttChart.push(processGantt);
  }

  avg_tat = total / n;
  output.push(["Average Waiting Time =", avg_wt]);
  output.push(["Average Turnaround Time =", avg_tat]);

  // Print the Gantt Chart
  pColor("Gantt Chart:", BRIGHT_BLUE);
  let chart = "";
  for (let i = 0; i < ganttChart.length; i++) {
    chart += "| ";
    chart += ganttChart[i].join(" | ");
    chart += " | ";
  }
  console.log(chart);

  return output;
}
