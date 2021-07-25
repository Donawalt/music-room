<template>
  <section>
      <h1>
          {{ data[0].world_name }}
      </h1>
  </section>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.data);
  },
  async asyncData({ params, $supabase }) {
    // Get supabase world in Worlds by world_id from supabase-worlds
    const { data, error } = await $supabase
      .from("Worlds")
      .select("*")
      .eq("world_id", params.slug);

    if (error) {
    alert(error);
    console.log(error);
    throw error;
    }
    console.log(data[0]);
    return {
        data
    };
  },
};
</script>
<style>
</style>