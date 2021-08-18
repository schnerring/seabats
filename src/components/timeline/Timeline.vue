<template>
  <div class="d3" ref="d3"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { IEvent } from "@/components/timeline/timeline";
import { uniq } from "lodash";

import {
  scaleTime,
  axisBottom,
  select,
  selectAll,
  Axis,
  NumberValue,
  ScaleBand,
  scaleBand,
  Selection,
  ScaleTime,
  brushX,
  BrushBehavior,
} from "d3";

export default defineComponent({
  props: {
    minDate: {
      type: Date,
      default: new Date(2016, 1, 1),
    },
    maxDate: {
      type: Date,
      default: new Date(),
    },
    initFromDate: {
      type: Date,
      default: dayjs().subtract(1, "year").toDate(),
    },
    initToDate: {
      type: Date,
      default: dayjs().toDate(),
    },
    events: {
      type: Array as () => IEvent[],
      default: [] as IEvent[],
    },
  },
  computed: {
    labels(): string[] {
      return uniq(this.events.map((e) => e.label));
    },
  },
  data() {
    return {
      outerSize: { height: 0, width: 0 },
      fromDate: this.initFromDate,
      toDate: this.initToDate,
      margin: { top: 10, right: 30, bottom: 30, left: 150 },
      xScale: {} as ScaleTime<number, number, never>,
      yScale: {} as ScaleBand<string>,
      xAxisDefinition: {} as Axis<Date | NumberValue>,
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      brushGroup: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      brush: {} as BrushBehavior<unknown>,
      defaultSelection: [] as number[],
      svg: {} as Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
      eventGroup: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      trackRects: null as unknown as Selection<
        SVGRectElement,
        string,
        SVGGElement,
        unknown
      >,
      trackRectTexts: null as unknown as Selection<
        SVGTextElement,
        string,
        SVGGElement,
        unknown
      >,
      resizeObserver: new ResizeObserver(
        debounce((entries) => {
          this.onResize(entries);
        }, 250)
      ),
    };
  },
  methods: {
    brushed() {
      console.debug("brushed");
    },
    brushEnded() {
      console.debug("brush ended");
    },
    drawEvents(outerSize: { height: number; width: number }) {
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
      if (this.trackRects) {
        this.trackRects
          .transition()
          .attr("width", innerSize.width)
          .attr("height", this.yScale.bandwidth)
          .attr("y", (label) => {
            const y = this.yScale(label);
            return y === undefined ? null : y;
          });
      }
      if (this.trackRectTexts) {
        this.trackRectTexts
          .transition()
          .attr("x", -this.margin.left / 2)
          .attr("y", (label) => {
            const y = this.yScale(label);
            return y === undefined ? null : y;
          });
      }

      const topLeft: [number, number] = [0, 0];
      const bottomRight: [number, number] = [
        innerSize.width,
        innerSize.height - paddingBottom,
      ];
      this.brush.extent([topLeft, bottomRight]);

      this.defaultSelection = [
        this.xScale(dayjs(this.toDate).subtract(1, "year").toDate()),
        this.xScale(this.toDate),
      ];

      this.brushGroup
        .call(this.brush)
        .call(this.brush.move, this.defaultSelection);

      this.eventGroup = this.svg.append("g").attr("class", "eventGroup");

      this.eventGroup.selectAll(".event").remove();

      this.eventGroup
        .selectAll(".event")
        .data(this.events)
        .enter()
        .append("rect")
        .attr("class", "event")
        .attr("fill", "var(--blue600)")
        .attr("width", (event) => {
          const xEnd = this.xScale(event.end);
          const xStart = this.xScale(event.start);
          return Math.max(10, xEnd - xStart);
        })
        .attr("height", this.yScale.bandwidth)
        .attr(
          "transform",
          (event) =>
            `translate(${this.xScale(event.start)}, ${this.yScale(
              event.label
            )})`
        )
        .on("mouseover.fill", function () {
          select(this).attr("fill", "var(--blue900)");
        })
        .on("mouseover.emit", (event, data) => {
          this.$emit("eventMouseover", data);
        })
        .on("mouseout", function (event, data) {
          select(this).attr("fill", "var(--blue600)");
        });
    },
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
    events() {
      this.yScale = scaleBand()
        .domain(this.events.map((t) => t.label))
        .padding(0.6);

      this.trackRects = this.svg
        .append("g")
        .selectAll(".track")
        .data(uniq(this.events.map((event) => event.label)))
        .enter()
        .append("rect")
        .attr("class", "track")
        .attr("fill", "var(--blue200)");

      this.trackRectTexts = this.svg
        .append("g")
        .attr("class", "track-label-group")
        .selectAll(".track-label")
        .data(this.labels)
        .enter()
        .append("text")
        .attr("class", "track-label")
        .text((label) => `#${label}`);
      this.drawEvents(this.outerSize);
    },
    outerSize(outerSize: { height: number; width: number }) {
      this.drawEvents(outerSize);
    },
  },
  created() {
    this.xScale = scaleTime().domain([this.fromDate, this.toDate]);
    this.yScale = scaleBand()
      .domain(this.events.map((t) => t.label))
      .padding(0.6);
    this.xAxisDefinition = axisBottom(this.xScale).ticks(30);

    this.brush = brushX().on("brush", this.brushed).on("end", this.brushEnded);
  },
  mounted() {
    this.svg = select(".d3")
      .append("svg")
      .attr("class", "canvas")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxis = this.svg
      .append("g")
      .attr("class", "x-axis")
      .call(this.xAxisDefinition);

    // this.trackRects = this.svg
    //   .append("g")
    //   .selectAll(".track")
    //   .data(this.labels)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "track")
    //   .attr("fill", "var(--blue200)");

    // this.trackRectTexts = this.svg
    //   .append("g")
    //   .attr("class", "track-label-group")
    //   .selectAll(".track-label")
    //   .data(this.labels)
    //   .enter()
    //   .append("text")
    //   .attr("class", "track-label")
    //   .text((label) => `#${label}`);

    this.svg
      .append("g")
      .selectAll(".event")
      .data(this.events)
      .enter()
      .append("rect")
      .attr("class", "event")
      .attr("fill", "var(--blue600)");

    this.brushGroup = this.svg.append("g").attr("class", "timeline-brush");

    this.resizeObserver.observe(this.$refs["d3"] as Element);
  },
});
</script>

<style>
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
.canvas {
  overflow: inherit;
}
</style>
