const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

let courses = [
    {
        name: 'Course 1',
        content: {
            textFile: 'https://drive.google.com/uc?id=YOUR_TEXT_FILE_ID&export=download',
            videoFile: 'https://drive.google.com/uc?id=YOUR_VIDEO_FILE_ID&export=download'
        },
        visible: false
    }
];

app.get('/courses', (req, res) => {
    res.json({ courses: courses.filter(course => course.visible) });
});

app.post('/toggle-course', (req, res) => {
    const { courseName, action } = req.body;
    courses = courses.map(course => {
        if (course.name === courseName) {
            return { ...course, visible: action === 'show' };
        }
        return course;
    });
    res.json({ success: true, courses });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:3000`);
});
