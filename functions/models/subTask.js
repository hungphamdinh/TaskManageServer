class SubTask {
  constructor(
    id,
    name,
    parentId,
    timeCreated,
    status
  ) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.timeCreated = timeCreated;
    this.status = status; //0: inProgress , 1: done
  }
}

module.exports = SubTask;
