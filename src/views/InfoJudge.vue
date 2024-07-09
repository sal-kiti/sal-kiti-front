<template>
  <div class="home">
    <InfoJudge />
  </div>
</template>

<script>
/**
 * Info view
 */
import InfoJudge from "@/components/InfoJudge.vue";

export default {
  name: "InfoJudgeView",
  components: {
    InfoJudge
  },
  created() {
    document.title =
      this.$tc("info.judge", 2) + " | " + this.$t("title.prefix");
  }
};
</script>
