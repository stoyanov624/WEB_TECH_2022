CREATE DATABASE pagination_web;

-- \c todo_database

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL 
)