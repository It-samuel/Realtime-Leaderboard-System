import http from 'k6/http';

export default function () {

  const payload = JSON.stringify({
    userId: `user_${Math.random()}`,
    score: Math.floor(Math.random() * 100000)
  });

  http.post(
    'http://localhost:5000/api/score',

    payload,

    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}