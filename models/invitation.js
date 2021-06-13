class Invitation {
  constructor(id, content, taskId, userId, receiverId, status, userName) {
    this.id = id;
    this.content = content;
    this.taskId = taskId;
    this.userId = userId;
    this.receiverId = receiverId;
    this.userName = userName;
    this.status = status; //0: pending, 1: accepted
  }
}
module.exports = Invitation;
