class Task {
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
    date,
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
    this.date = date;
  }
}

module.exports = Task;
