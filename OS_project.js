import readlineSync from "readline-sync";
import simulateRoundRobin from "./simulateRoundRobin.js";
import simulateSJF from "./simulateSJF.js";
import simulatePriority from "./simulatePriority.js";
import simulateFCFS from "./simulateFCFS.js";

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
