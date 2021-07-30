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
      outerSize: { height: 0, width: 0 },
      minDate: this.initMinDate,
      maxDate: this.initMaxDate,
      margin: { top: 10, right: 30, bottom: 30, left: 150 },
      xScale: {} as ScaleTime<number, number, never>,
      yScale: {} as ScaleBand<string>,
      xAxisDefinition: {} as Axis<Date | NumberValue>,
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      svg: {} as Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
      trackRects: {} as Selection<SVGRectElement, ITrack, SVGGElement, unknown>,
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
        this.outerSize = {
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        };
      });
    },
  },
  watch: {
    outerSize(outerSize: { height: number; width: number }) {
      const innerSize = {
        height: Math.max(
          0,
          outerSize.height - this.margin.top - this.margin.bottom
        ),
        width: Math.max(
          0,
          outerSize.width - this.margin.left - this.margin.right
        ),
      };

      this.svg
        .transition()
        .attr("width", innerSize.width)
        .attr("height", innerSize.height);

      const paddingBottom = 20;

      this.xScale.rangeRound([0, innerSize.width]);
      this.yScale.rangeRound([0, innerSize.height - paddingBottom]);

      this.xAxis
        .transition()
        .attr("transform", `translate(0, ${innerSize.height - paddingBottom})`)
        .call(this.xAxisDefinition);

      this.trackRects
        .transition()
        .attr("width", innerSize.width)
        .attr("height", this.yScale.bandwidth)
        .attr("y", (t) => {
          const y = this.yScale(t.label);
          return y === undefined ? null : y;
        });
    },
  },
  created() {
    this.xScale = scaleTime().domain([this.initMinDate, this.initMaxDate]);

    this.yScale = scaleBand()
      .domain(this.tracks.map((t) => t.label))
      .padding(0.6);

    this.xAxisDefinition = axisBottom(this.xScale);
  },
  mounted() {
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
      .attr("class", "track")
      .attr("fill", "var(--blue200)");

    this.resizeObserver.observe(this.$refs["d3"] as Element);
  },
});
</script>

<style scoped>
.d3 {
  background: white;
  border-bottom: var(--blue900) solid 1px;
  border-top: var(--blue900) solid 1px;
  color: var(--blue900);
  height: inherit;
  opacity: 0.7;
  width: inherit;
  z-index: inherit;
}
</style>
