const express = require('express');

const {
  submitScore,
  getLeaderboard,
  getRank
} = require('../controllers/leaderboardController');

const router = express.Router();

router.post('/score', submitScore);

router.get('/leaderboard', getLeaderboard);

router.get('/rank/:userId', getRank);

module.exports = router;