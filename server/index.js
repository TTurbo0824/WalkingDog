const fs = require('fs');
const https = require('https');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const controllers = require('./controllers');
const { editProfile } = require('./controllers');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Let\'s have a safe and enjoyable walk with WalkingDog!');
});
app.post('/signup', controllers.signup);
app.post('/auth', controllers.auth);
app.post('/login', controllers.login);
app.post('/logout', controllers.logout);
app.post('/reset-password', controllers.resetPassword);
app.get('/my-data', controllers.myData);
app.post('/kakao', controllers.kakao);
app.get('/guest', controllers.guest);
app.post('/guest', controllers.guestReset);
app.get('/mainpage', controllers.mainpage);
app.get('/dogwalker', controllers.dogwalker);
app.get('/user-info', controllers.myInfo);
app.patch('/user-info', controllers.editMyInfo);
app.patch('/user-password', controllers.editPassword);
app.patch('/profile-image', editProfile.upload.single('image'), editProfile.sendPost);
app.delete('/withdrawal', controllers.withdrawal);
app.get('/request', controllers.myRequest);
app.post('/request', controllers.request);
app.delete('/request', controllers.cancelRequest);
app.get('/history', controllers.myHistory);
app.delete('/history', controllers.deleteHistory);
app.get('/rating', controllers.getRating);
app.post('/rating', controllers.rating);
app.patch('/rating', controllers.editRating);
app.delete('/rating', controllers.deleteRating);
app.get('/review', controllers.getReview);
app.post('/review', controllers.review);
app.patch('/review', controllers.editReview);
app.delete('/review', controllers.deleteReview);

const HTTPS_PORT = process.env.HTTPS_PORT || 80;

let server;

if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
  const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () => console.log(`https server running on port ${HTTPS_PORT}`));
} else {
  server = app.listen(HTTPS_PORT, () => console.log(`http server running on port ${HTTPS_PORT}`));
}

module.exports = server;
