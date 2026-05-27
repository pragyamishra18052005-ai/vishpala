const KeystrokeService = {
  events: [],
  isRecording: false,
  startRecording() {
    this.events = [];
    this.isRecording = true;
    console.log('Recording started');
  },
  recordKeydown(key) {
    if (!this.isRecording) return;
    this.events.push({
      key: key,
      keydown: Date.now(),
      keyup: null,
    });
  },
    recordKeyup(key) {
     if (!this.isRecording) return;
    const event = this.events.findLast(e => e.key === key && e.keyup === null);
    if (event) {
      event.keyup = Date.now();
    }
  },

  stopRecording() {
    this.isRecording = false;
    console.log('Recording stopped', this.events);
  },
  getJSON() {
    const json = {
      user_id: "user_001",
      session_id: Date.now(),
      events: this.events.map(e => ({
        key: e.key,
        keydown: e.keydown,
        keyup: e.keyup,
        dwell: e.keyup ? e.keyup - e.keydown : null,
      })),
    };
    return json;
  },

};

export default KeystrokeService;