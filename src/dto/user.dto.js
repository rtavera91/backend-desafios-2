export default class UserDTO {
  constructor(obj) {
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.email = obj.email;
    this.password = obj.password;
    this.role = obj.role;
  }
}
