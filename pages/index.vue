<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="6000" bottom>
          {{ messageInfo }}
          <v-btn color="pink" text @click="snackbar = false">
            Close
          </v-btn>
        </v-snackbar>
        <v-card-title>Nuxt chat</v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="room"
              :rules="roomRules"
              label="Room name"
              required
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              type="submit"
            >
              Submit
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card></v-flex
    >

    <v-list flat class="mt-3" min-width="400">
      <v-subheader>List of active rooms</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, i) in activeRooms"
          :key="i"
          @click="fillRoom(item)"
        >
          <v-list-item-content>
            <v-list-item-title
              >"{{ item }}" with
              {{ usersInRoom[item] }} users</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
import { mapState } from "vuex";
export default {
  layout: "empty",
  head: {
    title: "nuxt tutorial chat"
  },
  data: () => ({
    snackbar: false,
    activeRooms: [],
    usersInRoom: {},
    messageInfo: "",
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 16) || "Name must be less than 16 characters"
    ],
    room: "",
    roomRules: [v => !!v || "Room name is required"]
  }),
  mounted() {
    this.$socket.emit("init", () => {
      this.activeRooms = new Set(this.users.map(user => user.room));
      const hash = {};
      this.users.forEach(user => {
        if (hash[user.room]) hash[user.room]++;
        else hash[user.room] = 1;
      });
      this.usersInRoom = hash;
    });

    const { info } = this.$route.query;
    if (info === "noUser") {
      this.messageInfo = "Type name";
    } else if (info === "leftChat") {
      this.messageInfo = "You left room";
    }
    this.snackbar = !!this.messageInfo;
  },
  computed: mapState(["users"]),

  methods: {
    ...mapMutations(["setUser"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room
        };

        this.$socket.emit("userJoined", user, data => {
          if (typeof data === "string") {
            console.error(data);
          } else {
            user.id = data.userId;
            this.setUser(user);
            this.$router.push("/chat");
          }
        });
      }
    },
    message() {
      this.$socket.emit("createMessage", {
        text: "from client"
      });
    },
    fillRoom(room) {
      this.room = room;
    }
  },

  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  }
};
</script>
