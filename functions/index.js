const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const studentRoutes = require('./routes/student-routes');
const userRoutes = require('./routes/user-routes');
const taskRoutes = require('./routes/task-routes');
const subTaskRoutes = require('./routes/subTask-routes');
const commentRoute = require('./routes/comment-route');
const app = express();



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// app.use('/api', studentRoutes.routes);
app.use('/api', userRoutes.routes);
app.use('/api', taskRoutes.routes);
app.use('/api', subTaskRoutes.routes);
app.use('/api', commentRoute.routes);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.app = functions.https.onRequest(app);