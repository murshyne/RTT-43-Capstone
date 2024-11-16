import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { check, validationResult } from "express-validator";
import User from '../../models/User.mjs';
import dotenv from 'dotenv';
  
dotenv.config()


const router = express.Router()

// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.post(
    '/', [
        check('fname', 'Name is required').not().isEmpty(),
        check('lname', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
],
async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

   const {fname, lname, email, password } = req.body;

   try {
      //Check if user is in DB
      let user = await User.findOne({ email });
      //   If user exists return with error message
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] });
      }

// Create a New User
user = new User({
    fname,
    lname,
    email,
    password,
  });

//   Password Encryption
const salt = await bcrypt.genSalt(10)

user.password = await bcrypt.hash(password,salt)

await user.save();

// Create Payload (FrontEnd Data)
const payload = {
    user: {
    id:user.id,
    },
};

jwt.sign(
    payload,
    process.env.jwtSecret,
    {expiresIn: 3600}, // Optional
    (err, token)=>{
        if (err) throw err;

       res.json({ token });
            
    
    }
);

   } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{msg: 'Server Error'}] });
    
    
   }

}
);


export default router;
