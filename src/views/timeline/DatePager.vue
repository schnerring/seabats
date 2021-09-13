<template>
  <div class="date-range">
    <el-radio-group v-model="duration" size="medium">
      <el-radio-button label="year"></el-radio-button>
      <el-radio-button label="month"></el-radio-button>
      <el-radio-button label="week" disabled></el-radio-button>
      <el-radio-button label="day"></el-radio-button>
    </el-radio-group>
    <div class="date-pager">
      <button v-if="enabled" class="pager-button" @click="previous()">
        &lt;
      </button>
      <div class="current">{{ formattedDate }}</div>
      <button v-if="enabled" class="pager-button" @click="next()">&gt;</button>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs, { UnitType } from "dayjs";
import { ElRadioButton, ElRadioGroup } from "element-plus";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ElRadioGroup,
    ElRadioButton,
  },
  emits: ["dateRangeChanged"],
  data(): { selectedDate: Date; duration: UnitType } {
    return {
      selectedDate: new Date(2021, 6, 15),
      duration: "year",
    };
  },
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dateRange() {
      this.$emit("dateRangeChanged", this.dateRange);
    },
  },
  computed: {
    formattedDate(): string {
      if (this.duration === "year") {
        return dayjs(this.selectedDate).format("YYYY").toString();
      } else if (this.duration === "month") {
        return dayjs(this.selectedDate).format("YYYY / MM").toString();
      } else if (this.duration === "day") {
        return dayjs(this.selectedDate).format("YYYY / MM / DD").toString();
      }
      throw `Unsupported unitType ${this.duration}`;
    },
    dateRange(): [Date, Date] {
      return [
        dayjs(this.selectedDate).startOf(this.duration).toDate(),
        dayjs(this.selectedDate).endOf(this.duration).toDate(),
      ];
    },
  },
  methods: {
    previous() {
      this.selectedDate = dayjs(this.selectedDate)
        .subtract(1, this.duration)
        .toDate();
    },
    next() {
      this.selectedDate = dayjs(this.selectedDate)
        .add(1, this.duration)
        .toDate();
    },
  },
});
</script>

<style scoped>
.date-range {
  display: flex;
  flex-direction: row;
}

.date-pager {
  box-sizing: border-box;
  background: var(--white);
  color: var(--grey3);
  font-size: 14px;
  border: solid 1px #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.date-pager:hover {
  background: var(--grey3);
  color: var(--white);
  cursor: default;
  border: solid 1px var(--grey3);
}

.pager-button {
  color: inherit;
  background: transparent;
  border: 0;
  font-family: inherit;
  font-size: inherit;
  height: 100%;
  padding: 0px 9px;
}
.pager-button:hover {
  cursor: pointer;
}
</style>
