const express = require('express');
require('dotenv').config();

// 1. Import metrics and routes first
const { client, requestCounter, requestDuration } = require('./metrics');
const leaderboardRoutes = require('./routes/leaderboard');

// 2. Initialize the app object
const app = express();

// 3. Middleware (Must come after 'app' is defined)
app.use(express.json());

app.use((req, res, next) => {
  requestCounter.inc();
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end();
  });
  next();
});

// 4. Routes
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use('/api', leaderboardRoutes);

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});