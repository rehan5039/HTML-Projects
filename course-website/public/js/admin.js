const userList = document.getElementById('user-list');

// Fetch users and courses from the server
fetch('/admin-data')
    .then(response => response.json())
    .then(data => {
        const { users, courses } = data;
        displayUsers(users, courses);
    });

function displayUsers(users, courses) {
    userList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        const userTitle = document.createElement('h3');
        userTitle.textContent = user.username;
        userDiv.appendChild(userTitle);

        courses.forEach(course => {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = user.allowedCourses.includes(course) ? `Hide ${course}` : `Show ${course}`;

            toggleButton.addEventListener('click', () => {
                const action = user.allowedCourses.includes(course) ? 'hide' : 'show';
                fetch('/toggle-course', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: user.username, course, action })
                })
                .then(response => response.json())
                .then(updatedUsers => {
                    displayUsers(updatedUsers, courses);
                });
            });

            userDiv.appendChild(toggleButton);
        });

        userList.appendChild(userDiv);
    });
}
