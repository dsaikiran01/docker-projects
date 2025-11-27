const API_IP = "13.201.230.101"

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const resp = await fetch(`http://${API_IP}:3000/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await resp.json();
        document.getElementById('result').textContent = JSON.stringify(data);
    } catch (err) {
        document.getElementById('result').textContent = 'Error: ' + err.message;
    }
});

document.getElementById('showUsersButton').addEventListener('click', async function () {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = ''; // Clear previous content

    try {
        const resp = await fetch(`http://${API_IP}:3000/api/users`);
        const users = await resp.json();
        // console.log(users);

        users.forEach((user, index) => {
            const userDiv = document.createElement('div');
            userDiv.textContent = `Username: ${user.username}, Password: ${user.password}`;
            userDiv.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#e9e9e9';
            userDiv.style.padding = '8px';
            usersList.appendChild(userDiv);
        });
    } catch (err) {
        usersList.textContent = 'Error fetching users: ' + err.message;
    }
});