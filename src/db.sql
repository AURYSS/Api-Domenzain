CREATE TABLE IF NO EXISTS users(
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(400)
);

CREATE TABLE IF NO EXISTS task(
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority BOOLEAN,
    user_id SMALLINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

Insert into users(name, lastname) values('John', 'Olvera');
Insert into users(name, lastname) values('Jen', 'Olvera');