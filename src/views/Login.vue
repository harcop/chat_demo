<template>
  <div>
    <div>
      <div>
        <input placeholder="Forum Name" v-model="forumName" />
        <button @click="createForum()">Create Forum</button>
      </div>
    </div>
    <div>
      <input type="text" placeholder="Login" v-model="username" />
      <select v-model="room">
        <option>Select Group</option>
        <option
          v-for="(forum, index) in roomList"
          v-bind:key="index"
          v-bind:value="{
            id: forum._id,
            forumName: forum.forumName,
            userGroupId: forum.userGroupId
          }"
        >
          {{ forum.forumName }}
        </option>
      </select>
      <button @click="login()" class="bg-green-500 px-4 py-2 rounded">
        Login
      </button>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      username: "",
      room: "Select Group",
      roomList: [],
      keyIndex: "",
      forumName: ""
    };
  },
  methods: {
    createForum() {
      axios
        .post(
          `${this.$endpoint}/api/forum/create-explicit`,
          {
            forumName: this.forumName,
            schoolId: "5dd58d1bff3e6f3fd92b6811"
          },
          {
            headers: {
              authorization: `Bearer ${this.$token}`
            }
          }
        )
        .then(response => {
          this.roomList.push(response.data.response);
          console.log(response.data.response);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    login() {
      console.log(this.room);
      axios
        .get(`${this.$endpoint}/api/forum/view-forum/${this.room.id}`, {
          headers: {
            authorization: `Bearer ${this.$token}`
          }
        })
        .then(respose => {
          this.$session.set("username", this.username);
          this.$session.set("room", this.room);
          this.$router.push("/forum");
          console.log(this.room);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  },
  mounted() {
    axios
      .get(`${this.$endpoint}/api/forum/view-all`)
      .then(response => {
        this.roomList = response.data.response;
        console.log(response.data.response);
      })
      .catch(error => {
        console.log(error.response);
      });
  }
};
</script>

<style></style>
