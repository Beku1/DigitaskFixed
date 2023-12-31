const express = require('express');
const cors = require('cors');
const path = require('path');
const expressSession = require('express-session');
const app = express();
const http = require('http').createServer(app);

// SESSION SETUP
const session = expressSession({
  secret: 'coding is amazing',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

// EXPRESS APP CONFIG FOR PUBLIC FLOW
app.use(express.json());
app.use(session);
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}
// ROUTE IMPORTS
const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const boardRoutes = require('./api/board/board.routes');
const { connectSockets } = require('./services/socket.service');

// ROUTES
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware');
app.all('*', setupAsyncLocalStorage);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/board', boardRoutes);
connectSockets(http, session);

// SERVER SIDE ROUTE
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//  PORT
const logger = require('./services/logger.service');
const port = process.env.PORT || 3000;
http.listen(port, () => {
  logger.info('Server is running on port: ' + port);
});
