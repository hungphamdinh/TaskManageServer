class Member {
  constructor(memberId, googleUserId, name, mail, role, profile, userId) {
    this.memberId = memberId;
    this.googleUserId = googleUserId;
    this.name = name;
    this.mail = mail;
    this.role = role;
    this.profile = profile;
    this.userId = userId; //parentId
  }
}
module.exports = Member;
