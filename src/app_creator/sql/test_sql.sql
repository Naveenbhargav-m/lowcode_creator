


CREATE TABLE screens (
    id SERIAL PRIMARY KEY,
    screen_name VARCHAR(255),
    tags TEXT[],
    configs JSONB
);



CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(255),
    table_name VARCHAR(255),
    fields JSONB
);


CREATE TABLE global_states (
    id SERIAL PRIMARY KEY,
    state_name TEXT,
    default_value JSONB,
    screen_name TEXT,
    screen_id int
);


CREATE TABLE tables_data (
    id SERIAL PRIMARY KEY,
    table_name TEXT,
    label TEXT,
    fields JSONB
);