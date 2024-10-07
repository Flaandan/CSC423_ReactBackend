interface User {
  username: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR";
  phone_number: string;
  office?: string;
  last_login?: Date;
}

interface UserDTO {
  username: string;
  first_name: string;
  last_name: string;
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR";
  office?: string;
}

function toUserDTO(user: User): UserDTO {
  return {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    office: user.office,
  };
}

export { User, UserDTO, toUserDTO };
