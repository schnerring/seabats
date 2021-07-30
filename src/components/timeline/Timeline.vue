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
  ScaleBand,
  ScaleLinear,
  scaleBand,
  Selection,
  selectAll,
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
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      svg: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      planeBars: {} as Selection<SVGRectElement, ITrack, SVGGElement, unknown>,
      xScale: {} as ScaleLinear<number, number, never>,
      yScale: {} as ScaleBand<string>,
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
        this.planeBars
          .transition()
          .attr("width", this.svgWidth())
          .attr("fill", "var(--hellblau)")
          .attr("height", "20");
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
    this.yScale = scaleBand()
      .domain(this.tracks.map((t) => t.label))
      .rangeRound([0, 200]);
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
    this.resizeObserver.observe(this.$refs["d3"] as Element);

    this.planeBars = this.svg
      .selectAll(".plane")
      .data(this.tracks)
      .enter()
      .append("rect")
      .attr("class", "plane-bars")
      .attr("y", (t) => {
        const result = this.yScale(t.label);
        return result === undefined ? null : (result as number);
      });
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

.d3 {
  border-bottom: 1pt solid var(--blue900);
  border-top: 1pt solid var(--blue900);
}
</style>
