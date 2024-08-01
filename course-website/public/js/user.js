const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const loginPage = document.getElementById('login-page');
const coursePage = document.getElementById('course-page');
const userNameSpan = document.getElementById('user-name');
const courseList = document.getElementById('course-list');
const logoutButton = document.getElementById('logout');
const courseContent = document.getElementById('course-content');
const textFileDiv = document.getElementById('text-file');
const videoFile = document.getElementById('video-file');
const backButton = document.getElementById('back');

let currentUser = null;

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            loginPage.style.display = 'none';
            coursePage.style.display = 'block';
            userNameSpan.textContent = username;
            fetchCourses();
        } else {
            loginMessage.textContent = 'Invalid username or password.';
        }
    });
});

logoutButton.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = null;
            loginPage.style.display = 'block';
            coursePage.style.display = 'none';
        }
    });
});

backButton.addEventListener('click', () => {
    courseContent.style.display = 'none';
    courseList.style.display = 'block';
});

function fetchCourses() {
    fetch('/courses')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            courseList.innerHTML = '';
            data.courses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.textContent = course.name;
                courseItem.style.cursor = 'pointer';
                courseItem.addEventListener('click', () => {
                    fetch(`/course/${course.name}`)
                    .then(response => response.json())
                    .then(courseData => {
                        textFileDiv.innerHTML = `<iframe src="${courseData.content.textFile}" style="width:100%; height:400px;" frameborder="0"></iframe>`;
                        videoFile.src = courseData.content.videoFile;
                        courseList.style.display = 'none';
                        courseContent.style.display = 'block';
                    });
                });
                courseList.appendChild(courseItem);
            });
        }
    });
}
