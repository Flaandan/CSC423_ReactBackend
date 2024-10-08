/**
 * @typedef {Object} UserDTO
 * @property {string} username
 * @property {string} first_name
 * @property {string} last_name
 * @property {"STUDENT" | "ADMIN" | "INSTRUCTOR"} role
 * @property {string} [office] - (optional)
 */

function toUserDTO(user) {
  return {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    office: user.office,
  };
}

export { toUserDTO };
