class Comment {
  constructor(
    id,
    name,
    taskId,
    timeCreated,
  ) {
    this.id = id;
    this.name = name;
    this.taskId = taskId;
    this.timeCreated = timeCreated;
  }
}

module.exports = Comment;
