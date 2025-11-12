function Info() {
  const user = JSON.parse(localStorage.getItem("ActiveUser"));
  return (
    <>
      <h2>User Information</h2>
      <ul>
        <li>ID: {user.id}</li>
        <li>Username: {user.username}</li>
        <li>Password: ******</li>
        <li>Email: {user.email}</li>
        <li>Phone: {user.phone}</li>
      </ul>
    </>
  );
}

export default Info;
