import { BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

function findWaitingTime(processes, n, burstTime, waitingTime, quantum) {
  let remainingTime = burstTime.slice();
  let currentTime = 0;
  let completed = false;

  while (!completed) {
    completed = true;

    for (let i = 0; i < n; i++) {
      if (remainingTime[i] > 0) {
        if (remainingTime[i] > quantum) {
          currentTime += quantum;
          remainingTime[i] -= quantum;
        } else {
          currentTime += remainingTime[i];
          waitingTime[i] = currentTime - burstTime[i];
          remainingTime[i] = 0;
        }

        completed = false;
      }
    }
  }
}

function findTurnaroundTime(
  processes,
  n,
  burstTime,
  waitingTime,
  turnaroundTime
) {
  for (let i = 0; i < n; i++) {
    turnaroundTime[i] = burstTime[i] + waitingTime[i];
  }
}

export function simulateRoundRobin(processes, n, burstTime, quantum) {
  let waitingTime = new Array(n).fill(0);
  let turnaroundTime = new Array(n).fill(0);
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  findWaitingTime(processes, n, burstTime, waitingTime, quantum);
  findTurnaroundTime(processes, n, burstTime, waitingTime, turnaroundTime);

  pColor("Processes  Burst Time  Waiting Time  Turnaround Time", GREEN);
  for (let i = 0; i < n; i++) {
    totalWaitingTime += waitingTime[i];
    totalTurnaroundTime += turnaroundTime[i];
    console.log(
      `${processes[i]}          ${burstTime[i]}             ${waitingTime[i]}            ${turnaroundTime[i]}`
    );
  }

  console.log(`Average waiting time: ${totalWaitingTime / n}`);
  console.log(`Average turnaround time: ${totalTurnaroundTime / n}`);

  // Generate Gantt Chart
  let ganttChart = "";
  let currentTime = 0;
  let remainingTime = burstTime.slice();
  let completed = false;

  while (!completed) {
    completed = true;

    for (let i = 0; i < n; i++) {
      if (remainingTime[i] > 0) {
        if (remainingTime[i] > quantum) {
          ganttChart += `P${processes[i]} `;
          currentTime += quantum;
          remainingTime[i] -= quantum;
        } else {
          let executionTime = remainingTime[i];
          for (let j = 0; j < executionTime; j++) {
            ganttChart += `P${processes[i]} `;
          }
          currentTime += remainingTime[i];
          remainingTime[i] = 0;
        }
        completed = false;
      }
    }
  }
  pColor("Gantt Chart: ", BRIGHT_BLUE);
  console.log(`${ganttChart}`);
}
