import runPreemptivePrioritySimulation from "./simulatePriority.js";
import simulateRoundRobin from "./simulateRoundRobin.js";
import simulateFCFS from "./simulateFCFS.js";
import calculateSJF from "./simulateSJF.js";

import { Process_non_pre, findavgTime } from "./simulateSJF(non_pre).js";
import simulatePriority_non_pre from "./simulatePriority(non-pre).js";
import { BOLD, line, pColor } from "./ConsoleUtils.js";

// Main program
function main() {
  line();
  pColor("Non-preemptive Priority", BOLD);
  runPriority_non_pre();
  line();
  pColor("Preemptive Priority", BOLD);
  runPreemptivePriority();
  line();
  pColor("Round Robin (Quantum = 3) Preemptive", BOLD);
  runRoundRobin();
  line();
  pColor("First-Come, First-Served (FCFS)", BOLD);
  runFCFS();
  line();
  pColor("Shortest Job First (SJF)", BOLD);
  runSFJ();
  line();
  pColor("Non-preemptive Shortest Job First (SJF)", BOLD);
  runSFJ_non_pre();
}

main();

function runPriority_non_pre() {
  const totalprocess = 5;
  const proc = [];

  const arrivaltime = [1, 2, 3, 4, 5];
  const bursttime = [3, 5, 1, 7, 4];
  const priority = [3, 4, 1, 7, 8];

  for (let i = 0; i < totalprocess; i++) {
    proc.push([arrivaltime[i], bursttime[i], priority[i], i + 1]);
  }

  proc.sort((a, b) => {
    if (a[2] === b[2]) {
      return a[0] - b[0];
    } else {
      return a[2] - b[2];
    }
  });

  simulatePriority_non_pre(proc);
}

function runRoundRobin() {
  const processes = [1, 2, 3];
  const n = processes.length;
  const burstTime = [10, 5, 8];
  const timeQuantum = 2;

  simulateRoundRobin(processes, n, burstTime, timeQuantum);
}

function runFCFS() {
  let processes = [1, 2, 3];
  let burst_time = [10, 5, 8];
  let n = processes.length;

  simulateFCFS(processes, n, burst_time);
}

function runSFJ() {
  let n = 5;
  let A = [];
  let total = 0;
  const burstTimes = [3, 5, 1, 7, 4];
  calculateSJF(n, A, total, burstTimes);
}
function runPreemptivePriority() {
  const processes = [
    { pid: 1, bt: 5, priority: 2 },
    { pid: 2, bt: 3, priority: 1 },
    { pid: 3, bt: 8, priority: 4 },
    { pid: 4, bt: 2, priority: 3 },
  ];

  runPreemptivePrioritySimulation(processes);
}

function runSFJ_non_pre() {
  const proc = [
    new Process_non_pre(1, 6, 1),
    new Process_non_pre(2, 8, 1),
    new Process_non_pre(3, 7, 2),
    new Process_non_pre(4, 3, 3),
  ];

  findavgTime(proc, proc.length);
}
