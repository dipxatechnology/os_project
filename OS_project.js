import runPreemptivePrioritySimulation from "./simulatePriority.js";
import { simulateRoundRobin } from "./simulateRoundRobin.js";
import simulateFCFS from "./simulateFCFS.js";
import calculateAverageTimesSJf from "./simulateSJF.js";

import { Process_non_pre, findavgTime } from "./simulateSJF(non_pre).js";
import simulatePriority_non_pre from "./simulatePriority(non-pre).js";
import { BOLD, BRIGHT_BLUE, YELLOW, line, pColor } from "./ConsoleUtils.js";

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main program
function main() {
  line();
  pColor("Scheduling Algorithm Simulator", BOLD);
  line();
  pColor("1. Non-preemptive Priority", BRIGHT_BLUE);
  pColor("2. Preemptive Priority", BRIGHT_BLUE);
  pColor("3. Round Robin (Quantum = 3) Preemptive", BRIGHT_BLUE);
  pColor("4. First-Come, First-Served (FCFS)", BRIGHT_BLUE);
  pColor("5. Shortest Job First (SJF)", BRIGHT_BLUE);
  pColor("6. Non-preemptive Shortest Job First (SJF)", BRIGHT_BLUE);
  pColor("0. Exit", BRIGHT_BLUE);

  rl.question("Enter your choice: ", (option) => {
    switch (parseInt(option)) {
      case 1:
        line();
        pColor("Non-preemptive Priority", BOLD);
        runPriority_non_pre();
        break;
      case 2:
        line();
        pColor("Preemptive Priority", BOLD);
        runPreemptivePriority();
        break;
      case 3:
        line();
        pColor("Round Robin (Quantum = 3) Preemptive", BOLD);
        runRoundRobin();
        break;
      case 4:
        line();
        pColor("First-Come, First-Served (FCFS)", BOLD);
        runFCFS();
        break;
      case 5:
        line();
        pColor("Shortest Job First (SJF)", BOLD);
        runSJF();
        break;
      case 6:
        line();
        pColor("Non-preemptive Shortest Job First (SJF)", BOLD);
        runSFJ_non_pre();
        break;
      case 0:
        console.log("Exiting...");
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        main();
        break;
    }
  });
}
main();

function runPriority_non_pre() {
  let totalprocess;
  const proc = [];

  const arrivaltime = [];
  const bursttime = [];
  const priority = [];

  function getInput() {
    rl.question("Enter the number of processes: ", (input) => {
      totalprocess = parseInt(input);
      let count = 1;
      function getProcessData() {
        rl.question(`Enter arrival time for process ${count}: `, (input) => {
          arrivaltime.push(parseInt(input));
          rl.question(`Enter burst time for process ${count}: `, (input) => {
            bursttime.push(parseInt(input));
            rl.question(`Enter priority for process ${count}: `, (input) => {
              priority.push(parseInt(input));
              if (count === totalprocess) {
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
              } else {
                count++;
                getProcessData();
              }
            });
          });
        });
      }

      getProcessData();
    });
  }

  getInput();
}

function runRoundRobin() {
  const processes = [];
  const burstTime = [];
  let timeQuantum;

  function getInput() {
    rl.question("Enter time quantum for Round Robin: ", (input) => {
      timeQuantum = parseInt(input);
      rl.question(
        "Enter the number of processes for Round Robin: ",
        (input) => {
          const n = parseInt(input);
          let count = 1;
          function getBurstTime() {
            rl.question(`Enter burst time for process ${count}: `, (input) => {
              burstTime.push(parseInt(input));
              processes.push(count);
              if (count === n) {
                simulateRoundRobin(processes, n, burstTime, timeQuantum);
              } else {
                count++;
                getBurstTime();
              }
            });
          }

          getBurstTime();
        }
      );
    });
  }

  getInput();
}

function runFCFS() {
  const processes = [];
  const burst_time = [];

  function getInput() {
    rl.question("Enter the number of processes for FCFS: ", (input) => {
      const n = parseInt(input);
      let count = 1;
      function getBurstTime() {
        rl.question(`Enter burst time for process ${count}: `, (input) => {
          burst_time.push(parseInt(input));
          processes.push(count);
          if (count === n) {
            simulateFCFS(processes, n, burst_time);
          } else {
            count++;
            getBurstTime();
          }
        });
      }

      getBurstTime();
    });
  }

  getInput();
}

function runSJF() {
  const burstTimes = [];

  function getInput() {
    rl.question("Enter the number of processes for SJF: ", (input) => {
      const n = parseInt(input);
      let count = 1;
      function getBurstTime() {
        rl.question(`Enter burst time for process ${count}: `, (input) => {
          burstTimes.push(parseInt(input));
          if (count === n) {
            const result = calculateAverageTimesSJf(n, burstTimes);
            for (let i = 0; i < result.length; i++) {
              let row = result[i].map((item) =>
                item.toString().padEnd(20, " ")
              );
              console.log(row.join(""));
            }
          } else {
            count++;
            getBurstTime();
          }
        });
      }

      getBurstTime();
    });
  }

  getInput();
}

function runPreemptivePriority() {
  const processes = [];

  function getInput() {
    rl.question(
      "Enter the number of processes for Preemptive Priority: ",
      (input) => {
        const n = parseInt(input);
        let count = 1;
        function getProcessData() {
          rl.question(`Enter burst time for process ${count}: `, (input) => {
            const bt = parseInt(input);
            rl.question(`Enter priority for process ${count}: `, (input) => {
              const priority = parseInt(input);
              processes.push({ pid: count, bt, priority });
              if (count === n) {
                runPreemptivePrioritySimulation(processes);
              } else {
                count++;
                getProcessData();
              }
            });
          });
        }

        getProcessData();
      }
    );
  }

  getInput();
}

function runSFJ_non_pre() {
  const proc = [];

  function getInput() {
    rl.question(
      "Enter the number of processes for Non-preemptive SJF: ",
      (input) => {
        const n = parseInt(input);
        let count = 1;
        function getProcessData() {
          rl.question(`Enter burst time for process ${count}: `, (input) => {
            const burstTime = parseInt(input);
            rl.question(`Enter priority for process ${count}: `, (input) => {
              const priority = parseInt(input);
              proc.push(new Process_non_pre(count, burstTime, priority));
              if (count === n) {
                findavgTime(proc, proc.length);
              } else {
                count++;
                getProcessData();
              }
            });
          });
        }

        getProcessData();
      }
    );
  }

  getInput();
}
