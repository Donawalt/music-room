<template>
  <div>
    <nav-header
      :src="$store.state.spotify.user_avatar"
      link="/onboarding/step-2"
    ></nav-header>
    <template v-if="!loaded"><p>Chargement</p></template>
    <template v-else>
      <section>
        <label for="site-search"
          ><h1>
            <span class="decoration">Choose</span> some of you
            <span class="decoration">favourites artists</span> you want to
            <span class="decoration">share !</span>
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
          <svg
            width="28"
            height="16"
            viewBox="0 0 28 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="27"
              height="15"
              rx="7.5"
              fill="white"
              stroke="#FFC700"
            />
            <path
              d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
              fill="#FFC700"
            />
          </svg>
        </li>
      </ul>
      <nuxt-link to="/onboarding/step-2">étape suivante</nuxt-link>
    </template>
  </div>
</template>

<script>
import navHeader from "~/components/nav-header.vue";
export default {
  components: { navHeader },
  data() {
    return {
      loaded: false,
      artists: null,
      slectedArtists: [],
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
    handleSearch($event) {
      console.log($event.target.value);
      this.$axios
        .$get(
          `https://api.spotify.com/v1/search?q=${$event.target.value}&type=artist&limit=50&market=FR`,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.spotify.access_token,
            },
          }
        )
        .then((result) => {
          console.log(result);
          this.loaded = true;
          this.artists = result;
          setTimeout(() => {
            this.verifyArtistPresence();
          }, 200);
        });
      console.log(this.$store.state.spotify.artists_list);
      this.verifyArtistPresence();
    },
    verifyArtistPresence() {
      this.$store.state.spotify.artists_list.forEach((element) => {
        console.log(element);
        if (
          document.querySelector(`li[data-artist-id="${element}"]`) !== null
        ) {
          document.querySelector(
            `li[data-artist-id="${element}"]`
          ).dataset.toggle = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(205px, 241px));
  picture {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
  li[data-toggle="true"] {
    transition: 300ms;
    background-color: map-get($map: $colors-background, $key: "card-hover");
    p {
      color: map-get($map: $colors, $key: "black-text");
    }
    svg {
      rect {
        stroke: black;
        transition: 300ms;
      }
      path {
        transform: translateX(12px);
        fill: black;
        transition: 300ms;
      }
    }
  }
  li {
    transition: 300ms;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    background-color: map-get($map: $colors-background, $key: "card");
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 205px;
    height: 300px;
    cursor: pointer;
    font-family: map-get(
      $map: $typography-font-family,
      $key: "font-family-text"
    );
    svg {
      transition: 300ms;
      path,
      rect {
        transition: 300ms;
      }
    }
    picture {
      display: block;
      width: 160px;
      height: 160px;
      overflow: hidden;
      border-radius: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    p {
      text-transform: uppercase;
      font-family: map-get(
        $map: $typography-font-family,
        $key: "font-family-text"
      );
    }
    &:hover {
      transition: 300ms;
      background-color: map-get($map: $colors-background, $key: "card-hover");
      p {
        color: map-get($map: $colors, $key: "black-text");
      }
    }
  }
  picture,
  p {
    pointer-events: none;
  }
}
section {
  h1 {
    font-family: map-get(
      $map: $typography-font-family,
      $key: "font-family-title"
    );
    font-size: 60px;
    text-align: center;
    .decoration {
      font-family: map-get(
        $map: $typography-font-family,
        $key: "font-family-decoration"
      );
      font-size: 66px;
    }
  }
  input[type="search"] {
    &::before {
      display: block;
      content: " ";
      background-image: url('data:image/svg+xml; utf8, <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4121 14.4121L20 20" stroke="black" stroke-linecap="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16Z" stroke="black"/></svg>');
      background-size: 24px 24px;
      width: 24px;
      height: 24px;
      z-index: 10;
    }
    position: relative;
    display: block;
    height: 48px;
    max-width: 426px;
    padding: 12px;
    padding-left: 32px;
    padding-right: 16px;
    border: 0;
    margin: auto;
    margin-bottom: 70px;
  }
}
  a {
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

    font-family: map-get(
      $map: $typography-font-family,
      $key: "font-family-text"
    );
    cursor: pointer;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;
    text-align: center;

    color: map-get($map: $colors, $key: "black-text");
    margin-top: 60px;
    margin-bottom: 160px;
  }
</style>