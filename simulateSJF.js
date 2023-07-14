import { BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

export default function calculateSJF(n, A, total, burstTimes) {
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
  pColor("Processes\tBurst time\tWaiting time\tTurnaround time", GREEN);

  for (let i = 0; i < n; i++) {
    A[i][3] = A[i][1] + A[i][2];
    total += A[i][3];
    console.log(
      "P" + A[i][0] + "\t" + A[i][1] + "\t" + A[i][2] + "\t" + A[i][3]
    );
  }

  avg_tat = total / n;
  console.log("Average Waiting Time: " + avg_wt);
  console.log("Average Turnaround Time: " + avg_tat);

  let ganttChart = generateGanttChart(A);
  pColor("Gantt Chart:", BRIGHT_BLUE);
  console.log(ganttChart);
}

function generateGanttChart(A) {
  let ganttChart = "";
  for (let i = 0; i < A.length; i++) {
    ganttChart += "P" + A[i][0] + " ";
  }
  return ganttChart;
}
