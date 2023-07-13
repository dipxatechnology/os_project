import calculateWaitingTime from "./calculateWaitingTime.js";

export default function simulateRoundRobin(processes, timeQuantum) {
  const readyQueue = [];
  const ganttChart = [];
  const completionTime = new Array(processes.length).fill(0);
  let currentTime = 0;
  let remainingProcesses = processes.length;

  while (remainingProcesses > 0) {
    for (let i = 0; i < processes.length; i++) {
      if (
        processes[i].arrivalTime <= currentTime &&
        processes[i].remainingTime > 0
      ) {
        readyQueue.push(processes[i]);
      }
    }

    if (readyQueue.length === 0) {
      currentTime++;
      continue;
    }

    const currentProcess = readyQueue.shift();
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);

    for (let t = 0; t < executionTime; t++) {
      ganttChart.push(currentProcess.processId);
      currentTime++;
      currentProcess.remainingTime--;
    }

    if (currentProcess.remainingTime > 0) {
      readyQueue.push(currentProcess);
    } else {
      completionTime[currentProcess.processId] = currentTime;
      remainingProcesses--;
    }
  }

  const waitingTime = calculateWaitingTime(processes, completionTime);

  return {
    ganttChart,
    waitingTime,
  };
}
