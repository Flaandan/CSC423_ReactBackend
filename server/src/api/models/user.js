export class User {
  #username;

  #firstName;

  #lastName;

  #passwordHash;

  #role;

  #phoneNumber;

  #office;

  #lastLogin;

  constructor(builder) {
    this.#username = builder.username;
    this.#firstName = builder.firstName;
    this.#lastName = builder.lastName;
    this.#passwordHash = builder.passwordHash || null;
    this.#role = builder.role;
    this.#phoneNumber = builder.phoneNumber;
    this.#office = builder.office || "Student Lounge";
    this.#lastLogin = builder.lastLogin;
  }

  get username() {
    return this.#username;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  get role() {
    return this.#role;
  }

  get phoneNumber() {
    return this.#phoneNumber;
  }

  get office() {
    return this.#office;
  }

  get lastLogin() {
    return this.#lastLogin;
  }

  set username(value) {
    this.#username = value;
  }

  set firstName(value) {
    this.#firstName = value;
  }

  set lastName(value) {
    this.#lastName = value;
  }

  set passwordHash(value) {
    this.#passwordHash = value;
  }

  set role(value) {
    if (["STUDENT", "ADMIN", "INSTRUCTOR"].includes(value)) {
      this.#role = value;
    } else {
      throw new Error(
        "Invaild role set for user. Must be either 'STUDENT', 'ADMIN', or 'INSTRUCTOR'",
      );
    }
  }

  set phoneNumber(value) {
    this.#phoneNumber = value;
  }

  set office(value) {
    this.#office = value;
  }

  set lastLogin(value) {
    this.#lastLogin = value;
  }

  toUserDTO() {
    return {
      username: this.#username,
      firstName: this.#firstName,
      lastName: this.#lastName,
      role: this.#role,
      phoneNumber: this.#phoneNumber,
      office: this.#office,
      lastLogin: this.#lastLogin,
    };
  }

  static get builder() {
    class UserBuilder {
      constructor() {
        this.username = "";
        this.firstName = "";
        this.lastName = "";
        this.passwordHash = "";
        this.role = "STUDENT";
        this.phoneNumber = "";
        this.office = "Student Lounge";
        this.lastLogin = "";
      }

      setUsername(username) {
        this.username = username;
        return this;
      }

      setFirstName(firstName) {
        this.firstName = firstName;
        return this;
      }

      setLastName(lastName) {
        this.lastName = lastName;
        return this;
      }

      setPasswordHash(passwordHash) {
        this.passwordHash = passwordHash;
        return this;
      }

      setRole(role) {
        if (["STUDENT", "ADMIN", "INSTRUCTOR"].includes(role)) {
          this.role = role;
        } else {
          throw new Error(
            "Invaild role set for user. Must be either 'STUDENT', 'ADMIN', or 'INSTRUCTOR'",
          );
        }
        return this;
      }

      setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
      }

      setOffice(office) {
        this.office = office;
        return this;
      }

      setLastLogin(lastLogin) {
        this.lastLogin = lastLogin;
        return this;
      }

      build() {
        if (
          !this.username ||
          !this.firstName ||
          !this.lastName ||
          !this.role ||
          !this.phoneNumber
        ) {
          throw new Error(
            "username, firstName, lastName, role, and phoneNumber are required",
          );
        }

        return new User(this);
      }
    }

    return UserBuilder;
  }
}
