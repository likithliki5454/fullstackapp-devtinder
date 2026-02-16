const express = require('express');
const { validatesignupdata, validateProfile } = require('../utils/validations');
const User = require('../models/user.js');
const userAuth = require('../Middleware/authLogic.js');
const authRouter = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
// POST route - create user



authRouter.post('/signup', async (req, res) => {
    try {
        validatesignupdata(req);//written in validations.js page 
        const { firstName, lastName, emailId, password, age, skills, photoUrl } = req.body;
        const hasshedpwd = await signPWD(password)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hasshedpwd,
            age,
            skills,
            photoUrl
        });
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(400).send("ERROR" + error.message);
        // console.error("Read error:", error);
    }
});

authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            res.status(404).send('Invalid email or password');
        }
        const ispwvalid = await user.toPWD(password);
        if (ispwvalid) {
            const token = await user.getJwt();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });
            res.send(user);
        }
        else {
            return res.status(404).send({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: 'Error during login' });
    }
}); //likith added 



// authRouter.patch('/profile/edit', userAuth, async (req, res) => {
//     try {
//         validateProfile(req);
//         const loggedinuser = req.user;
//         let isUpdated = false;
//         Object.keys(req.body).forEach((data) => {
//             const newValue = req.body[data];
//             const oldValue = loggedinuser[data];
//             // For arrays like skills
//             if (Array.isArray(newValue)) {
//                 if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
//                     loggedinuser[data] = newValue;
//                     isUpdated = true;
//                 }
//             }
//             // For normal fields
//             else if (newValue !== oldValue) {
//                 loggedinuser[data] = newValue;
//                 isUpdated = true;
//             }
//         });
//         //  No changes detected
// if (!isUpdated) {
//     return res.status(200).json({
//         message: 'No changes detected. Profile already up to date.',
//         user: loggedinuser
//     });
// }
//         await loggedinuser.save();
//         res.status(200).json({
//             message: 'Profile updated successfully',
//             user: loggedinuser
//         });
//     } catch (error) {
//         console.log("Profile update error:", error.message);
//         res.status(400).send(error.message + ' Error updating profile');
//     }
// });

authRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateProfile(req);

        const loggedinuser = req.user;
        let isUpdated = false;

        Object.keys(req.body).forEach((key) => {

            const newValue = req.body[key];
            const oldValue = loggedinuser[key];

            // Handle Arrays (like skills)
            if (Array.isArray(newValue)) {
                const newArr = JSON.stringify(newValue);
                const oldArr = JSON.stringify(oldValue || []);

                if (newArr !== oldArr) {
                    loggedinuser[key] = newValue;
                    isUpdated = true;
                }
            }

            // Handle Strings (trim to avoid space issue)
            else if (typeof newValue === "string") {
                if (newValue.trim() !== (oldValue || "").toString().trim()) {
                    loggedinuser[key] = newValue.trim();
                    isUpdated = true;
                }
            }

            // Handle Numbers / Other types
            else {
                if (String(newValue) !== String(oldValue)) {
                    loggedinuser[key] = newValue;
                    isUpdated = true;
                }
            }
        });

        // 🚫 No Changes
        if (!isUpdated) {
            return res.status(200).json({
                message: 'No changes detected. Profile already up to date.',
                user: loggedinuser
            });
        }

        await loggedinuser.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: loggedinuser
        });

    } catch (error) {
        console.log("Profile update error:", error.message);
        res.status(400).send(error.message + ' Error updating profile');
    }
});

// authRouter.post('/profile/forgotpassword', async (req, res) => {
//     const newpassword = req.body.password;
//     try {
//         const editUser = await User.findOne({ emailId: req.body.emailId })
//         if (!editUser) {
//             return res.status(404).send('User not found');
//         }
//         const samepassworrd = await bcrypt.compare(newpassword, editUser.password);
//         if (samepassworrd) {
//             return res.status(400).send('New password must be different from the old password');
//         }
//         if (!validator.isStrongPassword(newpassword)) {
//             res.status(400).send('Password is not strong enough');
//         } else {
//             const hasshedpwd = await signPWD(newpassword);
//             editUser.password = hasshedpwd;
//             await editUser.save();
//             res.send('Password reset successful');
//         }
//     } catch (err) {
//         res.send('not able to set password' + err.message);
//     }
// })


authRouter.post('/profile/verify-email', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ emailId : email });
  console.log("Verifying email for:", user);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Email verified successfully"
  });
});


authRouter.patch("/profile/forgotpassword", async (req, res) => {
  const { email, newpassword } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !newpassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ emailId: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Validate strong password
    if (!validator.isStrongPassword(newpassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
      });
    }

    // 4️⃣ Prevent reusing old password
    const isSamePassword = await user.toPWD(newpassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // 5️⃣ Hash new password
    const hashedPwd = await signPWD(newpassword);

    user.password = hashedPwd;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
});


authRouter.patch('/profile/changepassword', userAuth, async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    try {
        const loggedinuser = req.user;
        const ispwvalid = await loggedinuser.toPWD(oldpassword);
        if (!ispwvalid) {
            return res.status(400).send('Old password is incorrect');
        }
        if (!validator.isStrongPassword(newpassword)) {
            return res.status(400).send('New password is not strong enough');
        } else {
            const hasshedpwd = await signPWD(newpassword);;
            loggedinuser.password = hasshedpwd;
            await loggedinuser.save();
            res.send('Password changed successfully');
        }
    } catch (err) {
        res.status(500).send('Error changing password' + err.message);
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.send('Logout successful');
})

module.exports = authRouter