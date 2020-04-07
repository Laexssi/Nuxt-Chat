<template>
  <v-flex cols="12">
    <v-text-field
      label="Type message"
      outlined
      v-model="text"
      @keydown.enter="send"
      autofocus
    ></v-text-field>
  </v-flex>
</template>

<script>
export default {
  name: "ChatForm",
  data() {
    return {
      text: "",
      user: this.$store.state.user
    };
  },
  watch: {
    text: function(val) {
      val
        ? this.$socket.emit("typing", this.user)
        : this.$socket.emit("stopTyping", this.user);
    }
  },
  methods: {
    send() {
      this.$socket.emit(
        "createMessage",
        {
          text: this.text,
          id: this.$store.state.user.id
        },
        data => {
          if (typeof data === "string") {
            console.error(data);
          } else {
            this.text = "";
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.status {
  position: absolute;
  top: -10px;
  left: 0px;
}
</style>
