import calculateWaitingTime from "./calculateWaitingTime.js";
import displayGanttChart from "./displayGanttChart.js";

export default function simulateFCFS(processes) {
  const ganttChart = [];
  const completionTime = new Array(processes.length).fill(0);
  let currentTime = 0;
  let remainingProcesses = processes.length;

  for (let i = 0; i < processes.length; i++) {
    if (processes[i].arrivalTime > currentTime) {
      currentTime = processes[i].arrivalTime;
    }

    for (let t = 0; t < processes[i].burstTime; t++) {
      ganttChart.push(processes[i].processId);
      currentTime++;
    }

    completionTime[processes[i].processId] = currentTime;
    // eslint-disable-next-line no-unused-vars
    remainingProcesses--;
  }

  displayGanttChart(ganttChart);
  const waitingTime = calculateWaitingTime(processes, completionTime);

  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log("P" + i + ": " + waitingTime[i]);
  }
}
