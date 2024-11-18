import { userRoles } from "../utils/validationSchemas.js";

export class User {
  #id;
  #first_name;
  #last_name;
  #username;
  #password_hash;
  #role;
  #phone_number;
  #office;
  #last_login;

  constructor(builder) {
    this.#id = builder.id;
    this.#first_name = builder.first_name;
    this.#last_name = builder.last_name;
    this.#username = builder.username;
    this.#password_hash = builder.password_hash || "";
    this.#role = builder.role || "STUDENT";
    this.#phone_number = builder.phone_number;
    this.#office = builder.office || "Student Lounge";
    this.#last_login = builder.last_login;
  }

  get id() {
    return this.#id;
  }

  get first_name() {
    return this.#first_name;
  }

  get last_name() {
    return this.#last_name;
  }

  get username() {
    return this.#username;
  }

  get password_hash() {
    return this.#password_hash;
  }

  get role() {
    return this.#role;
  }

  get phone_number() {
    return this.#phone_number;
  }

  get office() {
    return this.#office;
  }

  get last_login() {
    return this.#last_login;
  }

  set id(value) {
    this.#id = value;
  }

  set first_name(value) {
    this.#first_name = value;
  }

  set last_name(value) {
    this.#last_name = value;
  }

  set username(value) {
    this.#username = value;
  }

  set password_hash(value) {
    this.#password_hash = value;
  }

  set role(value) {
    if (userRoles.includes(value)) {
      this.#role = value;
    } else {
      throw new Error(
        "Invalid role set for user. Must be either 'STUDENT', 'ADMIN', or 'TEACHER'",
      );
    }
  }

  set phone_number(value) {
    this.#phone_number = value;
  }

  set office(value) {
    this.#office = value;
  }

  set last_login(value) {
    this.#last_login = value;
  }

  toUserDTO() {
    return {
      id: this.#id,
      first_name: this.#first_name,
      last_name: this.#last_name,
      username: this.#username,
      role: this.#role,
      phone_number: this.#phone_number,
      office: this.#office,
      last_login: this.#last_login,
    };
  }

  static get builder() {
    class UserBuilder {
      constructor() {
        this.id = "";
        this.username = "";
        this.first_name = "";
        this.last_name = "";
        this.password_hash = "";
        this.role = "STUDENT";
        this.phone_number = "";
        this.office = "Student Lounge";
        this.last_login = "";
      }

      setId(id) {
        this.id = id;
        return this;
      }

      setUsername(username) {
        this.username = username;
        return this;
      }

      setFirstName(first_name) {
        this.first_name = first_name;
        return this;
      }

      setLastName(last_name) {
        this.last_name = last_name;
        return this;
      }

      setPasswordHash(password_hash) {
        this.password_hash = password_hash;
        return this;
      }

      setRole(role) {
        if (userRoles.includes(role)) {
          this.role = role;
        } else {
          throw new Error(
            "Invalid role set for user. Must be either 'STUDENT', 'ADMIN', or 'TEACHER'",
          );
        }
        return this;
      }

      setPhoneNumber(phone_number) {
        this.phone_number = phone_number;
        return this;
      }

      setOffice(office) {
        this.office = office;
        return this;
      }

      setLastLogin(last_login) {
        this.last_login = last_login;
        return this;
      }

      build() {
        if (
          !this.first_name ||
          !this.last_name ||
          !this.username ||
          !this.role
        ) {
          throw new Error(
            "first_name, last_name, username, and role are required",
          );
        }

        return new User(this);
      }
    }

    return UserBuilder;
  }
}
