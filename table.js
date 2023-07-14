import Table from "cli-table3";
import { FCFScheduler } from "./simulateFCFS.js";
import { PriorityScheduler } from "./simulatePriority.js";
import { PriorityScheduler_nonpram } from "./simulatePriority(non-pre).js";
import { RoundRobinScheduler } from "./simulateRoundRobin.js";

function createTable(data) {
  const table = new Table({
    head: [
      "Process",
      "Waiting Time",
      "Turnaround time",
      "Start Time",
      "Completion Time",
    ],
  });

  const { wt, tat, stime, ctime } = data;
  for (let i = 0; i < wt.length; i++) {
    table.push([`P${i + 1}`, wt[i], tat[i], stime[i], ctime[i]]);
  }

  return table.toString();
}
function createTableRR(data) {
  const table = new Table({
    head: ["Process", "AT", "BT", "ST", "FT", "WT", "TAT"],
  });

  const { processes, avg_wt, avg_tat } = data;
  for (const process of processes) {
    table.push([
      process.pos,
      process.AT,
      process.BT,
      process.ST.join(", "),
      process.FT,
      process.WT,
      process.TAT,
    ]);
  }

  table.push([]);
  table.push(["Average", "", "", "", "", avg_wt, avg_tat]);

  return table.toString();
}
function FCFS() {
  const processes = [1, 2, 3];
  const arrivalTimes = [0, 1, 2];
  const burstTimes = [1, 2, 3];
  const scheduler = new FCFScheduler(processes, arrivalTimes, burstTimes);
  const output = scheduler.findAverageTime();

  const tableString = createTable(output);
  console.log(tableString);
}
FCFS();
function Priority() {
  const processes = [
    { at: 1, bt: 3, pr: 3, pno: 1 },
    { at: 2, bt: 5, pr: 4, pno: 2 },
    { at: 3, bt: 1, pr: 1, pno: 3 },
    { at: 4, bt: 7, pr: 7, pno: 4 },
    { at: 5, bt: 4, pr: 8, pno: 5 },
  ];

  const scheduler = new PriorityScheduler(processes);
  const result = scheduler.calculateAverageTime();

  const tableString = createTable(result);
  console.log(tableString);
}
Priority();
function Priority_non_prem() {
  const arrivalTime = [1, 2, 3, 4, 5];
  const burstTime = [6, 7, 8, 9, 10];
  const priority = [1, 2, 3, 4, 5];

  const scheduler = new PriorityScheduler_nonpram(
    arrivalTime,
    burstTime,
    priority
  );
  const output = scheduler.findGanttChart();

  const tableString = createTable(output);
  console.log(tableString);
}
Priority_non_prem();

function RR() {
  const processes = [
    { pos: 1, AT: 0, BT: 4 },
    { pos: 2, AT: 1, BT: 5 },
    { pos: 3, AT: 2, BT: 6 },
    { pos: 4, AT: 3, BT: 7 },
    { pos: 5, AT: 4, BT: 8 },
  ];
  const quantum = 2;

  const scheduler = new RoundRobinScheduler(quantum);
  const result = scheduler.schedule(processes);
  const tableString = createTableRR(result);
  console.log(tableString);
}
RR();
