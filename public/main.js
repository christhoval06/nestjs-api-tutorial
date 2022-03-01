Vue.component('alerts-component', VueSimpleNotify.VueSimpleNotify);

const app = new Vue({
  el: '#v-app',
  data: {
    title: 'Nestjs Websockets Chat',
    name: '',
    text: '',
    socket: null,
    username: '',
    text: '',
    messages: {
      general: [],
      typescript: [],
      nestjs: [],
    },
    socket: { chat: null, alerts: null },
    alerts: [],
    activeRoom: 'general',
    rooms: {
      general: false,
      typescript: false,
      nestjs: false,
    },
  },
  methods: {
    sendMessage() {
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text,
        };
        this.socket.emit('msgToServer', message);
        this.text = '';
      }
    },
    sendChatMessage() {
      if (this.isMemberOfActiveRoom) {
        this.socket.chat.emit('chatToServer', {
          sender: this.username,
          room: this.activeRoom,
          message: this.text,
        });
        this.text = '';
      } else {
        alert('You must join the room before sending messages!');
      }
    },
    receiveChatMessage(msg) {
      this.messages[msg.room].push(msg);
    },
    receiveAlertMessage(msg) {
      this.alerts.push(msg);
    },
    toggleRoomMembership() {
      console.log('toggleRoomMembership');
      if (this.isMemberOfActiveRoom) {
        this.socket.chat.emit('leaveRoom', this.activeRoom);
      } else {
        this.socket.chat.emit('joinRoom', this.activeRoom);
      }
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },
    receiveAlertMessage(msg) {
      this.alerts = [msg];
    },
  },
  computed: {
    isMemberOfActiveRoom() {
      console.log('this.activeRoom', this.activeRoom);
      console.log(this.activeRoom, this.rooms[this.activeRoom]);
      return this.rooms[this.activeRoom];
    },
  },
  created() {
    this.username = prompt('Enter your username:');

    this.socket.chat = io('http://localhost:3000/chat');
    this.socket.chat.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    });
    this.socket.chat.on('connect', () => {
      // triggers automatically when user gets connected to the server
      console.log('User gets connected ... client id:', this.socket.chat.id);
      this.toggleRoomMembership();
    });
    this.socket.chat.on('joinedRoom', (room) => {
      console.log('joinedRoom', room);
      this.rooms[room] = true;
    });
    this.socket.chat.on('leftRoom', (room) => {
      console.log('leftRoom', room);
      this.rooms[room] = false;
    });

    this.socket.alerts = io('http://localhost:3000/alerts');
    this.socket.alerts.on('alertToClient', (msg) => {
      this.receiveAlertMessage(msg);
    });
  },
});
