<template>
  <div class="chat-wrapper">
    <div class="chat-chat" ref="block">
      <Message
        v-for="(message, idx) in messages"
        :key="message.text + idx"
        :name="message.name"
        :text="message.text"
        :owner="message.id === user.id"
        :date="message.date"
      >
      </Message>
    </div>
    <Status class="chat-status"></Status>
    <div class="chat-form">
      <ChatForm></ChatForm>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Message from "@/components/Message";
import ChatForm from "../components/ChatForm";
import Status from "../components/Status";
export default {
  name: "chat.vue",
  components: {
    Message,
    ChatForm,
    Status
  },
  computed: mapState(["user", "messages", "typers"]),
  middleware: ["chat"],
  watch: {
    messages() {
      this.$nextTick(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      });
    }
  },
  head() {
    return {
      title: `Room ${this.user.room}`
    };
  }
};
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.chat-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
  background: #212121;
}
.chat-status {
  position: absolute;
  bottom: 65px;
  padding: 0.5rem;
}

.chat-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>
