<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export default {
  name: "DoughnutChart",
  // props: {
  //   title: {
  //     type: String,
  //     default: "Doughnut Chart"
  //   },
  //   legendData: {
  //     type: Array,
  //     default: () => []
  //   },
  //   data: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      option: {
        // backgroundColor: 'transparent',
        title: {
          text: 'Title should go here',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "School",
            "Social",
            "Eating",
            "Netflix",
            "Sleep"
          ]
        },
        series: [
          {
            name: "Traffic Sources",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "School" },
              { value: 310, name: "Social" },
              { value: 234, name: "Eating" },
              { value: 135, name: "Netflix" },
              { value: 1548, name: "Sleep" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              }
            }
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
.chart {
  height: 400px; 
}
</style>