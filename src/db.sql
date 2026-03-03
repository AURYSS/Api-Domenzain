CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    lastname VARCHAR
);

CREATE TABLE IF NOT EXISTS task(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    priority INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users(name, lastname) VALUES('John', 'Olvera');
INSERT INTO users(name, lastname) VALUES('Jen', 'Olvera');