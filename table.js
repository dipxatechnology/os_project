import Table from "cli-table3";
import readline from "readline";
import { FCFScheduler } from "./simulateFCFS.js";
import { PriorityScheduler } from "./simulatePriority.js";
import { PriorityScheduler_nonpram } from "./simulatePriority(non-pre).js";
import { RoundRobinScheduler } from "./simulateRoundRobin.js";
import { SJFScheduler_non_pre } from "./simulateSJF(non_pre).js";
import { SJFScheduler } from "./simulateSJF.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

  table.push(["Average", data.avgWt, data.avgTat, "", ""]);
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

  table.push(["Average", "", "", "", "", avg_wt, avg_tat]);

  return table.toString();
}

function FCFS() {
  class Process {
    constructor(id, arrivalTime, burstTime, priority) {
      this.id = id;
      this.arrivalTime = arrivalTime;
      this.burstTime = burstTime;
      this.priority = priority;
    }
  }

  function firstComeFirstServeScheduling() {
    const processes = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the number of processes: ", (numProcesses) => {
      numProcesses = parseInt(numProcesses);

      const getProcessDetails = (i) => {
        if (i === numProcesses) {
          rl.close();
          executeScheduling(processes);
        } else {
          const id = i + 1;

          rl.question(
            `\nEnter arrival time for process ${id}: `,
            (arrivalTime) => {
              arrivalTime = parseInt(arrivalTime);

              rl.question(
                `Enter burst time for process ${id}: `,
                (burstTime) => {
                  burstTime = parseInt(burstTime);

                  rl.question(
                    `Enter priority for process ${id}: `,
                    (priority) => {
                      priority = parseInt(priority);

                      processes.push(
                        new Process(id, arrivalTime, burstTime, priority)
                      );

                      getProcessDetails(i + 1);
                    }
                  );
                }
              );
            }
          );
        }
      };

      getProcessDetails(0);
    });
  }

  function executeScheduling(processes) {
    processes.sort((a, b) => {
      if (a.arrivalTime === b.arrivalTime) {
        return a.burstTime - b.burstTime;
      } else {
        return a.arrivalTime - b.arrivalTime;
      }
    });

    let currentTime = 0;
    let waitingTime = 0;

    let ganttChart = [];
    let tableData = [];

    processes.forEach((process) => {
      if (process.arrivalTime > currentTime) {
        currentTime = process.arrivalTime;
      }

      const startExecutionTime = currentTime;
      const endExecutionTime = currentTime + process.burstTime;
      const processWaitingTime = startExecutionTime - process.arrivalTime;

      ganttChart.push(`P${process.id}`);
      tableData.push({
        process: process.id,
        startTime: startExecutionTime,
        arrivalTime: process.arrivalTime,
        waitingTime: processWaitingTime,
      });

      currentTime = endExecutionTime;
      waitingTime += processWaitingTime;
    });

    const averageWaitingTime = waitingTime / processes.length;

    console.log("\nGantt Chart:");
    console.log("┌" + "─────┬".repeat(ganttChart.length - 1) + "─────┐");
    console.log("| " + ganttChart.join("  | ") + "  |");
    console.log("└" + "─────┴".repeat(ganttChart.length - 1) + "─────┘");
    console.log();

    console.log("\nWaiting Time Table:");
    console.log("| Process  | Start Time | Arrival Time | Waiting Time |");
    console.log("|----------|------------|--------------|--------------|");
    tableData.forEach((data) => {
      console.log(
        `| P${String(data.process).padEnd(7)} | ${String(data.startTime).padEnd(
          10
        )} | ${String(data.arrivalTime).padEnd(12)} | ${String(
          data.waitingTime
        ).padEnd(12)} |`
      );
    });
    console.log();

    console.log(`\n Average Waiting Time: ${averageWaitingTime} ms`);
  }

  firstComeFirstServeScheduling();
}

function createGanttChart(output) {
  const { wt, tat, stime, ctime } = output;
  let chart = "Gantt Chart:\n";
  chart += "--------------\n";
  chart += "| Process | Start | Finish |\n";
  chart += "--------------\n";

  for (let i = 0; i < wt.length; i++) {
    chart += `|    ${output.processes[i]}   |   ${stime[i]}   |   ${ctime[i]}   |\n`;
  }

  chart += "--------------\n";

  return chart;
}

function Priority() {
  rl.question("Enter the number of processes: ", (numProcesses) => {
    const processes = [];

    const processDetailsPrompt = (index) => {
      if (index < numProcesses) {
        rl.question(`Enter Arrival Time for P${index + 1}: `, (at) => {
          rl.question(`Enter Burst Time for P${index + 1}: `, (bt) => {
            rl.question(`Enter Priority for P${index + 1}: `, (pr) => {
              processes.push({
                at: Number(at),
                bt: Number(bt),
                pr: Number(pr),
                pno: index + 1,
              });
              processDetailsPrompt(index + 1);
            });
          });
        });
      } else {
        const scheduler = new PriorityScheduler(processes);
        const result = scheduler.calculateAverageTime();
        const tableString = createTable(result);
        console.log(tableString);
        rl.close();
      }
    };

    processDetailsPrompt(0);
  });
}

function Priority_non_prem() {
  class Process {
    constructor(id, burstTime, priority, arrivalTime) {
      this.id = id;
      this.burstTime = burstTime;
      this.priority = priority;
      this.arrivalTime = arrivalTime;
    }
  }
  
  function nonPreemptivePriorityScheduling() {
    const processes = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.question('Enter the number of processes: ', (numProcesses) => {
      numProcesses = parseInt(numProcesses);
  
      const getProcessDetails = (i) => {
        if (i === numProcesses) {
          rl.close();
          executeScheduling(processes);
        } else {
          const id = i + 1;
  
          rl.question(`\nEnter burst time for process ${id}: `, (burstTime) => {
            burstTime = parseInt(burstTime);
  
            rl.question(`Enter priority for process ${id}: `, (priority) => {
              priority = parseInt(priority);
  
              rl.question(`Enter arrival time for process ${id}: `, (arrivalTime) => {
                arrivalTime = parseInt(arrivalTime);
                processes.push(new Process(id, burstTime, priority, arrivalTime));
  
                getProcessDetails(i + 1);
              });
            });
          });
        }
      };
  
      getProcessDetails(0);
    });
  }
  
  function executeScheduling(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let waitingTime = 0;
  
    let ganttChart = [];
    let tableData = [];
  
    while (processes.length > 0) {
      let eligibleProcesses = processes.filter(process => process.arrivalTime <= currentTime);
      eligibleProcesses.sort((a, b) => a.priority - b.priority);
  
      if (eligibleProcesses.length === 0) {
        currentTime++;
        continue;
      }
  
      const process = eligibleProcesses[0];
  
      waitingTime += currentTime - process.arrivalTime;
      currentTime += process.burstTime;
  
      ganttChart.push({ process: process.id, startTime: currentTime - process.burstTime, endTime: currentTime });
      tableData.push({ process: process.id, startTime: currentTime - process.burstTime, arrivalTime: process.arrivalTime, waitingTime: currentTime - process.arrivalTime });
  
      processes.splice(processes.indexOf(process), 1);
    }
  
    const averageWaitingTime = waitingTime / tableData.length;
  
    console.log("\nGantt Chart:");
    console.log("┌" + "─────┬".repeat(ganttChart.length - 1) + "─────┐");
    console.log("| " + ganttChart.map(({ process }) => `P${process}`).join("  | ") + "  |");
    console.log("└" + "─────┴".repeat(ganttChart.length - 1) + "─────┘");
    console.log();
  
    console.log("\nWaiting Time Table:");
    console.log("| Process  | Start Time | Arrival Time | Waiting Time |");
    console.log("|----------|------------|--------------|--------------|");
    tableData.forEach(data => {
      console.log(`| P${String(data.process).padEnd(7)} | ${String(data.startTime).padEnd(10)} | ${String(data.arrivalTime).padEnd(12)} | ${String(data.waitingTime).padEnd(12)} |`);
    });
    console.log();
  
    console.log(`\nAverage Waiting Time: ${averageWaitingTime} ms`);
  }
  
  nonPreemptivePriorityScheduling();
}

function RR() {
  rl.question("Enter the number of processes: ", (numProcesses) => {
    const processes = [];
    const quantum = 0;

    const processDetailsPrompt = (index) => {
      if (index < numProcesses) {
        rl.question(`Enter Arrival Time for P${index + 1}: `, (at) => {
          rl.question(`Enter Burst Time for P${index + 1}: `, (bt) => {
            processes.push({ pos: index + 1, AT: Number(at), BT: Number(bt) });
            processDetailsPrompt(index + 1);
          });
        });
      } else {
        rl.question("Enter the time quantum: ", (q) => {
          const scheduler = new RoundRobinScheduler(Number(q));
          const result = scheduler.schedule(processes);
          const tableString = createTableRR(result);
          console.log(tableString);
          rl.close();
        });
      }
    };

    processDetailsPrompt(0);
  });
}

function SJFS() {
  rl.question("Enter the number of processes: ", (numProcesses) => {
    const arrivalTimes = [];
    const burstTimes = [];

    const processDetailsPrompt = (index) => {
      if (index < numProcesses) {
        rl.question(`Enter Arrival Time for P${index + 1}: `, (at) => {
          rl.question(`Enter Burst Time for P${index + 1}: `, (bt) => {
            arrivalTimes.push(Number(at));
            burstTimes.push(Number(bt));
            processDetailsPrompt(index + 1);
          });
        });
      } else {
        const scheduler = new SJFScheduler(arrivalTimes, burstTimes);
        const output = scheduler.schedule();
        const tableString = createTable(output);
        console.log(tableString);
        rl.close();
      }
    };

    processDetailsPrompt(0);
  });
}

function SJFS_non_pram() {
  rl.question("Enter the number of processes: ", (numProcesses) => {
    const processes = [];

    const processDetailsPrompt = (index) => {
      if (index < numProcesses) {
        rl.question(`Enter Arrival Time for P${index + 1}: `, (at) => {
          rl.question(`Enter Burst Time for P${index + 1}: `, (bt) => {
            processes.push({ id: index + 1, at: Number(at), bt: Number(bt) });
            processDetailsPrompt(index + 1);
          });
        });
      } else {
        const scheduler = new SJFScheduler_non_pre(processes);
        const output = scheduler.schedule();
        const tableString = createTable(output);
        console.log(tableString);
        rl.close();
      }
    };

    processDetailsPrompt(0);
  });
}

// Prompt the user for the scheduling algorithm choice
rl.question(
  "Enter the scheduling algorithm (FCFS, Priority, Priority_non_prem, RR, SJFS, SJFS_non_pram): ",
  (algorithm) => {
    if (algorithm === "FCFS") {
      FCFS();
    } else if (algorithm === "Priority") {
      Priority();
    } else if (algorithm === "Priority_non_prem") {
      Priority_non_prem();
    } else if (algorithm === "RR") {
      RR();
    } else if (algorithm === "SJFS") {
      SJFS();
    } else if (algorithm === "SJFS_non_pram") {
      SJFS_non_pram();
    } else {
      console.log("Invalid scheduling algorithm choice.");
      rl.close();
    }
  }
);
