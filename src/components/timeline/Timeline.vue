<template>
  <div class="d3" ref="d3">
    <svg></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { ITrack } from "@/components/timeline/timeline";

import {
  scaleTime,
  axisBottom,
  select,
  Axis,
  NumberValue,
  scaleLinear,
  ScaleLinear,
  Selection,
  selectAll,
  BaseType,
} from "d3";

export default defineComponent({
  props: {
    initMinDate: {
      type: Date,
      default: dayjs().subtract(1, "years").toDate(),
    },
    initMaxDate: {
      type: Date,
      default: dayjs().toDate(),
    },
    height: {
      type: Number,
      default: 200,
    },
    tracks: {
      type: Array as () => ITrack[],
      default: [] as ITrack[],
    },
  },
  data() {
    return {
      minDate: this.initMinDate,
      maxDate: this.initMaxDate,
      width: 0,
      margin: { top: 0, right: 30, bottom: 30, left: 150 },
      xAxisDefinition: {} as Axis<Date | NumberValue>,
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, any>,
      svg: {} as Selection<SVGGElement, unknown, HTMLElement, any>,
      xScale: {} as ScaleLinear<number, number, never>,
      resizeObserver: new ResizeObserver(
        debounce((entries) => {
          this.update(entries);
        }, 250)
      ),
    };
  },
  methods: {
    update(entries: ResizeObserverEntry[]) {
      entries.forEach((entry) => {
        this.width = entry.contentBoxSize[0].inlineSize;
        this.xScale.range([0, this.svgWidth()]);
        this.xAxis.call(this.xAxisDefinition);
        this.svg.transition().attr("width", this.svgWidth());
      });
    },
    svgHeight() {
      const height = this.height - this.margin.top - this.margin.bottom;
      return height < 0 ? 0 : height;
    },
    svgWidth() {
      const width = this.width - this.margin.left - this.margin.right;
      return width < 0 ? 0 : width;
    },
  },
  created() {
    this.xScale = scaleLinear().domain([0, 100]).range([0, 100]);
  },
  mounted() {
    this.xAxisDefinition = axisBottom(this.xScale);
    this.svg = select(".d3 svg");
    this.svg
      .attr("width", this.svgWidth())
      .attr("height", this.svgHeight())
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxis = this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.svgHeight() - 20})`)
      .attr("class", "x-axis")
      .call(this.xAxisDefinition);
    selectAll(".x-axis line, .x-axis path").attr("stroke", "var(--blau)");
    selectAll(".x-axis text").attr("fill", "var(--blau)");
    this.resizeObserver.observe(this.$refs["d3"] as Element);
    this.svg.append("circle").attr("cx", "-50 50").attr("r", "50");
  },
});
</script>

<style scoped>
.d3 {
  background: #fff;
  height: inherit;
  opacity: 0.7;
  width: inherit;
  z-index: inherit;
}
.svg-style {
  border-left: solid var(--blau) 1pt;
  border-right: solid var(--blau) 1pt;
}
.x-axis line,
.x-axis path {
  stroke: var(--blau);
}
.d3 {
  border-bottom: 1pt solid var(--blau);
  border-top: 1pt solid var(--blau);
}
</style>
