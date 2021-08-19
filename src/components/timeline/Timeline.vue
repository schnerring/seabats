<template>
  <button @click="zoomClick">Zoom Out</button>
  <div class="d3" ref="d3"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { debounce, uniqBy } from "lodash";
import { IEvent } from "@/components/timeline/timeline";

import {
  scaleTime,
  zoom,
  axisBottom,
  select,
  selectAll,
  Axis,
  NumberValue,
  ScaleBand,
  scaleBand,
  Selection,
  ScaleTime,
  BaseType,
  ZoomBehavior,
} from "d3";

export default defineComponent({
  emits: ["eventMouseover", "dateRangeChanged"],
  props: {
    minDate: {
      type: Date,
      default: new Date(2016, 1, 1),
    },
    maxDate: {
      type: Date,
      default: new Date(),
    },
    events: {
      type: Array as () => IEvent[],
      default: [] as IEvent[],
    },
  },
  computed: {
    maxZoomFactor(): number {
      const minDisplayedDays = 4;
      return (
        dayjs(this.maxDate).diff(dayjs(this.minDate), "days", true) /
        minDisplayedDays
      );
    },
    labels(): { key: string; label: string }[] {
      const keyLabels = this.events.map((e) => {
        return {
          key: e.key,
          label: e.label,
        };
      });
      return uniqBy(keyLabels, (event) => event.key);
    },
  },
  data() {
    return {
      outerSize: { height: 0, width: 0 },
      zoom: {
        // from: dayjs().subtract(3, "months").toDate(),
        from: dayjs().subtract(0.75, "months").toDate(),
        to: new Date(),
      },
      zoomBehavior: {} as ZoomBehavior<SVGRectElement, unknown>,
      zoomRect: {} as Selection<SVGRectElement, unknown, HTMLElement, unknown>,
      margin: { top: 10, right: 30, bottom: 30, left: 150 },
      xScale: {} as ScaleTime<number, number, never>,
      yScale: {} as ScaleBand<string>,
      xAxisDefinition: {} as Axis<Date | NumberValue>,
      xAxis: {} as Selection<SVGGElement, unknown, HTMLElement, unknown>,
      tracksSelection: {} as Selection<
        BaseType,
        { key: string; label: string },
        SVGGElement,
        unknown
      >,
      defaultSelection: [] as number[],
      svg: {} as Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
      eventsSelection: {} as Selection<
        SVGRectElement,
        IEvent,
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
    zoomTest(event: Event) {
      console.log(event);
    },
    zoomClick() {
      this.zoom = {
        from: dayjs(this.zoom.from).subtract(3, "months").toDate(),
        to: this.zoom.to,
      };
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
      this.zoomBehavior
        .extent([
          [0, 0],
          [innerSize.width, innerSize.height],
        ])
        .scaleExtent([1, this.maxZoomFactor]);

      this.zoomRect
        .attr("width", innerSize.width)
        .attr("height", innerSize.height);

      this.xAxis
        .transition()
        .attr("transform", `translate(0, ${innerSize.height - paddingBottom})`)
        .call(this.xAxisDefinition);

      selectAll<SVGGElement, { key: string; label: string }>(".track-group")
        .transition()
        .attr("transform", (kl) => {
          const y = this.yScale(kl.key);
          return y === undefined ? "translate(0, 0)" : `translate(0, ${y})`;
        });

      selectAll(".track-rect")
        .attr("width", innerSize.width)
        .attr("height", this.yScale.bandwidth);

      selectAll(".event")
        .data(this.events)
        .attr("width", (event) => {
          const xEnd = this.xScale(event.end);
          const xStart = this.xScale(event.start);
          return Math.max(10, xEnd - xStart);
        })
        .attr("height", this.yScale.bandwidth)
        .attr(
          "transform",
          (event) =>
            `translate(${this.xScale(event.start)}, ${this.yScale(event.key)})`
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
    zoom(zoom: { from: Date; to: Date }) {
      // if (zoom.to < zoom.from) {
      // }
      if (zoom.from < this.minDate) {
        zoom.from = this.minDate;
      }
      if (zoom.to > this.maxDate) {
        zoom.to = this.maxDate;
      }
      // localStorage.setItem("timeline.zoom.from", this.zoom.from.toISOString());
      // TODO re-render axis etc.
      this.$emit("dateRangeChanged", this.zoom.from, this.zoom.to);
    },
    events() {
      this.yScale = scaleBand()
        .domain(this.labels.map((kl) => kl.key))
        .padding(0.6);

      this.eventsSelection = this.eventsSelection
        .data(this.events, (e) => e.key)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("class", "event")
              .attr("fill", "var(--blue600)"),
          (update) => {
            return update;
          },
          (exit) => {
            return exit.remove();
          }
        );

      this.tracksSelection = this.tracksSelection
        .data(this.labels, (d) => d.key)
        .join(
          (enter) => {
            const g = enter.append("g").attr("class", "track-group");
            g.append("rect")
              .attr("class", "track-rect")
              .attr("fill", "var(--blue200)");
            g.append("text")
              .attr("class", "track-label")
              .attr("text-anchor", "end")
              .attr("dominant-baseline", "text-before-edge")
              .attr("transform", "translate(-10, 0)")
              .attr("text-align", "right")
              .text((d) => d.label);
            return g;
          },
          (update) => {
            return update;
          },
          (exit) => {
            return exit.remove();
          }
        );

      this.drawEvents(this.outerSize);
    },
    outerSize(outerSize: { height: number; width: number }) {
      this.drawEvents(outerSize);
    },
  },
  created() {
    // Read timeline zoom from last visit
    // const from = localStorage.getItem("timeline.zoom.from");
    // if (from) {
    //   this.zoom.from = dayjs(from).toDate();
    // }

    this.xScale = scaleTime().domain([this.minDate, this.maxDate]);
    this.yScale = scaleBand()
      .domain(this.labels.map((kl) => kl.key))
      .padding(0.6);
    this.xAxisDefinition = axisBottom(this.xScale);
  },
  mounted() {
    this.svg = select(".d3")
      .append("svg")
      .attr("class", "canvas")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.zoomBehavior = zoom<SVGRectElement, unknown>()
      .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .on("zoom", this.zoomTest);

    this.zoomRect = this.svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(this.zoomBehavior);

    this.xAxis = this.svg
      .append("g")
      .attr("class", "x-axis")
      .call(this.xAxisDefinition);

    this.tracksSelection = this.svg
      .append("g")
      .attr("class", "tracks-g")
      .selectAll(".track");

    this.eventsSelection = this.svg
      .append("g")
      .attr("class", "events-g")
      .selectAll(".event");

    this.resizeObserver.observe(this.$refs["d3"] as Element);

    this.$emit("dateRangeChanged", this.minDate, this.maxDate);
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
