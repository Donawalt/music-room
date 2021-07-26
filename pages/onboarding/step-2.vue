<template>
  <!--- Sur cette page nous souhaitons
  - Récupérer l'image de profile de la futur de la playlist de l'utilisateur 
  - Récupérer le nom de la futur playlist de l'utilisateur
  Pour cela nous devons : 
  [X] Transformer l'image en url blob 
  [] Uploader sur supabase le monde 
  [] Genérer un identifiant unique pour le monde 
-->

  <section>
    <nav-header
      :src="$store.state.spotify.user_avatar"
      link="/onboarding/step-3"
    ></nav-header>
    <h1>
      Choose an <span class="decoration">artwork</span> for your
      <span class="decoration">museum identity</span> and
      <span class="decoration">a name</span>
    </h1>
    <div class="card-form">
      <div class="card">
        <picture>
          <img :src="avatar_url" />
        </picture>
        <p>{{ world_name ? world_name : "Le nom de votre monde" }}</p>
      </div>
      <form>
        <label for="avatar">{{ file_name ? file_name : "Choisissez une image" }}</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
          @change="beforeFileToBlobUrl"
        />
        <input type="text" name="world_name" v-model="world_name" placeholder="Le nom de votre monde" />
        <button name="submit" v-on:click="handleSubmit($event)">Suivant</button>
      </form>
    </div>
  </section>
</template>

<script>
import navHeader from "~/components/nav-header.vue";
export default {
  components: { navHeader },
  data() {
    return {
      world_name: "",
      world_id: "",
      avatar: "",
      avatar_url: "",
      file_name: null
    };
  },
  methods: {
    fileToBlobUrl(file) {
      var url = URL.createObjectURL(file);
      this.avatar_url = url;
    },
    beforeFileToBlobUrl(e) {
      e.preventDefault();
      var file = e.target.files[0];
      this.file_name = file.name;
      var url = URL.createObjectURL(file);
      this.avatar_url = url;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.world_name = document.querySelector(
        'input[name="world_name"]'
      ).value;
      this.avatar = document.querySelector('input[name="avatar"]').files[0];
      this.fileToBlobUrl(this.avatar);
      this.world_id = this.generateUniqueID();
      this.uploadFile(this.avatar).then((el) => {
        console.log(el);
        //alert("Votre monde a bien été créé");
        this.avatar_url =
          "https://mvvjayzmcsvyidvhaiit.supabase.co/storage/v1/object/public/" +
          el.Key;
        this.updateDB(this.world_id, this.world_name, this.avatar_url);
      });
    },
    generateUniqueID() {
      return Math.floor(Math.random() * Math.pow(2, 32));
    },
    getAvatarUrl(File) {
      const supabaseUrl = "https://mvvjayzmcsvyidvhaiit.supabase.co";
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTY2NjEyNiwiZXhwIjoxOTQxMjQyMTI2fQ.fVZ-1mozqnbegLluTAaiMPXXER4HexiPcV9GtA_PBTA";
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { publicURL, error } = supabase.storage
        .from("world-assets")
        .getPublicUrl("worlds/" + File.name);
      if (error) {
        throw error;
      }
      return publicURL;
    },
    async uploadFile(File) {
      const { data, error } = await this.$supabase.storage
        .from("world-assets")
        .upload("public/" + File.name, File, {
          cacheControl: 3600,
          upsert: false,
        });

      return data;

      if (error) {
        alert("Une erreur est survenue lors de l'upload du fichier");
        console.log(error);
        throw error;
      }
    },
    async updateDB() {
      let formData = {
        world_id: this.world_id,
        world_name: this.world_name,
        world_profile: this.avatar_url,
        world_artists: this.$store.state.spotify.artists_list,
        user_id: this.$store.state.spotify.user_profile,
      };
      console.log("This is the data i went to send ", formData);

      const { data, error } = await this.$supabase
        .from("Worlds")
        .insert([formData]);

      if (error) {
        alert("Une erreur est survenue lors de l'update de la base de données");
        console.log(error);
        throw error;
      }
    },
    async getPublicUrl(link) {
      let publicURL =
        "https://mvvjayzmcsvyidvhaiit.supabase.co/storage/v1/object/public/" +
        link;
      console.log(link, "this is the link");

      return publicURL;
    },
    renameFileO(file, newName) {
      var file = new File([e.target.result], newName, { type: file.type });
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-family: map-get(
    $map: $typography-font-family,
    $key: "font-family-title"
  );
  max-width: 1000px;
  margin: auto;
  margin-bottom: 100px;
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
.card {
  transition: 300ms;
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
  cursor: pointer;
  margin-bottom: 60px;
  font-family: map-get($map: $typography-font-family, $key: "font-family-text");
}
picture {
  width: 100px;
  height: 100px;
  display: block;
  overflow: hidden;
  border-radius: 200px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
form {
  display: flex;
  flex-direction: column;
  margin-bottom: 160px;
  input,
  label {
    display: flex;
    align-items: center;
    width: 422px;
    height: fit-content;
    background-color: white;
    margin: auto;
    border: none;
    padding: 16px;
    outline: none;
    margin-bottom: 16px;
    color: map-get($map: $colors, $key:"black-text");
    font-size: 16px;
        font-family: map-get(
      $map: $typography-font-family,
      $key: "font-family-text"
    );
  }
  input[type="file"] {
    display: none;
  }
  button{
        width: fit-content;
    margin: auto;
    margin-top: 30px;
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
  }
}
.card-form {
  margin: auto;
  padding: 16px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
}
</style>