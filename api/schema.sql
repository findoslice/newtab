CREATE TABLE background_images (
    id SERIAL PRIMARY KEY,
    url varchar(255),
    description text NOT NULL,
    photographer_id int,
    FOREIGN KEY (photographer_id) REFERENCES photographers (id)
);

CREATE TABLE photographers (
    id SERIAL PRIMARY KEY,
    name varchar(255),
    url varchar(255)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    token text
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    list_heading BOOLEAN DEFAULT false,
    sublist text,
    start_date varchar(255),
    end_date varchar(255),
    user_id int,
    FOREIGN KEY (user_id) REFERENCES users (id)
);