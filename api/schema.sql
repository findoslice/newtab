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