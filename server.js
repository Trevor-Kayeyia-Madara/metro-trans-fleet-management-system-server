const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Replace with your Supabase credentials
const supabaseUrl = 'https://qcmamloppghscunvukxc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbWFtbG9wcGdoc2N1bnZ1a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA3OTU0OTYsImV4cCI6MjAwNjM3MTQ5Nn0.ijDUlw8KCYvr-C1_qyuizuqeEUaMamAmfw2BQizmrzk'
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
      .from('Users')
      .select('UserName, UserPassword')
      .eq('UserName', username)
      .eq('UserPassword', password)
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
// Route to get UserRole for a specific UserID
app.get('/userrole/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Query Supabase to get UserRole for the specified UserID
      const { data, error } = await supabase
        .from('UserRoles')
        .select('UserID, UserRole')
        .eq('UserID', userId)
        .single();
  
      if (error) {
        throw error;
      }
  
      // If data is found, send the UserRole, else send an error response
      if (data) {
        res.json({ userRole: data.role });
      } else {
        res.status(404).json({ error: 'UserRole not found for the specified UserID' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
