// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const posts = require('./posts');

const app = express();
const secretText = 'thisIsSecret';

app.use(
    cors({
        origin: 'http://127.0.0.1:5500',
        methods: 'POST, GET',
    })
);

app.use(express.json());

//? 사용자 인증 라우트
app.post('/login', (req, res) => {
    const username = req.body.username;
    const accessToken = jwt.sign({ name: username }, secretText, { expiresIn: '1m' });
    res.json({ accessToken: accessToken });
});

//? 보호된 라우트
app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts);
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (authHeader === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretText, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// 서버가 4000번 포트에서 듣기를 시작합니다. 서버가 시작되면 콘솔에 메시지를 출력합니다.
const port = 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
