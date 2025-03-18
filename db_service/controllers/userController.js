const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const { block_user } = require('./blockUser/blockUser');
const { cancel_Course } = require('./cancelCourse.js/cancel_Course');
const { create_Course } = require('./createCourse.js/create_Course');
const { finish_Course } = require('./finishCourse.js/finish_Course');
const { get_driver_Info } = require('./getDriverInfo/getDriverInfo');
const { get_Users_Courses } = require('./getUsersCourses/getUsersCourses');


// Get user info
const getUserInfo = async (req, res) => {
  const { phone_number } = req.user;

  try {
    console.log("getting user info ::");

    const userResult = await pool.query('SELECT phone_number, first_name, last_name, user_type, id FROM users WHERE phone_number = $1', [phone_number]);

    if (userResult.rowCount === 0) {
      if (!res.headersSent) return res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = userResult.rows[0];
    console.log(user);

    if (user.user_type === 'driver') {
      console.log("checking user type");

      const carResult = await pool.query('SELECT matricule_number, permis_number, cin_number, email, car_marque, car_model FROM cars WHERE driver_id = $1', [user.phone_number]);

      const car = carResult.rows[0] || {};

      if (!res.headersSent) {
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
      }
      console.log("sending car model");
    } else {
      console.log("error theni hetha");
      if (!res.headersSent) {
        res.json({
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number
        });
      }
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
  get_Users_Courses(req, res);
};

const blockDriver = async (req, res) => {
  block_user(req, res);
};

// Function to get driver info (only admin can call this)
const getDriverInfo = async (req, res) => {
  get_driver_Info(req, res);
};


const storeCourse = async (req, res) => {
    console.log(" iam storing course data :", req.body);
    create_Course(req.body, res);
}


const finishCourse = async (req, res) => {
  finish_Course(req.body, res);
};

const cancelCourse = async (req, res) => {
  cancel_Course(req.body, res);
};
  

module.exports = {
  cancelCourse,
  getUserInfo,
  updateUser,
  getUserCourses,
  allUserInfos,
  blockDriver,
  getDriverInfo,
  storeCourse,
  finishCourse,
};
