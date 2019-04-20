CREATE TABLE background_images (
    id SERIAL PRIMARY KEY,
    url varchar(255),
    description text NOT NULL,
    photographer varchar(255),
    photographer_url text
);