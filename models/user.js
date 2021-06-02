class User {
  constructor(id, googleUserId, name, mail, role, profile, members) {
    this.id = id;
    this.googleUserId = googleUserId;
    this.name = name;
    this.mail = mail;
    this.role = role;
    this.profile = profile;
    this.members = members;    
  }
}

module.exports = User;