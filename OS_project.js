import readlineSync from "readline-sync";
import simulateRoundRobin from "./simulateRoundRobin.js";
import simulateSJF from "./simulateSJF.js";
import simulatePriority from "./simulatePriority.js";
import simulateFCFS from "./simulateFCFS.js";
import displayGanttChart from "./displayGanttChart.js";

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

// Function to display process details and CPU processing options
function displayOptions() {
  console.log("Choose a CPU Processing Type:");
  console.log("1. Round Robin (Quantum = 3) Preemptive");
  console.log("2. Non-preemptive Shortest Job First (SJF)");
  console.log("3. Preemptive Priority");
  console.log("4. Non-preemptive Priority");
  console.log("5. First-Come, First-Served (FCFS)");

  const option = parseInt(readlineSync.question("Enter your option: "));
  console.log();

  return option;
}

// Main program
function main() {
  const option = displayOptions();
  const numProcesses = parseInt(
    readlineSync.question("Enter the number of processes: ")
  );
  console.log();

  if (numProcesses < 3 || numProcesses > 10) {
    console.log("Invalid number of processes. Exiting...");
    return;
  }

  const processes = [];
  console.log("Enter the details for each process:");
  for (let i = 1; i <= numProcesses; i++) {
    console.log("Process " + i + ":");
    const burstTime = parseInt(readlineSync.question("Burst Time: "));
    const arrivalTime = parseInt(readlineSync.question("Arrival Time: "));
    const priority = parseInt(readlineSync.question("Priority: "));
    processes.push(new Process(i, arrivalTime, burstTime, priority));
    console.log();
  }

  let schedulingResult;
  switch (option) {
    case 1:
      // eslint-disable-next-line no-case-declarations
      const timeQuantum = 3;
      console.log("Round Robin with Quantum " + timeQuantum);
      schedulingResult = simulateRoundRobin(processes, timeQuantum);
      break;
    case 2:
      console.log("Non-preemptive Shortest Job First (SJF)");
      schedulingResult = simulateSJF(processes, false);
      break;
    case 3:
      console.log("Preemptive Priority");
      schedulingResult = simulatePriority(processes, true);
      break;
    case 4:
      console.log("Non-preemptive Priority");
      schedulingResult = simulatePriority(processes, false);
      break;
    case 5:
      console.log("First-Come, First-Served (FCFS)");
      schedulingResult = simulateFCFS(processes);
      break;
    default:
      console.log("Invalid option. Exiting...");
      return;
  }

  // Display process details
  console.log("| Process | Burst Time | Arrival Time | Priority |");
  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];
    console.log(
      `   P${process.processId}        ${process.burstTime}             ${process.arrivalTime}             ${process.priority}`
    );
  }
  console.log();

  // Display the Gantt chart
  displayGanttChart(schedulingResult.ganttChart);
  console.log();

  // Display waiting time for each process
  console.log("Waiting Time for each process:");
  for (let i = 0; i < processes.length; i++) {
    console.log(`P${i}: ${schedulingResult.waitingTime[i]}`);
  }
}

// Run the program
main();
