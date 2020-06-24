<template>
  <div>
    <div class="bg-pink-200 text-black flex justify-between">
      <p>{{ username }}</p>
      <p>welcome to room {{ room.forumName }}</p>
      <div>
        <input
          type="file"
          ref="file"
          id="filer-uploader"
          v-on:change="uploadContent"
          style="display:none"
        />
        <label
          class="bg-green-400 px-4 py-3 m-5 text-white"
          for="filer-uploader"
        >
          Upload
        </label>
      </div>
    </div>
    <div class="msgBody" ref="msgBody">
      <ul>
        <template v-if="!chatter">
          no message yet
        </template>
        <template v-else>
          <div v-for="(msg, index) in chat" v-bind:key="index">
            <template v-if="msg.createdBy.username === username">
              <div class="bg-green-300 text-red-400 p-4 mb-4">
                <p class="flex justify-end">Me</p>
                <template v-if="msg.contentTypeText === 'text'">
                  <li class="flex justify-end">
                    {{ msg.messageBody }}
                    <template v-if="!msg.hidden">
                      <span>&#x2713;</span>
                    </template>
                    <template v-else>
                      <span>&#x25A0;</span>
                    </template>
                  </li>
                </template>

                <template v-if="msg.contentTypeText === 'image'">
                  <div class="flex justify-end">
                    <img class="w-1/5" v-bind:src="msg.messageBody" />
                    <template v-if="!msg.hidden">
                      <span>&#x2713;</span>
                    </template>
                    <template v-else>
                      <span>&#x25A0;</span>
                    </template>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="bg-yellow-300 text-white p-4 mb-4">
                <p>{{ msg.createdBy.username }}</p>
                <template v-if="msg.contentTypeText === 'text'">
                  <li>{{ msg.messageBody }}</li>
                </template>

                <template v-if="msg.contentTypeText === 'image'">
                  <div>
                    <img class="w-1/5" v-bind:src="msg.messageBody" />
                  </div>
                </template>
              </div>
            </template>
          </div>
        </template>
      </ul>
    </div>
    <div>
      <div class="chatBox flex w-full px-2 bg-gray-400 p-5">
        <input
          type="text"
          class="border border-red-200 w-4/5 pl-3"
          placeholder="message"
          v-model="my_msg"
        />
        <button
          @click="textSender()"
          class="bg-green-500 text-white rounded px-10 py-5 w-1/5"
        >
          Send
        </button>
      </div>
    </div>
    <div v-if="filer != ''" class="filerUploader bg-white">
      <template>
        <div>
          <img class="w-1/5" v-bind:src="filer" />
        </div>
        <div>
          <button @click="imageUploader()" class="bg-yellow-900">upload</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      room: "",
      username: "",
      my_msg: "",
      chat: [],
      file: "",
      filer: "",
      contentTypeText: "text",
      chatter: false
    };
  },
  methods: {
    scroller() {
      // this is to auto scroll down to the last message
      const objDiv = this.$refs["msgBody"];
      var counter = 0;
      var id = setInterval(scrolling, 500);
      function scrolling() {
        if (counter === 3) {
          clearInterval(id);
        } else {
          counter++;
          console.log(objDiv.scrollTop, objDiv.scrollHeight);
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }
    },
    sender() {
      console.log(this.chat.length);
      this.chat.push({
        createdBy: { username: this.username },
        schoolId: "5dd58d1bff3e6f3fd92b6811",
        contentTypeText: this.contentTypeText,
        userGroupId: this.room.userGroupId,
        messageBody: this.my_msg,
        messageIndex: this.chat.length,
        hidden: true
      });

      // to scroll the div(chat message) to the bottom
      this.scroller();
      axios
        .post(
          `${this.$endpoint}/api/forum-message/send`,
          {
            createdBy: { username: this.username },
            schoolId: "5dd58d1bff3e6f3fd92b6811",
            contentTypeText: this.contentTypeText,
            userGroupId: this.room.userGroupId,
            messageBody: this.my_msg,
            messageIndex: this.chat.length - 1,
            hidden: false
          },
          {
            headers: {
              authorization: `Bearer ${this.$token}`
            }
          }
        )
        .then(response => {
          this.chat[response.data.response.messageIndex].hidden = false;
          console.log(response.data.response.messageIndex);
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });

      this.my_msg = "";
    },
    uploadContent(e) {
      this.file = this.$refs.file.files[0];
      this.filer = URL.createObjectURL(this.file);
    },
    textSender() {
      this.contentTypeText = "text";
      this.sender();
    },
    imageUploader() {
      let formData = new FormData();
      formData.append("folder", "forum/testing");
      formData.append("file", this.file);
      axios
        .post(
          "https://7bdjcki5zg.execute-api.eu-west-2.amazonaws.com/dev/api/file/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-api-key": "76fBfauPMOymE9RQkbjV7J2NFdb1B2y5Xyu1rmwe"
            }
          }
        )
        .then(response => {
          const data = response.data.response[0];
          console.log(data);
          this.my_msg = data.fileLink;
          this.contentTypeText = data.fileType;
          this.sender();
        })
        .catch(error => {
          alert("failed to upload");
          console.log(error.response);
        });
      this.filer = "";
    }
  },
  mounted() {
    if (!this.$session.has("username")) {
      this.router.push("/login");
    }
    this.username = this.$session.get("username");
    this.room = this.$session.get("room");
    console.log(this.room);
    const userGroupId = this.room.userGroupId;
    axios
      .get(
        `${this.$endpoint}/api/forum-message/view-by-usergroup/${userGroupId}`,
        {
          headers: {
            authorization: `Bearer ${this.$token}`
          }
        }
      )
      .then(response => {
        console.log(response);
        const data = response.data.response;
        this.chat = data;
        this.chatter = true;

        // to scroll the div(chat message) to the bottom
        this.scroller();
      })
      .catch(error => {
        console.log(error.response);
      });

    const mdt = ["chat1", "chat2"]; // I can loop through this room and subscribe to them

    this.sockets.roomer.subscribe(this.room.userGroupId, data => {
      if (data.createdBy.username != this.username) {
        this.chat.push(data);
        this.scroller();
      }
    });
  },
  sockets: {
    roomer: {} //room channel;
  }
};
</script>

<style>
.chatBox {
  position: absolute;
  margin-bottom: 5px;
  margin-top: 10px;
  height: 20vh;
  bottom: 0px;
}
.filerUploader {
  position: absolute;
  top: 0%;
  left: 0%;
}
.msgBody {
  height: 75vh;
  overflow: scroll;
}
</style>
