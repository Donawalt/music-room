<template>
  <div>
    <div v-if="loaded">
      <picture>
        <img :src="userData.images[0].url" alt="user_profile" />
      </picture>
      <div></div>
      <picture></picture>
    </div>
    <div v-if="!existingWorld">
      <h1>You can acces to the experience now</h1>
      <nuxt-link to="/onboarding/step-1">C'est partie</nuxt-link>
    </div>
    <div v-else>
      <h1>You can access to the experience now</h1>
      <h2>You already have {{ existingWorld.length || 0 }} world(s)</h2>
      <ul>
        <li v-for="(world, index) in existingWorld" :key="index" class="world-item">
          <picture>
            <img :src="world.world_profile" alt="user_profile" />
          </picture>
          <p>
            {{ world.world_name }}
          </p>

          <p>
            <nuxt-link :to="'world/' + world.world_id">
              see the world
            </nuxt-link>
          </p>
        </li>

        <li>
          <nuxt-link to="/onboarding/step-1">Créer un nouveau monde</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
      userData: null,
      existingWorld: true,
    };
  },
  mounted() {
    console.log(this.userData);
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .$get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + this.$route.query.accessToken,
          },
        })
        .then((result) => {
          console.log(result);
          this.loaded = true;
          this.userData = result;
          this.$store.commit("spotify/addUser", result);
          this.getUserDB().then((result) => {
            console.log(result);
          });
          //this.updateDB();
        });
    },
    async getUserDB() {
      const { data, error } = await this.$supabase
        .from("Users")
        .select(`*`)
        .eq("spotify_user_id", this.userData.id);
      console.log(data);

      if (data.length >= 0) {
        this.getExistingWorlds().then((el) => {
          console.log(el);
        });
      } else {
        this.updateDB();
      }
      return { data };
    },
    async getExistingWorlds() {
      const { data, error } = await this.$supabase
        .from("Worlds")
        .select(`*`)
        .eq("user_id", this.userData.id);
      console.log(data);
      this.existingWorld = data;
      return data;
    },
    async updateDB() {
      const { data, error } = await this.$supabase.from("Users").insert([
        {
          spotify_user_id: this.userData.id,
          name: this.userData.display_name,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.world-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 200px;
  picture{
    display: block;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 100%;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>