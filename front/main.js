const usersList = document.getElementById('users');
const addBtn = document.getElementById('addBtn');

async function fetchUsers() {
  const res = await fetch('http://localhost:5001/api/users');
  const data = await res.json();
  usersList.innerHTML = '';
  data.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.name} (${u.email})`;
    usersList.appendChild(li);
  });
}

addBtn.addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  await fetch('http://localhost:5001/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  fetchUsers();
});

fetchUsers();
