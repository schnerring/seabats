<template>
  <div class="d3" ref="d3"></div>
  <div class="button-container">
    <date-range @dateRangeChanged="setDateRange($event)" />
  </div>
</template>

<script lang="ts">
import DateRange from "@/components/DateRange.vue";
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { debounce, uniqBy } from "lodash";
import { IEventBase } from "@/components/timeline/timeline";

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
  D3ZoomEvent,
  zoomIdentity,
} from "d3";

export default defineComponent({
  emits: ["eventClick", "dateRangeChanged"],
  components: {
    DateRange,
  },
  props: {
    minDate: {
      type: Date,
      default: new Date(2021, 0, 1),
    },
    maxDate: {
      type: Date,
      default: new Date(2021, 11, 31),
    },
    events: {
      type: Array as () => IEventBase[],
      default: [] as IEventBase[],
    },
  },
  computed: {
    daysInDomain(): number {
      return dayjs(this.maxDate).diff(dayjs(this.minDate), "days", true);
    },
    maxZoomFactor(): number {
      const minDisplayedDays = 4;
      return this.daysInDomain / minDisplayedDays;
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
      debounceDateRangeChanged: debounce((from: Date, to: Date) => {
        this.$emit("dateRangeChanged", from, to);
      }, 1000),
      zoomBehavior: {} as ZoomBehavior<SVGRectElement, unknown>,
      zoomRect: {} as Selection<SVGRectElement, unknown, HTMLElement, unknown>,
      margin: { top: 10, right: 30, bottom: 50, left: 150 },
      xScale: {} as ScaleTime<number, number, never>,
      zoomScale: {} as ScaleTime<number, number, never>,
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
        IEventBase,
        SVGGElement,
        unknown
      >,
      clipRect: {} as Selection<SVGRectElement, unknown, HTMLElement, unknown>,
      resizeObserver: new ResizeObserver(
        debounce((entries) => {
          this.onResize(entries);
        }, 250)
      ),
    };
  },
  methods: {
    resetZoom() {
      this.zoomBehavior.transform(this.zoomRect, zoomIdentity);
    },
    setDateRange(range: [Date, Date]) {
      const from = range[0];
      const to = range[1];

      this.zoomScale = this.zoomScale.domain([from, to]);
      this.xAxisDefinition.scale(this.zoomScale);
      this.scalesChanged();

      const domainMin = this.zoomScale.domain()[0];
      const domainMax = this.zoomScale.domain()[1];
      this.debounceDateRangeChanged(domainMin, domainMax);
    },
    zoom(event: D3ZoomEvent<SVGRectElement, unknown>) {
      this.zoomScale = event.transform.rescaleX(this.xScale);
      this.xAxisDefinition.scale(this.zoomScale);
      this.scalesChanged();

      const domainMin = this.zoomScale.domain()[0];
      const domainMax = this.zoomScale.domain()[1];
      this.debounceDateRangeChanged(domainMin, domainMax);
    },
    onResize(entries: ResizeObserverEntry[]) {
      entries.forEach((entry) => {
        const outerSize = {
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        };
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
          .attr("width", innerSize.width)
          .attr("height", innerSize.height);

        this.zoomRect
          .attr("width", innerSize.width)
          .attr("height", innerSize.height);

        this.zoomBehavior.extent([
          [0, 0],
          [innerSize.width, innerSize.height],
        ]);
        this.clipRect
          .attr("width", innerSize.width)
          .attr("height", innerSize.height);
        const paddingBottom = 20;

        this.zoomScale.rangeRound([0, innerSize.width]);
        this.xScale.rangeRound([0, innerSize.width]);
        this.yScale.rangeRound([0, innerSize.height - paddingBottom]);

        this.scalesChanged();
      });
    },
    scalesChanged() {
      selectAll(".track-rect")
        .attr("width", this.zoomScale.range()[1])
        .attr("height", this.yScale.bandwidth);

      selectAll<SVGGElement, { key: string; label: string }>(
        ".track-group"
      ).attr("transform", (kl) => {
        const y = this.yScale(kl.key);
        return y === undefined ? "translate(0, 0)" : `translate(0, ${y})`;
      });

      selectAll<SVGRectElement, IEventBase>(".event")
        .attr("width", (event) => {
          const xEnd = this.zoomScale(event.end);
          const xStart = this.zoomScale(event.start);
          return Math.max(10, xEnd - xStart);
        })
        .attr("height", this.yScale.bandwidth)
        .attr(
          "transform",
          (event) =>
            `translate(${this.zoomScale(event.start)}, ${this.yScale(
              event.key
            )})`
        );

      this.xAxis
        .attr("transform", `translate(0, ${this.yScale.range()[1]})`)
        .call(this.xAxisDefinition);
    },
  },
  watch: {
    events() {
      this.eventsSelection = this.eventsSelection
        .data(this.events, (e) => e.key)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("class", "event")
              .attr("fill", "var(--white)")
              .on("click.select", function () {
                selectAll(".selected-track").classed("selected-track", false);
                select(this).classed("selected-track", true);
                select(this).attr("selected");
              })
              .on("click.emit", (event, data) =>
                this.$emit("eventClick", data)
              ),
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
              .attr("fill", "var(--grey2)");
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

      this.yScale.domain(this.labels.map((kl) => kl.key).sort());
      this.scalesChanged();
    },
  },
  created() {
    // Read timeline zoom from last visit
    // const from = localStorage.getItem("timeline.zoom.from");
    // if (from) {
    //   this.zoom.from = dayjs(from).toDate();
    // }
    this.xScale = scaleTime().domain([this.minDate, this.maxDate]);
    this.zoomScale = this.xScale;
    this.yScale = scaleBand().padding(0.6);
    this.xAxisDefinition = axisBottom(this.xScale);
  },
  mounted() {
    this.svg = select(".d3")
      .append("svg")
      .attr("class", "canvas")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .style("overflow", "visible");

    this.xAxis = this.svg
      .append("g")
      .attr("class", "x-axis")
      .call(this.xAxisDefinition);

    this.tracksSelection = this.svg
      .append("g")
      .attr("class", "tracks-g")
      .selectAll(".track");

    this.zoomBehavior = zoom<SVGRectElement, unknown>()
      .scaleExtent([0.25, 999999]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .on("zoom", this.zoom);

    this.zoomRect = this.svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(this.zoomBehavior);
    //.on("mousedown.zoom", null);
    // TODO
    // .on("touchstart.zoom", null)
    // .on("touchmove.zoom", null)
    // .on("touchend.zoom", null);

    this.clipRect = this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "EventsClip")
      .append("rect")
      .attr("fill", "transparent");

    this.eventsSelection = this.svg
      .append("g")
      .attr("class", "events-g")
      .attr("clip-path", "url(#EventsClip)")
      .selectAll(".event");

    this.resizeObserver.observe(this.$refs["d3"] as Element);

    this.$emit("dateRangeChanged", this.minDate, this.maxDate);
  },
});
</script>
<style>
/* TODO remove global state? */
.selected-track {
  fill: var(--blue);
}
</style>
<style scoped>
.d3 {
  background: var(--grey);
  border-bottom: var(--grey2) solid 1px;
  border-top: var(--grey2) solid 1px;
  color: var(--grey2);
  height: inherit;
  opacity: 1;
  width: inherit;
  z-index: inherit;
}
.button-container {
  display: flex;
  flex-direction: row;
  position: absolute;
  align-items: center;
  bottom: 17px;
  height: 18px;
  left: 150px;
  z-index: 200;
}
</style>
