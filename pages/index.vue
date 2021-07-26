<template>
  <div class="section">
    <div class="logo">
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
    </div>
    <h1>
      <span class="top">Music</span><br /><span class="decoration">Museum</span>
    </h1>
    <button v-on:click="connectToSpotify()">Se connectez avec Spotify</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CLIENT_ID: null,
      REDIRECT_URI: null,
      scopes: [
        "ugc-image-upload",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "streaming",
        "app-remote-control",
        "user-read-email",
        "user-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-read-private",
        "playlist-modify-private",
        "user-library-modify",
        "user-library-read",
        "user-top-read",
        "user-read-playback-position",
        "user-read-recently-played",
        "user-follow-read",
        "user-follow-modify",
      ],
      access_token: null,
    };
  },

  mounted() {
    this.CLIENT_ID = process.env.API_SHOPIFY_CLIENT_ID;
    this.REDIRECT_URI = window.location.origin + "/callback";
    console.log(this.$store);
    window.addEventListener(
      "message",
      (event) => {
        var hash = JSON.parse(event.data);
        if (hash.type == "access_token") {
          this.access_token = hash.access_token;
          this.$store.commit("spotify/set", hash.access_token);
          console.log("this is the access token !", this.$store.state.spotify);
          this.$nuxt.$router.push({
            path: "/onboarding?accessToken=" + this.access_token,
          });
        }
      },
      false
    );
  },
  methods: {
    urlSpotify() {
      return (
        "https://accounts.spotify.com/authorize?client_id=" +
        this.CLIENT_ID +
        "&redirect_uri=" +
        encodeURIComponent(this.REDIRECT_URI) +
        "&scope=" +
        encodeURIComponent(this.scopes.join(" ")) +
        "&response_type=token"
      );
    },
    connectToSpotify() {
      if (process.browser) {
        console.log(this.urlSpotify(), this.REDIRECT_URI);
        if (window) {
          let width = 450,
            height = 730,
            left = window.screen.width / 2 - width / 2,
            top = window.screen.height / 2 - height / 2;

          let w = window.open(
            this.urlSpotify(),
            "Spotify",
            "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
              width +
              ", height=" +
              height +
              ", top=" +
              top +
              ", left=" +
              left
          );
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  picture {
    width: 146px;
    height: 146px;
    border-radius: 146px;
    display: block;
    background-color: orange;
    overflow: hidden;
  }
  h1 {
    font-size: 90px;
    text-align: center;
    line-height: 107px;
    .top {
      font-family: map-get(
          $map: $typography-font-family,
          $key: "font-family-text"
        ),
        Arial, Helvetica, sans-serif;
      text-transform: lowercase;
    }
    .decoration {
      font-family: map-get(
          $map: $typography-font-family,
          $key: "font-family-decoration"
        ),
        serif;
      font-style: italic;
      font-size: 120px;
      color: map-get($map: $colors, $key: "primary");
      text-transform: uppercase;
    }
  }
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 21px 24px;
    background: #ffc700;
    border: none;
    border-radius: 8px;

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
  }
}
</style>