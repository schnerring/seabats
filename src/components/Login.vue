<template>
  <el-form :inline="true" :model="form" class="demo-form-inline">
    <el-form-item>
      <el-input
        v-model="form.passphrase"
        placeholder="Passphrase"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Login</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElNotification,
} from "element-plus";
import { checkPassphrase } from "@/shared/Auth";

export default defineComponent({
  components: {
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
  },
  data() {
    return {
      form: {
        passphrase: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      const loggedIn = await checkPassphrase(this.form.passphrase);
      if (loggedIn) {
        // TODO
        console.log("success");
        return;
      }
      this.form.passphrase = "";
      ElNotification({
        title: "Error",
        message: "The passphrase you entered is incorrect. Please try again.",
        type: "error",
      });
    },
  },
});
</script>

<style scoped></style>
