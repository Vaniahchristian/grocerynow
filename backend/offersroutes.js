
import express from 'express';
const router = express.Router();


//offers endpoints 

export default (pool) => {
    //get offers (active by default)

    router.get('/offers', async (req, res) => {
        try {
            const includeInactive = req.query.all === 'true';
            const query = includeInactive 
                ? 'SELECT * FROM offers'
                : 'SELECT * FROM offers WHERE isActive = true';
            
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });


    //add an offer 

    router.post('/offers', async (req, res) => {
        try {
            const { title, discount, description, image, category, link, isActive } = req.body;
            const [result] = await pool.query(
                'INSERT INTO offers (title, discount, description, image, category, link, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, discount, description, image, category, link, isActive !== false]
            );
            res.json({ id: result.insertId, title, discount, description, image, category, link, isActive: isActive !== false });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });

    //update an offer 

    router.patch('/offers/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            // Build dynamic query based on provided fields
            const allowedFields = ['title', 'discount', 'description', 'image', 'category', 'link', 'isActive'];
            const fieldsToUpdate = [];
            const values = [];
            
            // Only include fields that are actually provided in the request
            for (const field of allowedFields) {
                if (updates.hasOwnProperty(field)) {
                    fieldsToUpdate.push(`${field} = ?`);
                    values.push(updates[field]);
                }
            }
            
            if (fieldsToUpdate.length === 0) {
                return res.status(400).json({ error: 'No valid fields provided for update' });
            }
            
            // Add the id to the end of values array for the WHERE clause
            values.push(id);
            
            const query = `UPDATE offers SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
            const [result] = await pool.query(query, values);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }
            
            // Fetch the updated offer to return complete data
            const [updatedOffer] = await pool.query('SELECT * FROM offers WHERE id = ?', [id]);
            res.json(updatedOffer[0]);
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });
    

    //delete an offer 

    router.delete('/offers/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM offers WHERE id = ?', [id]);
            res.json({ id });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });

    // Toggle offer status
    router.patch('/offers/:id/toggle-status', async (req, res) => {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({ error: 'isActive must be a boolean value' });
            }
            
            const [result] = await pool.query('UPDATE offers SET isActive = ? WHERE id = ?', [isActive, id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }
            
            // Fetch and return the updated offer
            const [updatedOffer] = await pool.query('SELECT * FROM offers WHERE id = ?', [id]);
            res.json(updatedOffer[0]);
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });

    return router;
}