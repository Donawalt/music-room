export const state = () => ({
    access_token: null,
    user_name: null,
    user_profile: null,
    artists_list : []
})

export const mutations = {
    set(state, value){
        console.log(value);
        state.access_token = value;
    },
    addArtist(state, value) {
        state.artists_list.push(value)
    }, 
    removeArtist(state, value) {
        const removeItemAll = (arr, val) => {
            var i = 0;
            while (i < arr.length) {
              if (arr[i] === val) {
                arr.splice(i, 1);
              } else {
                ++i;
              }
            }
            return arr;
          }

        if(state.artists_list){
            removeItemAll(state.artists_list, value)
        }
    },
    addUser(state, value){
        state.user_profile = value.id;
        state.user_name = value.display_name;
    }
}