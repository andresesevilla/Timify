<template>
  <div id="chart"></div>
</template>

<script>
import { Chart } from "frappe-charts";

export default {
  name: "FrappeChart",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          labels: [],
          datasets: [],
        };
      },
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.chart = new Chart("#chart", {
      data: this.data,
      type: this.type,
      height: this.height,
      width: this.width,
    });
  },
  methods: {
    update(data) {
      this.chart.update(data);
    },
  },
};

</script>

<style lang="scss">
@import "@/public/variables.scss";

.graph-svg-tip.comparison .title {
  color: $oc-gray-1;
}
</style>