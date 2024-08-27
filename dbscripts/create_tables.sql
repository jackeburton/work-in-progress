CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    content TEXT
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    submission_id INT REFERENCES submissions(id),
    content TEXT
);