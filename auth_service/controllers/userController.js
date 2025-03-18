const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');

// Send SMS - Mock implementation
const sendSMS = async (req, res) => {
  try {
    console.log("sending sms place !!!");
    res.json({ message: 'success' });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

// Protected route
const protected = async (req, res) => {
  try {
    console.log("protectionnn!!!");
    res.json({ message: 'success', user: req.user });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

// Verify code
const verifyCode = async (req, res) => {
  const { phone_number } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);

    if (result.rowCount === 0) {
      if (!res.headersSent) return res.json({ message: 'success' });
      return;
    }

    const user = result.rows[0];
    // Use Promise.all to generate tokens concurrently
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user.phone_number),
      generateRefreshToken(user.phone_number, pool),
    ]);
    
    console.log(accessToken);
    if (!res.headersSent) {

      res.json({ message: "exist", access: accessToken, refresh: refreshToken, user });
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

// Register user and car
const register = async (req, res) => {
  const { phone_number, first_name, last_name, user_type, matricule_number, permis_number, cin_number, email, car_marque, car_model } = req.body;

  try {
    console.log("Register endpoint hit");

    const userResult = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);

    if (userResult.rowCount > 0) {
      console.log("User already registered with phone number:", phone_number);
      if (!res.headersSent) return res.status(400).json({ error: 'User already registered' });
      return;
    }

    console.log("Inserting new user into users table");

    const insertUserResult = await pool.query(
      'INSERT INTO users (phone_number, first_name, last_name, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [phone_number, first_name, last_name, user_type]
    );

    const user = insertUserResult.rows[0];
    console.log("New user inserted with ID:", user.id);

    if (user_type === 'driver') {
      console.log("User is a driver, inserting car details");
  
      await pool.query(
        'INSERT INTO cars (matricule_number, driver_id, car_marque, car_model, email, permis_number, cin_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [matricule_number, user.phone_number, car_marque, car_model, email, permis_number, cin_number]
      );

      console.log("Car details inserted successfully");
    } else {
      console.log("User is not a driver, skipping car insertion");
    }

    // Use Promise.all to generate tokens concurrently
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user.phone_number),
      generateRefreshToken(user.phone_number, pool),
    ]);

    console.log("Sending response with tokens");
    if (!res.headersSent) {
      res.json({ message: 'success', user, access: accessToken, refresh: refreshToken });
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refresh } = req.body;

  try {
    if (!refresh) {
      if (!res.headersSent) return res.status(401).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [refresh]);

    if (result.rowCount === 0) {
      if (!res.headersSent) return res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }

    const user = await jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);

    const access = generateAccessToken({ id: user.id, phone_number: user.phone_number });
    if (!res.headersSent) {
      res.json({ access });
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

const allUserInfos = async (req, res) => {
  try {
    console.log("alluserinfos");
    const result = await pool.query("SELECT * FROM users WHERE user_type = 'driver'");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving drivers:', err.message);
    res.status(500).json({ error: 'Internal server error' });

  }
};

// Update user information
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *',
      [first_name, last_name, userId]
    );

    if (result.rowCount === 0) {
      if (!res.headersSent) return res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    if (!res.headersSent) {
      res.json({ message: 'User updated successfully', user });
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

const getUserCourses = async (req, res) => {

  try {
    const { phone_number } = req.user;
    const { phone_num } = req.body; // Get phone_number from request body
    console.log(phone_num);
    console.log("getusercourses");

    if ( req.user.user_type === "admin" && phone_num){
      console.log("he is an admin");

      const result = await pool.query('SELECT * FROM courses WHERE driver_id = $1 OR client_id = $1 ORDER BY time_of_starting_course ASC', [phone_num]);

      const courses = result.rows.map(course => ({
        ...course,
        time_of_starting_course: course.time_of_starting_course
          ? adjustToUTCPlusOne(course.time_of_starting_course)
          : null,
        time_of_end_course: course.time_of_end_course
          ? adjustToUTCPlusOne(course.time_of_end_course)
          : null,
      }));
  
      if (!res.headersSent) {
        res.json({ courses });
      }
    }
    console.log("courses getting to driver");
    const result = await pool.query('SELECT * FROM courses WHERE driver_id = $1 OR client_id = $1 ORDER BY time_of_starting_course ASC', [phone_number]);

    const courses = result.rows.map(course => ({
      ...course,
      time_of_starting_course: course.time_of_starting_course
        ? adjustToUTCPlusOne(course.time_of_starting_course)
        : null,
      time_of_end_course: course.time_of_end_course
        ? adjustToUTCPlusOne(course.time_of_end_course)
        : null,
    }));

    console.log(courses);

    if (!res.headersSent) {
      res.json({ courses });
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

const blockDriver = async (req, res) => {
  const { phone_number, block } = req.body;

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET is_blocked = $1 WHERE phone_number = $2 AND user_type = \'driver\' RETURNING *',
      [block, phone_number]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'Driver not found or already in the desired state' });
    }

    res.status(200).json({ status: `Driver has been ${block ? 'unblocked' : 'blocked'}.`, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'An error occurred while updating the driver status.' });
  }
};

// Function to get driver info (only admin can call this)
const getDriverInfo = async (req, res) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  const { phone_num } = req.body; // Get phone_number from request body

  if (!phone_num) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    console.log("Fetching driver info for phone number:", phone_num);

    // Query to get driver info
    const userResult = await pool.query(
      'SELECT phone_number, first_name, last_name, user_type, id FROM users WHERE phone_number = $1 AND user_type = \'driver\'',
      [phone_num]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const user = userResult.rows[0];

    // Query to get car details if user is a driver
    const carResult = await pool.query(
      'SELECT matricule_number, permis_number, cin_number, email, car_marque, car_model FROM cars WHERE driver_id = $1',
      [phone_num]
    );

    const car = carResult.rows[0] || {};

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      matricule_number: car.matricule_number || null,
      permis_number: car.permis_number || null,
      cin_number: car.cin_number || null,
      email: car.email || null,
      car_marque: car.car_marque || null,
      car_model: car.car_model || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to adjust the date to UTC+1
const adjustToUTCPlusOne = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 2);
  return date.toISOString();
};









// Function to get user information from the database
const fetchUserInfo = async (phone_number) => {
  const result = await pool.query(
    'SELECT phone_number, first_name, last_name, user_type, id FROM users WHERE phone_number = $1',
    [phone_number]
  );
  return result;
};

// Function to fetch car details based on user type
const fetchCarDetails = async (driver_id) => {
  const carResult = await pool.query(
    'SELECT matricule_number, permis_number, cin_number, email, car_marque, car_model FROM cars WHERE driver_id = $1',
    [driver_id]
  );
  return carResult.rows[0] || {};
};

// Function to format user response
const formatUserResponse = (user, car) => {
  if (user.user_type === 'driver') {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      phone_number: user.phone_number,
      matricule_number: car.matricule_number || null,
      permis_number: car.permis_number || null,
      cin_number: car.cin_number || null,
      email: car.email || null,
      car_marque: car.car_marque || null,
      car_model: car.car_model || null,
    };
  } else {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
    };
  }
};

// Main function to get user info
const getUserInfo = async (req, res) => {
  const { phone_number } = req.user;

  try {
    console.log("getting user info ::");
    console.log(phone_number);
    const userResult = await fetchUserInfo(phone_number);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    console.log(user);
    
    if (user.user_type === 'client'){
      res.json(user);
    }

    let car = {};
    if (user.user_type === 'driver') {
      console.log("checking user type");
      car = await fetchCarDetails(user.phone_number);
      const response = formatUserResponse(user, car);
      console.log(response);
      res.json(response);
    }

  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};
















module.exports = {
  sendSMS,
  verifyCode,
  register,
  refreshToken,
  getUserInfo,
  protected,
  updateUser,
  getUserCourses,
  allUserInfos,
  blockDriver,
  getDriverInfo,
};
