import express from 'express';
import auth from '../../middleware/auth.mjs';
import User from '../../models/User.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { check, validationResult } from "express-validator";


dotenv.config();
const router = express.Router();

// @route:   GET api/auth
// @desc:    Auth route/Get user info if signed in
// @access:  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route:   POST api/auth
// @desc:    Login Route
// @access:  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password Required').not().isEmpty(),
  ],
  async (req, res) => {
    //Run our validation 'checks' on the request body
    const errors = validationResult(req);

    //if there are errors, respond with errors
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      //Check if user is in DB
      let user = await User.findOne({ email });

      //   If user does not exist return with error message
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Checking if password entered matches the users password, returns a bool
      const isMatch = await bcrypt.compare(password, user.password);

      //   If passwords don't match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //Create payload (data for the front end)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 }, //optional options object
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

export default router;
