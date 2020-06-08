<template>
  <div> Edit CI </div>
</template>


<script>
export default {
  name: "CiDetail",
  data() {
    return {
      isEdit: true
    };
  },
  created() {
    this.isEdit = this.$route.params.id !== undefined;
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      console.log(this.$route.params.id);
    }
  }
};
</script>

<style lang="scss" scoped>
</style> 