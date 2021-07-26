<template>
  <div>
    <div v-if="loaded" class="onboarding-header">
      <svg
        width="146"
        height="146"
        viewBox="0 0 146 146"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="73" cy="73" r="73" fill="#FFC700" />
        <circle cx="73" cy="73" r="73" fill="#FFC700" />
        <circle
          cx="73"
          cy="73"
          r="72"
          fill="url(#paint0_linear)"
          stroke="black"
          stroke-width="2"
        />
        <path
          d="M36.3948 97.6203C51.0277 80.7125 87.5075 85.373 94.5334 112.45"
          stroke="black"
          stroke-width="9"
          stroke-linecap="round"
        />
        <path
          d="M29.871 78.6907C49.5863 55.3437 98.2722 61.3771 107.389 98.4632"
          stroke="black"
          stroke-width="9"
          stroke-linecap="round"
        />
        <path
          d="M16.1171 63.8305C44.2779 30.3003 113.67 38.8392 126.58 92.0062"
          stroke="black"
          stroke-width="9"
          stroke-linecap="round"
        />
        <rect
          x="58.7296"
          y="100.62"
          width="14"
          height="14"
          rx="7"
          transform="rotate(12.8327 58.7296 100.62)"
          fill="black"
        />
        <rect
          x="80.2842"
          y="24.4578"
          width="8.22324"
          height="8.22324"
          rx="4.11162"
          transform="rotate(12.8327 80.2842 24.4578)"
          fill="black"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="73"
            y1="0"
            x2="73"
            y2="146"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF9900" />
            <stop offset="1" stop-color="#FFC700" />
          </linearGradient>
        </defs>
      </svg>
      <picture>
        <img :src="userData.images[0].url" alt="user_profile" />
      </picture>
    </div>
    <div v-if="!existingWorld">
      <h1>
        You can acces to <span class="decoration">the experience</span> now
      </h1>
      <nuxt-link class="button" to="/onboarding/step-1">C'est partie</nuxt-link>
    </div>
    <div v-else>
      <h1>
        You can access to <span class="decoration">the experiences</span> now
      </h1>
      <h2>You already have {{ existingWorld.length || 0 }} world(s)</h2>
      <ul>
        <li
          v-for="(world, index) in existingWorld"
          :key="index"
          class="world-item"
        >
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

        <li class="new">
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
.onboarding-header {
  margin-top: 177px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    right: 50%;
    top: calc(50% - 53px);
    display: block;
    width: 1px;
    background-color: map-get($map: $colors, $key: "primary");
    height: 106px;
  }
  svg {
    margin-right: 20px;
    position: relative;
  }
  picture {
    margin-left: 20px;
    display: block;
    width: 146px;
    height: 146px;
    border-radius: 100px;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
h1 {
  text-align: center;
  font-size: 60px;
  max-width: 900px;
  padding-right: 0;
  margin: auto;
  .decoration {
    font-size: 66px;
    font-family: map-get(
        $map: $typography-font-family,
        $key: "font-family-decoration"
      ),
      serif;
    font-style: italic;
  }
}
a.button {
  width: fit-content;
  margin: auto;
  margin-top:  120px;
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

h2{
  margin-top: 64px;
}
ul{
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(205px, 241px));
  margin-bottom: 180px;
  align-items: center;
}
.world-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: map-get($map: $colors-background, $key: "card");
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 205px;
  height: 300px;
  font-family: map-get($map: $typography-font-family, $key: "font-family-text");
  picture {
    display: block;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  p{
    text-transform: uppercase;
    font-family: map-get($map: $typography-font-family, $key: "font-family-text");
  }
  a{
    color: map-get($map: $colors, $key: "primary");
    text-transform: initial;
  }
}
li.new{
    display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ffc700;
    width: 205px;
  height: 300px;
  a{
    color: map-get($map: $colors, $key: "primary");
    text-decoration: none;
  }
}
</style>