export default function displayGanttChart(ganttChart) {
  console.log("Gantt Chart:");
  for (let i = 0; i < ganttChart.length; i++) {
    console.log("| P" + ganttChart[i] + " ");
  }
  console.log("|");
}
