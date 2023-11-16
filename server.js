const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Replace with your Supabase credentials
const supabaseUrl = 'https://qcmamloppghscunvukxc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query Supabase to check if the user exists
    const { data, error } = await supabase
      .from('users')
      .select('username, password')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      throw error;
    }

    // If user exists, send success response, else send error response
    if (data) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
