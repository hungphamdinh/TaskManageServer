class TaskDetail {
  constructor(
    id,
    name,
    userId,
    status,
    timeCreated,
    timeStart,
    timeEnd,
    members,
    description,
    isAdmin,
    comments,
    subTasks,
  ) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.status = status;
    this.timeCreated = timeCreated;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.members = members;
    this.description = description;
    this.isAdmin = isAdmin;
    this.comments = comments;
    this.subTasks = subTasks;

  }
}

module.exports = TaskDetail;
