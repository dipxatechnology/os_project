export default function displayGanttChart(ganttChart) {
  console.log("Gantt Chart:");
  let chart = "| ";
  for (let i = 0; i < ganttChart.length; i++) {
    chart += `P${ganttChart[i]} | `;
  }
  console.log(chart);
}
