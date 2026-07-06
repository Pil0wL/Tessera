
import { generateUI_ActiveTickets, prompt_RetrieveNewTitleAndDescription, display_Progress, prompt_Confirmation, officiate_dropdown, filter_givenTickets, displayTicketDescription, officiate_chart } from "../.././local_modules/ui related.js";
import { getAllMyActiveTickets, getTicketHistory, getMyStatistics } from "../.././local_modules/aws main.js";
import { fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";


{ // your history
  const target_container = document.getElementById("smart-ticket-my-history");




  const series_active = []
  const series_historical = []
  const targetYear = 2026;
  const barOptions = {
    title: {
      text: `My Ticket Frequency for ${String(targetYear)}`, // Your title text
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
    },
    chart: {
      type: "bar",
      height: 300
    },
    series: [{
      name: "Active",
      data: series_active
    }, {
      name: "Historical",
      data: series_historical
    }],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    colors: ["#3498db", "#556169"]
  };
  async function refresh() {

    const ActiveTickets = await getAllMyActiveTickets();
    const HistoricalTickets = await getTicketHistory();

    series_active.length = 0;
    series_historical.length = 0;
    series_active.length = 12;
    series_historical.length = 12;

    for (const indexedActive of ActiveTickets) {
      const dateObj = new Date(indexedActive.timestamp);
      if (dateObj.getFullYear() != targetYear) continue;

      const thisMonth = dateObj.getMonth();
      series_active[thisMonth] = series_active[thisMonth] ? series_active[thisMonth] + 1 : 1
    }
    for (const indexedHistorical of HistoricalTickets) {
      const dateObj = new Date(indexedHistorical.timestamp);
      if (dateObj.getFullYear() != targetYear) continue;

      const thisMonth = dateObj.getMonth();
      series_historical[thisMonth] = series_historical[thisMonth] ? series_historical[thisMonth] + 1 : 1
    }
  }

  officiate_chart(target_container, barOptions, refresh)



}

{ // category submitted In
  const target_container = document.getElementById("smart-ticket-my-categories");




  const series_categorical = [];
  const labels = [];
  const chartOptions = {
    title: {
      text: "Category Submitted-In Distribution",
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
    },
    chart: {
      type: "pie",
      height: 300
    },
    series: series_categorical,
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.series[opts.seriesIndex];
      }
    },
    //colors: ["#3498db", "#556169"]
  };
  async function refresh() {

    const myStatistics = await getMyStatistics();
    console.log(myStatistics);

    series_categorical.length = 0;
    labels.length = 0;

    for (const categoryName in myStatistics.CategoryDistribution) {
      series_categorical.push(myStatistics.CategoryDistribution[categoryName]);
      labels.push(categoryName);
    }
  }

  officiate_chart(target_container, chartOptions, refresh);



}


{ // heatmap
  const target_container = document.getElementById("smart-ticket-daily-logins");

  const targetYear = 2026;
  const monthWeeks = {
    1: "Jan", 5: "Feb", 9: "Mar", 14: "Apr", 18: "May", 22: "Jun",
    27: "Jul", 31: "Aug", 36: "Sep", 40: "Oct", 44: "Nov", 49: "Dec"
  };

  function getXLabel(i) {
    return String(i + 1);
  }

  const generate_labels = 53;
  const label_category = [];
  label_category.length = generate_labels;
  for (let i = 0; i < generate_labels; i++) {
    label_category[i] = getXLabel(i);
  }

  const series_heatmap = [];

  for (const DayOfWeek of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
    const thisData = [];
    thisData.length = generate_labels;

    const creating = {
      name: DayOfWeek,
      data: thisData
    };
    for (let i = 0; i < generate_labels; i++) {
      thisData[i] = {
        x: getXLabel(i),
        y: 0
      }
    }
    series_heatmap.push(creating);
  }

  const chartOptions = {
    title: {
      text: "Login Activity Tracker",
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
    },
    chart: {
      type: "heatmap",
      height: 400
    },

    series: series_heatmap,
    plotOptions: {
      heatmap: {
        radius: 2,
        enableShades: false, // Disables automatic gradient shading based on value
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              name: "No Login",
              color: "#e6e8ea"
            },
            {
              from: 1,
              to: 1,
              name: "Logged In",
              color: "#2ecc71"
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: "category",
      categories: label_category,
      labels: {
        show: true,
        formatter: function (weekNum) {
          return monthWeeks[weekNum] ? monthWeeks[weekNum] : "";
        }
      }
    },
    stroke: {
      width: 3,
      colors: ["#fff"]
    },

    tooltip: {
      shared: false, // Ensures the tooltip only shows data for the single square hovered
      intersect: true,

      x: {
        show: true,
        // top header text of the default tooltip box
        formatter: function (val, opts) {
          const seriesIndex = opts.seriesIndex; // The Day Row (0 - 6)
          const dataPointIndex = opts.dataPointIndex; // The Week Column (0 - 52)

          const janFirst = new Date(targetYear, 0, 1);
          const janFirstDayOfWeek = janFirst.getDay();
          const daysOffset = (dataPointIndex * 7) + seriesIndex - janFirstDayOfWeek;
          const actualDate = new Date(targetYear, 0, 1 + daysOffset);

          return actualDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
          });
        }
      },
      y: {
        title: {
          formatter: function (seriesName) {
            // Changes the label text next to the value indicator color dot
            return "Status:";
          }
        },

        formatter: function (value) {
          // Converts 1 or 0 into descriptive text
          return value === 1 ? "Logged In" : "No activity";
        }
      }
    }
  };


  const janFirst = new Date(targetYear, 0, 1);
  const janFirstDayOfWeek = janFirst.getDay();
  async function refresh() {

    for (const miniSeries of series_heatmap) {
      const thisData = miniSeries.data;
      for (const miniData of thisData) {
        miniData.y = 0;
      }
    }

    const myStatistics = await getMyStatistics();

    const currentDictionary = {};

    for (const loginDate in myStatistics.Logins) {
      const createdDate = new Date(loginDate);

      const year = createdDate.getFullYear()
      if (year !== targetYear) continue;

      const month = createdDate.getMonth();
      const string_Month = String(month);


      const diffInMs = createdDate - janFirst;
      const dayOfYear = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      const dayOfWeek = createdDate.getDay();
      const weekIndex = Math.floor((dayOfYear + janFirstDayOfWeek - 1) / 7);

      if (series_heatmap[dayOfWeek] && series_heatmap[dayOfWeek].data[weekIndex]) {
        series_heatmap[dayOfWeek].data[weekIndex].y = 1;
      }
    }

  }

  officiate_chart(target_container, chartOptions, refresh)


}


{ // satisfaction rating
  const target_container = document.getElementById("smart-ticket-satisfaction-rating");




  const series_satisfaction = [1, 1, 1, 1, 1];
  const chartOptions = {
    title: {
      text: "My Satisfaction Distribution",
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
    },
    chart: {
      type: "pie",
      height: 300
    },
    series: series_satisfaction,
    labels: ["Very Bad", "Bad", "Neutral", "Good", "Very Good"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.series[opts.seriesIndex];
      }
    },
    colors: [
      "#e74c3c",
      "#ed8936",
      "#a0aec0",
      "#48bb78",
      "#28a745"
    ]
  };
  async function refresh() {

    const myStatistics = await getMyStatistics();
    console.log(myStatistics);
    series_satisfaction.length = 0;
    series_satisfaction.length = 5;

    if (!myStatistics.SatistfactionDistribution) return;
    for (let i = 0; i < 5; i++) {
      series_satisfaction[i] = myStatistics.SatistfactionDistribution[i];
    }
  }

  officiate_chart(target_container, chartOptions, refresh);



}