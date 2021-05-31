class Task {
  constructor(id, name, userId, status, timeCreated, members, description) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.status = status;
    this.timeCreated = timeCreated;
    this.members = members;
    this.description = description;
  }
}

module.exports = Task;
