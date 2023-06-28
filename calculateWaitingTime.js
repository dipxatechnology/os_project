export default function calculateWaitingTime(processes, completionTime) {
  const waitingTime = [];
  for (let i = 0; i < processes.length; i++) {
    waitingTime[i] =
      completionTime[i] - processes[i].arrivalTime - processes[i].burstTime;
  }
  return waitingTime;
}
