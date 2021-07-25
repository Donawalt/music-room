<template>
  <div>
    <template v-if="!loaded"><p>Chargement</p></template>
    <template v-else>
      <nuxt-link to="/onboarding/step-2">étape suivante</nuxt-link>
      <section>
        <label for="site-search"
          ><h1>
            Choose some of you favourites artists you want to share !
          </h1></label
        >
        <input
          type="search"
          id="site-search"
          name="q"
          aria-label="Search through site content"
          @change="handleSearch($event)"
        />
      </section>
      <ul>
        <li
          v-for="artist in artists.artists.items"
          :key="artist.id"
          :data-artist-id="artist.id"
          v-on:click="toggleArtist($event)"
          data-toggle="false"
        >
          <picture>
            <img :src="artist.images[0] ? artist.images[0].url : ''" alt="" />
          </picture>
          <p>{{ artist.name }}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
      artists: null,
      slectedArtists: []
    };
  },
  mounted() {
    this.getArtists();
  },
  methods: {
    getArtists() {
      this.$axios
        .$get("https://api.spotify.com/v1/me/following?type=artist&limit=20", {
          headers: {
            Authorization: "Bearer " + this.$store.state.spotify.access_token,
          },
        })
        .then((result) => {
          console.log(result);
          this.loaded = true;
          this.artists = result;
        });
    },
    toggleArtist($event) {
      console.log($event.target.dataset.artistId, $event.target.dataset.toggle);
      console.log(this.$store.state);
      let id = $event.target.dataset.artistId;
      if (
        $event.target.dataset.toggle === "true" ||
        $event.target.dataset.toggle === true
      ) {
        this.$store.commit("spotify/removeArtist", id);
        $event.target.dataset.toggle = false;
        console.log(
          $event.target.dataset.artistId,
          $event.target.dataset.toggle
        );
      } else {
        this.$store.commit("spotify/addArtist", id);
        $event.target.dataset.toggle = true;
      }
       this.verifyArtistPresence();
    },
    handleSearch($event){
        console.log($event.target.value);
            this.$axios
        .$get(`https://api.spotify.com/v1/search?q=${$event.target.value}&type=artist&limit=50&market=FR`, {
          headers: {
            Authorization: "Bearer " + this.$store.state.spotify.access_token,
          },
        })
        .then((result) => {
          console.log(result);
          this.loaded = true;
          this.artists = result;
          setTimeout(()=>{
             this.verifyArtistPresence();
          }, 200)
        });
        console.log(this.$store.state.spotify.artists_list);
        this.verifyArtistPresence();
    }, 
    verifyArtistPresence(){
      this.$store.state.spotify.artists_list.forEach(element => {
        console.log(element);
        if( document.querySelector(`li[data-artist-id="${element}"]`) !== null){
          document.querySelector(`li[data-artist-id="${element}"]`).dataset.toggle = true;
        }
      });
    }

  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  picture {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
  li[data-toggle="true"]{
    border: 2px solid green;
  }
  picture,
  p {
    pointer-events: none;
  }
}
</style>