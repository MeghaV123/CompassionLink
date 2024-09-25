import React, { useEffect, useState } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);


  useEffect(() => {
    fetch("http://localhost:4000/admin/viewUsers")
      .then((res) => res.json())
      .then((result) => {
        setUsers(result);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [refresh]);
  const deleteUsers = (id) => {
    fetch("http://localhost:4000/admin/deleteUsers", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setRefresh((prev) => prev + 1); // Trigger a refresh
      })
      .catch((error) => {
        console.error("Error deleting state:", error);
      });
  };
  return (
    <div className="col-12">
      <div className="bg-secondary rounded h-100 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="mb-0">USERS LIST</h6>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Contact</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>

              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users are registered.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>{user.authid.email}</td>
                    <td>{user.contact}</td>
                    <td>{user.address}</td>
                    <td>
                            
                            <button
                              className="btn btn-danger ms-1" style={{ padding: "5px 20px" }}
                              onClick={() => deleteUsers(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
