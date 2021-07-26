<template>
<div class="nav-header">
    <picture>
        <img :src="src">
    </picture>
    <nuxt-link :to="link">Suivant</nuxt-link>
</div>
</template>
<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        }
    },
    mounted(){
        console.log(this.$store.state.spotify);
    }
}
</script>
<style lang="scss" scoped>
.nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 50px;
    margin-top: 63px;
    margin-bottom: 60px;
    picture{
        width: 48px;
        height: 48px;
        border-radius: 200px;
        overflow: hidden;
        img{
            height: 100%;
            width: 100%;
        }
    }
}
a{
  width: fit-content;
  margin: auto;
  margin-right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 21px 24px;
  background: #ffc700;
  border: none;
  border-radius: 8px;
  text-decoration: none;

  font-family: map-get($map: $typography-font-family, $key: "font-family-text");
  cursor: pointer;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;

  color: map-get($map: $colors, $key: "black-text");
}

</style>