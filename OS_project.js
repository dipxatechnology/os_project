const readlineSync = require("readline-sync");

// Structure to represent a process
class Process {
  constructor(processId, arrivalTime, burstTime, priority) {
    this.processId = processId;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.priority = priority;
    this.remainingTime = burstTime;
  }
}

// Function to calculate waiting time for each process
function calculateWaitingTime(processes, completionTime) {
  const waitingTime = [];
  for (let i = 0; i < processes.length; i++) {
    waitingTime[i] =
      completionTime[i] - processes[i].arrivalTime - processes[i].burstTime;
  }
  return waitingTime;
}

// Function to display the Gantt chart for a scheduling algorithm
function displayGanttChart(ganttChart) {
  console.log("Gantt Chart:");
  for (let i = 0; i < ganttChart.length; i++) {
    console.log("| P" + ganttChart[i] + " ");
  }
  console.log("|");
}

// Function to simulate the Round Robin scheduling algorithm
function simulateRoundRobin(processes, timeQuantum) {
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

  displayGanttChart(ganttChart);
  const waitingTime = calculateWaitingTime(processes, completionTime);

  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log("P" + i + ": " + waitingTime[i]);
  }
}

// Function to simulate the Shortest Job First (SJF) scheduling algorithm (preemptive and non-preemptive)
function simulateSJF(processes, preemptive) {
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

  displayGanttChart(ganttChart);
  const waitingTime = calculateWaitingTime(processes, completionTime);

  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log("P" + i + ": " + waitingTime[i]);
  }
}

// Function to simulate the Priority scheduling algorithm (preemptive and non-preemptive)
function simulatePriority(processes, preemptive) {
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

// Function to simulate the First-Come, First-Served (FCFS) scheduling algorithm
function simulateFCFS(processes) {
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
    remainingProcesses--;
  }

  displayGanttChart(ganttChart);
  const waitingTime = calculateWaitingTime(processes, completionTime);

  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log("P" + i + ": " + waitingTime[i]);
  }
}

// Main program
function main() {
  const numProcesses = parseInt(
    readlineSync.question("Enter the number of processes (3 to 10): ")
  );

  if (numProcesses < 3 || numProcesses > 10) {
    console.log("Invalid number of processes. Exiting...");
    return;
  }

  const processes = [];
  console.log("Enter the details for each process:");
  for (let i = 0; i < numProcesses; i++) {
    console.log("Process " + i + ":");
    const arrivalTime = parseInt(readlineSync.question("Arrival Time: "));
    const burstTime = parseInt(readlineSync.question("Burst Time: "));
    const priority = parseInt(readlineSync.question("Priority: "));
    processes.push(new Process(i, arrivalTime, burstTime, priority));
    console.log();
  }

  const timeQuantum = parseInt(
    readlineSync.question("Enter the time quantum for Round Robin: ")
  );

  console.log("\nRound Robin with Quantum " + timeQuantum);
  simulateRoundRobin(processes, timeQuantum);

  console.log("\nPreemptive Shortest Job First (SJF)");
  simulateSJF(processes, true);

  console.log("\nNon-Preemptive Shortest Job First (SJF)");
  simulateSJF(processes, false);

  console.log("\nPreemptive Priority");
  simulatePriority(processes, true);

  console.log("\nNon-Preemptive Priority");
  simulatePriority(processes, false);

  console.log("\nFirst-Come, First-Served (FCFS)");
  simulateFCFS(processes);
}

// Run the program
main();
