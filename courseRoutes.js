router.post('/courses', async (req, res) => {
  const { name, description, major, max_capacity } = req.body;

  if (!name || !description || !major || !max_capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO course (name, description, major, max_capacity) 
       VALUES ($1, $2, $3, $4) RETURNING *`, 
      [name, description, major, max_capacity]
    );

    res.status(201).json(result.rows[0]); // Return the created course
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
