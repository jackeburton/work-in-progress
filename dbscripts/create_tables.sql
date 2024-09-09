CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id),
    submissionId INT REFERENCES submissions(id),
    content TEXT
);