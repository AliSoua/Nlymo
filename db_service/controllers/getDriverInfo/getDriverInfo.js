const pool = require('../../config/database');

const get_driver_Info = async (req, res) => {
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
}

module.exports = {
    get_driver_Info
}