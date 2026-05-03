# Distributed Realtime Leaderboard System

A production-inspired distributed backend system that demonstrates how modern high-scale applications handle realtime ranking, asynchronous processing, caching, persistence, recovery, monitoring, and heavy traffic.

This project was built as a hands-on systems engineering learning experience to simulate real-world architectural challenges commonly seen in:

* Gaming platforms
* Social media feeds
* Live analytics systems
* Competitive ranking systems
* High-traffic APIs
* Realtime dashboards

The system is intentionally designed to expose practical backend engineering concepts such as:

* Redis caching
* Distributed queues
* Worker-based processing
* Fault tolerance
* Recovery systems
* Observability
* Load testing
* Container orchestration
* Infrastructure monitoring

---

# 🧠 System Architecture

```text
                ┌──────────────┐
                │    Client    │
                └──────┬───────┘
                       │
                       ▼
               ┌──────────────┐
               │     API      │
               └──────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌──────────────┐           ┌────────────────┐
│    Redis     │           │     BullMQ     │
│ Leaderboard  │           │     Queue      │
└──────┬───────┘           └──────┬─────────┘
       │                           │
       │                           ▼
       │                  ┌────────────────┐
       │                  │     Worker     │
       │                  └──────┬─────────┘
       │                         │
       ▼                         ▼
                ┌────────────────────────┐
                │      PostgreSQL        │
                │ Durable Source of Truth│
                └────────────────────────┘


                ┌────────────────────────┐
                │      Prometheus        │
                └──────────┬─────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │        Grafana         │
                └────────────────────────┘
```

---

![Architecture Diagram](./img/architecture-diagram.png)

# 🔥 Key Features

## ✅ Realtime Leaderboard

Uses Redis Sorted Sets (`ZADD`, `ZRANGE`, `ZREVRANK`) for ultra-fast ranking operations.

---

## ✅ Asynchronous Persistence

Incoming score submissions are processed asynchronously using BullMQ workers.

This prevents slow database operations from blocking API performance.

---

## ✅ Durable Data Storage

All scores are permanently stored in PostgreSQL.

Redis acts as the high-speed realtime layer while PostgreSQL acts as the durable source of truth.

---

## ✅ Queue-Based Architecture

Heavy write traffic is absorbed using Redis-backed BullMQ queues.

This allows the API to remain responsive under load.

---

## ✅ Recovery System

The system can fully rebuild Redis state from PostgreSQL after Redis crashes or data loss.

---

## ✅ Dockerized Infrastructure

All services run inside isolated Docker containers:

* API
* Worker
* Redis
* PostgreSQL
* Prometheus
* Grafana

---

## ✅ Load Testing

Traffic spikes are simulated using k6.

---

## ✅ Observability & Monitoring

Prometheus scrapes system metrics while Grafana visualizes:

* CPU usage
* Memory usage
* Request throughput
* Request duration

---

# 🛠️ Tech Stack

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Node.js        | Backend runtime               |
| Express.js     | API framework                 |
| Redis          | Realtime leaderboard & queues |
| BullMQ         | Queue processing              |
| PostgreSQL     | Persistent storage            |
| Docker         | Containerization              |
| Docker Compose | Multi-service orchestration   |
| Prometheus     | Metrics collection            |
| Grafana        | Monitoring dashboards         |
| k6             | Load testing                  |

---

# 📁 Project Structure

```text
leaderboard-system/
│
├── api/
│   ├── index.js
│   ├── metrics.js
│   ├── redis.js
│   ├── db.js
│   ├── queue.js
│   ├── package.json
│   └── Dockerfile
│
├── worker/
│   ├── worker.js
│   ├── package.json
│   └── Dockerfile
│
├── loadtest.js
├── rebuildRedis.js
├── docker-compose.yml
├── prometheus.yml
└── README.md
```

---

# ⚙️ How the System Works

## 1. Score Submission

Client submits:

```json
{
  "userId": "samuel",
  "score": 950
}
```

The API:

1. Updates Redis leaderboard instantly
2. Pushes a job into BullMQ queue
3. Returns response immediately

---

## 2. Queue Processing

BullMQ worker consumes jobs asynchronously.

The worker:

1. Reads queued jobs
2. Persists scores into PostgreSQL
3. Logs processing events

---

## 3. Leaderboard Retrieval

Leaderboard endpoints query Redis Sorted Sets directly for extremely fast ranking operations.

---

## 4. Failure Recovery

If Redis crashes:

1. PostgreSQL still contains permanent data
2. `rebuildRedis.js` reconstructs leaderboard state
3. System recovers automatically

---

# 🚀 Getting Started

# Prerequisites

Install:

* Docker Desktop
* Node.js (optional for local development)
* Git

---

# 📥 Clone Repository

```bash
git clone https://github.com/yourusername/distributed-leaderboard-system.git

cd distributed-leaderboard-system
```

---

# 🐳 Run the Entire System

```bash
docker compose up --build
```

This starts:

* API server
* Worker
* Redis
* PostgreSQL
* Prometheus
* Grafana

---

# 🔍 Verify Running Containers

```bash
docker ps
```

Expected containers:

* api
* worker
* redis
* postgres
* prometheus
* grafana

---

# 🌐 Service URLs

| Service    | URL                                            |
| ---------- | ---------------------------------------------- |
| API        | [http://localhost:5000](http://localhost:5000) |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Grafana    | [http://localhost:3000](http://localhost:3000) |
| Redis      | localhost:6379                                 |
| PostgreSQL | localhost:5432                                 |

---

# 📡 API Endpoints

# Submit Score

## POST `/api/score`

### Request

```json
{
  "userId": "samuel",
  "score": 900
}
```

### Response

```json
{
  "success": true,
  "message": "Score submitted instantly"
}
```

---

# Get Leaderboard

## GET `/api/leaderboard`

### Response

```json
[
  {
    "userId": "samuel",
    "score": "900"
  }
]
```

---

# Get User Rank

## GET `/api/rank/:userId`

### Example

```bash
GET /api/rank/samuel
```

### Response

```json
{
  "userId": "samuel",
  "rank": 1
}
```

---

# 📈 Monitoring & Observability

# Prometheus

Prometheus scrapes metrics from:

```text
http://api:5000/metrics
```

---

# Grafana

Default login:

```text
username: admin
password: admin
```

---

# Recommended Grafana Queries

## CPU Usage

```promql
rate(process_cpu_user_seconds_total[1m])
```

---

## Memory Usage

```promql
nodejs_heap_size_used_bytes
```

---

## Request Rate

```promql
rate(http_requests_total[1m])
```

---

## Average Request Duration

```promql
rate(http_request_duration_seconds_sum[1m])
/
rate(http_request_duration_seconds_count[1m])
```

---

# 🚦 Load Testing

This project uses k6 to simulate heavy traffic.

---

# Install k6

## Windows

```bash
winget install k6
```

---

# Run Load Test

```bash
k6 run --vus 100 --duration 30s loadtest.js
```

---

# What to Observe During Load Testing

* API responsiveness
* Queue growth
* Worker throughput
* Redis speed
* CPU spikes
* Memory fluctuations
* Request latency

---

# 🔥 Redis Recovery System

This project includes a disaster recovery mechanism.

---

# Simulate Redis Failure

```bash
docker exec -it redis redis-cli
```

Inside Redis:

```bash
FLUSHALL
```

Leaderboard becomes empty.

---

# Rebuild Redis State

```bash
node rebuildRedis.js
```

This reconstructs the leaderboard from PostgreSQL.

---

# 🧪 Engineering Concepts Demonstrated

| Concept                   | Description                     |
| ------------------------- | ------------------------------- |
| Distributed Systems       | Multiple communicating services |
| Queue Architecture        | Async job processing            |
| Redis Sorted Sets         | High-speed rankings             |
| Fault Tolerance           | Recovery from Redis failure     |
| Observability             | Metrics and monitoring          |
| Load Testing              | Simulating heavy traffic        |
| Containerization          | Dockerized infrastructure       |
| Persistence               | Durable PostgreSQL storage      |
| Infrastructure Monitoring | Prometheus + Grafana            |

---

# 📚 What I Learned Building This

This project was built to gain hands-on experience with:

* Realtime systems
* Distributed architecture
* High-performance backend engineering
* Infrastructure design
* Queue systems
* Redis internals
* Observability pipelines
* Docker networking
* Monitoring and metrics
* Failure recovery patterns

---

# 🚀 Possible Future Improvements

Potential production-grade enhancements:

* Horizontal scaling
* Redis clustering
* PostgreSQL replication
* Dead-letter queues
* Retry strategies
* Rate limiting
* Authentication & authorization
* CI/CD pipelines
* Kubernetes deployment
* Redis persistence tuning
* Alerting systems
* Distributed tracing

---


# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to fork the project and submit pull requests.


# 👨‍💻 Author

Samuel Happiness

Passionate software engineer focused on:

* Backend engineering
* Distributed systems
* DevOps
* Cloud infrastructure
* Observability
* Scalable architectures

---

# ⭐ If You Found This Useful

Give the repository a star and share it with others interested in:

* Redis
* Distributed systems
* System design
* Backend engineering
* DevOps
* Monitoring
* High-performance architectures
