interface User {
  username: string;
  firstName: string;
  lastName: string;
  password_hash: string;
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR";
  phoneNumber: string;
  office?: string;
  last_login?: Date;
}

export { User };
