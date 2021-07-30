<template>
  <div class="d3" ref="d3"></div>
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
  ScaleBand,
  scaleBand,
  Selection,
  ScaleTime,
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
    tracks: {
      type: Array as () => ITrack[],
      default: [] as ITrack[],
    },
  },
  data() {
    return {
      height: 0,
      width: 0,
      minDate: this.initMinDate,
      maxDate: this.initMaxDate,
      margin: { top: 0, right: 30, bottom: 30, left: 150 },
      xAxisDefinition: {} as Axis<Date | NumberValue>,
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      svg: {} as Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
      trackRects: {} as Selection<SVGRectElement, ITrack, SVGGElement, unknown>,
      xScale: {} as ScaleTime<number, number, never>,
      yScale: {} as ScaleBand<string>,
      resizeObserver: new ResizeObserver(
        debounce((entries) => {
          this.onResize(entries);
        }, 250)
      ),
    };
  },
  methods: {
    onResize(entries: ResizeObserverEntry[]) {
      entries.forEach((entry) => {
        this.height = entry.contentRect.height;
        this.width = entry.contentRect.width;

        this.svg
          .attr("width", this.svgWidth())
          .attr("height", this.svgHeight());

        this.xScale.range([0, this.svgWidth()]);
        this.xAxis
          .attr("transform", `translate(0, ${this.svgHeight() - 20})`)
          .call(this.xAxisDefinition);
        this.yScale.rangeRound([0, this.svgHeight() - 20]);
        this.trackRects
          .transition()
          .attr("width", this.svgWidth())
          .attr("fill", "var(--blue200)")
          .attr("height", this.yScale.bandwidth)
          .attr("y", (t) => {
            const result = this.yScale(t.label);
            return result === undefined ? null : (result as number);
          });
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
    this.xScale = scaleTime()
      .domain([this.initMinDate, this.initMaxDate])
      .rangeRound([0, this.svgWidth()]);
    this.yScale = scaleBand()
      .domain(this.tracks.map((t) => t.label))
      .padding(0.6);
  },
  mounted() {
    this.xAxisDefinition = axisBottom(this.xScale);

    this.svg = select(".d3")
      .append("svg")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxis = this.svg
      .append("g")
      .attr("class", "x-axis")
      .call(this.xAxisDefinition);

    this.trackRects = this.svg
      .append("g")
      .selectAll(".track")
      .data(this.tracks)
      .enter()
      .append("rect")
      .attr("class", "track");

    this.resizeObserver.observe(this.$refs["d3"] as Element);
  },
});
</script>

<style scoped>
.d3 {
  background: white;
  color: var(--blue900);
  height: inherit;
  opacity: 0.7;
  width: inherit;
  z-index: inherit;
}
</style>
