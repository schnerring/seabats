<template>
  <el-radio-group v-model="duration" size="medium">
    <el-radio-button label="year"></el-radio-button>
    <el-radio-button label="month"></el-radio-button>
    <el-radio-button label="week" disabled></el-radio-button>
    <el-radio-button label="day"></el-radio-button>
  </el-radio-group>
  <div class="buttons">
    <button v-if="enabled" class="pre nav-button" @click="previous()">
      &lt;
    </button>
    <div class="current">{{ formattedDate }}</div>
    <button v-if="enabled" class="next nav-button" @click="next()">&gt;</button>
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
  data(): { selectedDate: Date; duration: string } {
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
      const unitType = this.duration as UnitType;
      if (unitType === "year") {
        return dayjs(this.selectedDate).format("YYYY").toString();
      } else if (unitType === "month") {
        return dayjs(this.selectedDate).format("YYYY / MM").toString();
      } else if (unitType === "day") {
        return dayjs(this.selectedDate).format("YYYY / MM / DD").toString();
      }
      throw `Unsupported unitType ${unitType}`;
    },
    dateRange(): [Date, Date] {
      const unitType = this.duration as UnitType;
      return [
        dayjs(this.selectedDate).startOf(unitType).toDate(),
        dayjs(this.selectedDate).endOf(unitType).toDate(),
      ];
    },
  },
  methods: {
    previous() {
      const unitType = this.duration as UnitType;
      this.selectedDate = dayjs(this.selectedDate)
        .subtract(1, unitType)
        .toDate();
    },
    next() {
      const unitType = this.duration as UnitType;
      this.selectedDate = dayjs(this.selectedDate).add(1, unitType).toDate();
    },
  },
});
</script>

<style scoped>
.buttons {
  background: var(--white);
  color: var(--grey3);
  padding: 6px 20px;
  font-size: 14px;
  height: 16px;
  margin-right: 10px;
  border: solid 1px #dcdfe6;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: space-around;
}
.buttons:hover {
  background: var(--grey3);
  color: var(--white);
  height: 18px;
}
.nav-button {
  color: inherit;
  background: transparent;
  border: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
}
.nav-button:hover {
  cursor: pointer;
}
.pre {
  margin-right: 10px;
}
.next {
  margin-left: 10px;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: none !important;
}
</style>
