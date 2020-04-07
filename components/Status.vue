<template>
  <div>{{ typers }}</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "status",

  computed: mapState({
    typers: state => {
      const arr = [...state.typers];
      if (arr.length === 0) return "";
      switch (arr.length) {
        case 1:
          return `${arr[0]} is typing`;
        case 2:
          return `${arr[0]}, ${arr[1]} are typing`;
      }
      return `${arr.length} users are typing`;
    }
  })
};
</script>

<style scoped>
div {
  margin-top: 10px;
  margin-bottom: 8px;
}
</style>
