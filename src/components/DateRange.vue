<template>
  <el-radio-group v-model="duration" size="mini">
    <el-radio-button label="year"></el-radio-button>
    <el-radio-button label="month"></el-radio-button>
    <el-radio-button label="week" disabled></el-radio-button>
    <el-radio-button label="day"></el-radio-button>
  </el-radio-group>
  <div class="buttons">
    <button v-if="enabled" class="pre" @click="previous()">&lt;</button>
    <div class="current">{{ formattedDate }}</div>
    <button v-if="enabled" class="next" @click="next()">&gt;</button>
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
  background: white;
  color: rgb(77, 77, 77);
  padding: 10px 20px;
  font-size: 10pt;
  margin-right: 10px;
  border: solid 0.5pt rgb(77, 77, 77);
  display: flex;
  min-width: 119px;
  justify-content: space-around;
}
.pre {
  margin-right: 10px;
}
.next {
  margin-left: 10px;
}
</style>
