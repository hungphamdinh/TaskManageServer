class Invitation {
  constructor(id, content, title, taskId, userId, receiverId, status) {
    this.id = id;
    this.content = content;
    this.title = title;
    this.taskId = taskId;
    this.userId = userId;
    this.receiverId = receiverId;
    this.status = status; //0: pending, 1: accepted
  }
}
module.exports = Invitation;
