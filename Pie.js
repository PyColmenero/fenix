const ctx = document.getElementById('myChart');

var randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
function updateP() {
    // if(currentData)
    sum = currentData.reduce((a, b) => a + b.time, 0);
    percentages = currentData.map(i => (i.time === 0) ? 0 : Math.round(100 / (sum / i.time)));
}


let sum = undefined;
let percentages = undefined;
let currentData = undefined;
let bgColors = undefined;

function getChartData(ndata) {
    // console.log(ndata);
    currentData = ndata.filter(i => i.time > 1000)
    updateP();
    if (last_data_len !== ndata.length || bgColors === undefined) {
        bgColors = currentData.map(_ => randomColor());
    }
    const labels = currentData.map(i => i.name);
    const datas = currentData.map(i => i.time);
    return {
        datasets: [
            {
                data: datas,
                backgroundColor: bgColors,
            },
        ],
        labels: labels,
    }
}

function updateChart(d) {
    chart.data = getChartData(d);
    chart.update();
}

let chart = undefined;

function initChar(data) {
    chart = new Chart(ctx, {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: getChartData(data),
        options: {
            plugins: {
                datalabels: {
                    anchor: 'center',
                    color: 'whitesmoke',
                    // labels: {
                    //     title: {
                    //         font: {
                    //             weight: 'bold'
                    //         }
                    //     },
                    //     value: {
                    //         color: 'green'
                    //     }
                    // },
                    formatter: function (_, context) {
                        return context.chart.data.labels[context.dataIndex] + " " + percentages[context.dataIndex] + "%";
                    }
                }
            },
            animation: {
                duration: 0, // general animation time
            }
        }
    });
}
// new Chart(ctx, {
//     type: 'doughnut',
//     plugins: [ChartDataLabels],
//     data: {
//         datasets: [
//             {
//                 data: [10, 20, 15, 5, 50],
//                 backgroundColor: [
//                     'rgb(255, 99, 132)',
//                     'rgb(255, 159, 64)',
//                     'rgb(255, 205, 86)',
//                     'rgb(75, 192, 192)',
//                     'rgb(54, 162, 235)',
//                 ],
//             },
//         ],
//         labels: ['Red', 'Orangre', 'Yellow', 'Green', 'Blue'],
//     },
//     options: {
//         plugins: {
//             datalabels: {
//                 color: 'blue',
//                 labels: {
//                     title: {
//                         font: {
//                             weight: 'bold'
//                         }
//                     },
//                     value: {
//                         color: 'green'
//                     }
//                 },
//                 formatter: function (_, context) {
//                     return context.chart.data.labels[context.dataIndex];
//                 }
//             }
//         }
//     }
// });

// new Chart(ctx, {
//     type: 'pie',
//     plugins: [ChartDataLabels],
//     data: {
//         labels: labels,
//         datasets: [{
//             label: 'My First Dataset',
//             data: datas,
//             backgroundColor: bgColors,
//             hoverOffset: 4
//         }]
//     },
//     options: {
//         plugins: {
//             datalabels: {
//                 color: 'whitesmoke',
//                 labels: {
//                     title: {
//                         font: {
//                             weight: 'bold'
//                         }
//                     },
//                     value: {
//                         color: 'green'
//                     }
//                 },
//                 // formatter: function (_, context) {
//                 //     return context.chart.data.labels[context.dataIndex];
//                 // }

//             }
//         }
//     }
// });
