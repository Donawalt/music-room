<template>
  <div>
    <picture></picture>
    <h1>Music Museum</h1>
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
      access_token: null
    };
  },

  mounted() {
    this.CLIENT_ID = process.env.API_SHOPIFY_CLIENT_ID;
    this.REDIRECT_URI = (window.location.origin + '/callback');
    console.log(this.$store);
    window.addEventListener("message", (event) => {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                this.access_token = hash.access_token;
                this.$store.commit('spotify/set', hash.access_token);
                console.log('this is the access token !', this.$store.state.spotify)
                this.$nuxt.$router.push({ path: "/onboarding?accessToken=" + this.access_token });
            }
    }, false);
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
