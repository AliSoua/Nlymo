const pool = require('../../config/database');

const block_user = async (req , res) => {
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
}

module.exports = {
    block_user
}