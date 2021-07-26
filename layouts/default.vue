<template>
  <div>
    <div class="wrapper">
      <main>
        <Nuxt />
      </main>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
body {
  background-color: map-get($map: $colors-background, $key: "layout");
  div.wrapper {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1200px;
    color: map-get($map: $colors, $key: "white-text");
    font-family: map-get($map: $typography-font-family, $key: "font-family-text"), Arial, sans-serif;
  }
}
</style>
