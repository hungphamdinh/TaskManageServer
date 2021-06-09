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



app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));