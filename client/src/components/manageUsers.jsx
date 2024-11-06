import { useEffect, useState } from "react";
/*import {
  apiFetchUsers,
  apiAddUser,
  apiDeleteUser,
  apiUpdateUser,
} from "../lib/api";*/

const ManageUsersSection = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiFetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      const response = await apiAddUser(newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await apiDeleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      const response = await apiUpdateUser(id, updatedData);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, ...response.data } : user,
        ),
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button
              onClick={() =>
                handleUpdateUser(user.id, {
                  name: "Updated Name",
                  email: "updated@example.com",
                })
              }
            >
              Edit
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsersSection;
