import calculateWaitingTime from "./calculateWaitingTime.js";
import displayGanttChart from "./displayGanttChart.js";

export default function simulatePriority(processes, preemptive) {
  const ganttChart = [];
  const completionTime = new Array(processes.length).fill(0);
  let currentTime = 0;
  let remainingProcesses = processes.length;

  while (remainingProcesses > 0) {
    let highestPriorityIndex = -1;
    let highestPriority = Infinity;

    for (let i = 0; i < processes.length; i++) {
      if (
        processes[i].arrivalTime <= currentTime &&
        processes[i].remainingTime > 0
      ) {
        if (preemptive) {
          if (processes[i].priority < highestPriority) {
            highestPriorityIndex = i;
            highestPriority = processes[i].priority;
          }
        } else {
          if (
            processes[i].priority < highestPriority &&
            processes[i].remainingTime > 0
          ) {
            highestPriorityIndex = i;
            highestPriority = processes[i].priority;
          }
        }
      }
    }

    if (highestPriorityIndex === -1) {
      currentTime++;
      continue;
    }

    const currentProcess = processes[highestPriorityIndex];
    const executionTime = currentProcess.remainingTime;

    for (let t = 0; t < executionTime; t++) {
      ganttChart.push(currentProcess.processId);
      currentTime++;
      currentProcess.remainingTime--;
    }

    completionTime[currentProcess.processId] = currentTime;
    remainingProcesses--;
  }

  displayGanttChart(ganttChart);
  const waitingTime = calculateWaitingTime(processes, completionTime);

  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log("P" + i + ": " + waitingTime[i]);
  }
}
