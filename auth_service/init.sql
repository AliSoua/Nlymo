CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'driver', 'admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  driver_id TEXT REFERENCES users(phone_number) ON DELETE SET NULL,
  client_id TEXT REFERENCES users(phone_number) ON DELETE SET NULL,
  driver_rate DECIMAL(5, 2),
  client_rate DECIMAL(5, 2),
  price DECIMAL(10, 2),
  destination TEXT,
  depart TEXT,
  time_of_starting_course TIMESTAMP,
  time_of_end_course TIMESTAMP,
  dlatitude DECIMAL(9, 6),
  dlongitude DECIMAL(9, 6),
  alatitude DECIMAL(9, 6),
  alongitude DECIMAL(9, 6),
  distanceofcourse DECIMAL(10, 2),
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'ongoing', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS cars (
  matricule_number TEXT PRIMARY KEY,
  permis_number TEXT NOT NULL,
  cin_number TEXT NOT NULL,
  email TEXT NOT NULL,
  car_marque TEXT NOT NULL,
  car_model TEXT NOT NULL,
  driver_id TEXT REFERENCES users(phone_number) ON DELETE CASCADE
);
