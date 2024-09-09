-- Insert fake users
INSERT INTO users (username, email)
VALUES 
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('alice_wonder', 'alice.wonder@example.com'),
('bob_builder', 'bob.builder@example.com'),
('charlie_brown', 'charlie.brown@example.com');

-- Insert fake submissions
INSERT INTO submissions (userId, content)
VALUES
(1, 'This is the first submission by John Doe.'),
(2, 'Jane Smith submission content here.'),
(3, 'Alice Wonder amazing submission.'),
(4, 'Bob Builder shares his thoughts.'),
(5, 'Charlie Brown submission is about peanuts.');

-- Insert fake reviews
INSERT INTO reviews (userId, submissionId, content)
VALUES
(2, 1, 'Jane Smith reviews John Doe submission.'),
(3, 2, 'Alice Wonder reviews Jane Smith submission.'),
(4, 3, 'Bob Builder reviews Alice Wonder submission.'),
(5, 4, 'Charlie Brown reviews Bob Builder submission.'),
(1, 5, 'John Doe reviews Charlie Brown submission.');