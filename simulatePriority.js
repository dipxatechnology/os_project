import { BOLD, BRIGHT_BLUE, GREEN, pColor } from "./ConsoleUtils.js";

function simulatePreemptivePriority(proc) {
  let time = 0;
  let complete = 0;
  let currentProcess = null;
  let ganttChart = [];

  while (complete !== proc.length) {
    let highestPriority = Infinity;
    let nextProcess = null;

    for (let i = 0; i < proc.length; i++) {
      if (
        proc[i].bt > 0 &&
        proc[i].priority < highestPriority &&
        proc[i].pid <= time
      ) {
        highestPriority = proc[i].priority;
        nextProcess = proc[i];
      }
    }

    if (nextProcess !== null) {
      if (currentProcess !== null && currentProcess.pid !== nextProcess.pid) {
        ganttChart.push({
          processId: currentProcess.pid,
          startTime: time,
          endTime: time,
        });
      }

      nextProcess.bt--;
      time++;

      if (nextProcess.bt === 0) {
        complete++;
        ganttChart.push({
          processId: nextProcess.pid,
          startTime: time - 1,
          endTime: time,
        });
      }

      currentProcess = nextProcess;
    } else {
      time++;
    }
  }

  return ganttChart;
}

function printGanttChart(ganttChart, processes) {
  let chart = "";
  let processOrder = "";
  let processTimes = [];
  let totalTime = 0;

  for (let i = 0; i < ganttChart.length; i++) {
    const process = ganttChart[i];
    processOrder += `P${process.processId} | `;
    processTimes.push(process.endTime);
  }

  // eslint-disable-next-line no-unused-vars
  totalTime = processTimes[processTimes.length - 1];

  chart += processOrder.slice(0, -3) + "\n";
  // chart += processTimes.join("   ");

  pColor("Gantt Chart:\n", BRIGHT_BLUE);
  console.log(chart);

  const waitingTimes = [];
  const turnaroundTimes = [];

  pColor("Processes\tBurst time\tWaiting time\tTurnaround time", GREEN);
  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];
    let waitingTime = 0;
    let turnaroundTime = 0;

    for (let j = 0; j < ganttChart.length; j++) {
      const chartProcess = ganttChart[j];
      if (chartProcess.processId === process.pid) {
        waitingTime = chartProcess.startTime;
        turnaroundTime = chartProcess.endTime;
        break;
      }
    }

    waitingTimes.push(waitingTime);
    turnaroundTimes.push(turnaroundTime);

    console.log(
      `P${process.pid}\t\t${process.bt}\t\t${waitingTime}\t\t${turnaroundTime}`
    );
  }

  const averageWaitingTime =
    waitingTimes.reduce((sum, time) => sum + time, 0) / waitingTimes.length;
  const averageTurnaroundTime =
    turnaroundTimes.reduce((sum, time) => sum + time, 0) /
    turnaroundTimes.length;

  console.log("\nAverage waiting time =", averageWaitingTime);
  console.log("Average turnaround time =", averageTurnaroundTime);
}

export default function runPreemptivePrioritySimulation(processes) {
  const ganttChart = simulatePreemptivePriority(processes);
  printGanttChart(ganttChart, processes);
}
