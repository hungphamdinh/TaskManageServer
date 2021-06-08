class Comment {
  constructor(
    id,
    message,
    taskId,
    timeCreated,
    image,
    file,
    user,
  ) {
    this.id = id;
    this.message = message;
    this.taskId = taskId;
    this.timeCreated = timeCreated;
    this.image = image,
    this.file = file
    this.user = user
  }
}

module.exports = Comment;
