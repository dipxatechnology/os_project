export class RoundRobinScheduler {
  constructor(quantum) {
    this.quantum = quantum;
  }

  roundOff(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  schedule(processes) {
    const n = processes.length;
    const s = new Array(n).fill().map(() => new Array(20).fill(-1));
    const b = new Array(n);
    const a = new Array(n);
    const p = new Array(n);

    let c = n;
    let time = 0;
    let mini = Infinity;
    let index = -1;
    let tot_wt = 0;
    let tot_tat = 0;
    let flag = false;

    for (let i = 0; i < n; i++) {
      b[i] = processes[i].BT;
      a[i] = processes[i].AT;
      p[i] = {
        ...processes[i],
        ST: new Array(20).fill(0),
        FT: 0,
        TAT: 0,
        WT: 0,
      };
    }

    while (c !== 0) {
      mini = Infinity;
      flag = false;

      for (let i = 0; i < n; i++) {
        const pTime = time + 0.1;
        if (a[i] <= pTime && mini > a[i] && b[i] > 0) {
          index = i;
          mini = a[i];
          flag = true;
        }
      }

      if (!flag) {
        time++;
        continue;
      }

      let j = 0;
      while (s[index][j] !== -1) {
        j++;
      }

      if (s[index][j] === -1) {
        s[index][j] = time;
        p[index].ST[j] = time;
      }

      if (b[index] <= this.quantum) {
        time += b[index];
        b[index] = 0;
      } else {
        time += this.quantum;
        b[index] -= this.quantum;
      }

      if (b[index] > 0) {
        a[index] = time + 0.1;
      }

      if (b[index] === 0) {
        c--;
        p[index].FT = time;
        p[index].WT = p[index].FT - p[index].AT - p[index].BT;
        tot_wt += p[index].WT;
        p[index].TAT = p[index].BT + p[index].WT;
        tot_tat += p[index].TAT;
      }
    }

    const result = {
      processes: [],
      avg_wt: 0,
      avg_tat: 0,
    };

    for (let i = 0; i < n; i++) {
      result.processes.push({
        pos: p[i].pos,
        AT: p[i].AT,
        BT: p[i].BT,
        ST: p[i].ST.slice(0, p[i].ST.indexOf(-1)),
        FT: p[i].FT,
        WT: p[i].WT,
        TAT: p[i].TAT,
      });
    }

    result.avg_wt = this.roundOff(tot_wt / n);
    result.avg_tat = this.roundOff(tot_tat / n);

    return result;
  }
}

// Example usage
