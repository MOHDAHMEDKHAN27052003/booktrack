export function saveUser(user) {
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  existingUsers.push(user);
  localStorage.setItem('users', JSON.stringify(existingUsers));
};

export function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
};

export function findEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export function matchPassword(email, password) {
  const user = findEmail(email);
  if (user && user.password === password) return user;
  return null;
};