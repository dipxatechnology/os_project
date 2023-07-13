import calculateWaitingTime from "./calculateWaitingTime.js";

export default function simulateSJF(processes, preemptive) {
  const ganttChart = [];
  const completionTime = new Array(processes.length).fill(0);
  let currentTime = 0;
  let remainingProcesses = processes.length;

  while (remainingProcesses > 0) {
    let shortestJobIndex = -1;
    let shortestJobBurstTime = Infinity;

    for (let i = 0; i < processes.length; i++) {
      if (
        processes[i].arrivalTime <= currentTime &&
        processes[i].remainingTime > 0
      ) {
        if (preemptive) {
          if (processes[i].burstTime < shortestJobBurstTime) {
            shortestJobIndex = i;
            shortestJobBurstTime = processes[i].burstTime;
          }
        } else {
          if (
            processes[i].burstTime < shortestJobBurstTime &&
            processes[i].remainingTime > 0
          ) {
            shortestJobIndex = i;
            shortestJobBurstTime = processes[i].burstTime;
          }
        }
      }
    }

    if (shortestJobIndex === -1) {
      currentTime++;
      continue;
    }

    const currentProcess = processes[shortestJobIndex];
    const executionTime = currentProcess.remainingTime;

    for (let t = 0; t < executionTime; t++) {
      ganttChart.push(currentProcess.processId);
      currentTime++;
      currentProcess.remainingTime--;
    }

    completionTime[currentProcess.processId] = currentTime;
    remainingProcesses--;
  }

  const waitingTime = calculateWaitingTime(processes, completionTime);

  return {
    ganttChart,
    waitingTime,
  };
}
