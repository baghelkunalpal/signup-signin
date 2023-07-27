const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8081;
const users = [];
app.use(bodyparser.urlencoded({extended:true}));

// here signup process

app.post('/signup',async(req,res)=>{
    const {name, email, password} = req.body;
    try{
        const existingUser = users.find((user)=> user.email===email);
        if(existingUser){
            return res.status(409).send('The user is already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({name, email, password: hashedPassword});
        res.status(201).send('user is signup successfully');
    }
    catch(error){
        res.status(500).send('Internal server error');
    }
});
// signed in route

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = users.find((user) => user.email === email);
  
      if (!user) {
        return res.status(401).send('Invalid email or password.');
      }
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password.');
      }
  
      res.status(200).send('User signed in successfully!');
    } catch (error) {
      res.status(500).send('Internal server error.');
    }
  });

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});