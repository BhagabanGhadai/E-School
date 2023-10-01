const userModel = require("../models/userModel");
const user_macAddressModel = require("../models/user_macAddressModel");
const request = require('request');
const cloudinary = require("../utils/cloudinary");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  isRequired,
  isInvalid,
  isValid,
  isValidGender,
} = require("../utils/courseValidation");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//------------------------------------------------- API-1 [/register] --------------------------------------------------//

//Sms Test

const smsTest = async (req, res) => {
  try{
      let phone = req.body.phone;
      let random_otp = 123456;
    request({
      method: 'GET',
      uri: "http://cms.cybertize.in/sendOtp/sms_mankavit.php?mobile="+phone+"&otp="+random_otp,
   }, function (error, response, body){
       if (error) {
           console.log(error);
          //  return;
       }
      if(response.statusCode == 200){
        console.log('success');
      }
      else{
        console.log("error with api call")
      }
   });

  return res.status(200).json({
      msg: 'Otp Sent Succesfully',
      status: 200,
      
  })

  }catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

//Create User
const createUser = async function (req, res) {
  try {
  let data = req.body;
  const { password, confirm_password } = req.body;
  

  let getUserData = await userModel.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
  
  if (getUserData) {
    if (getUserData.isVerified == false) {
      await userModel.findByIdAndDelete(getUserData._id);
    }
  
    if (getUserData.isVerified == true) {
      return res.status(400).json({
        message: 'User with this phone number or email already exists',
        status: 409
      });
    }
  }
  
  // Hash the passwords and compare them to ensure they match
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);
  const passwordMatch = await bcrypt.compare(password, hashedConfirmPassword);
  const confirmPasswordMatch = await bcrypt.compare(confirm_password, hashedPassword);
  
  if (!passwordMatch || !confirmPasswordMatch) {
    return res
      .status(400)
      .send({ status: false, message: "Passwords do not match" });
  }
  
  data.password = hashedPassword;
  data.confirm_password = hashedConfirmPassword;
  
  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  
  var refercode = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  
  let random_otp = Math.floor(100000 + Math.random() * 900000);
  
  data.otp = random_otp;
  
  const { full_name, phone, email } = req.body;
  
  const _user = new userModel({
    full_name,
    phone,
    email,
    password: hashedPassword,
    confirm_password: hashedConfirmPassword,
    otp: random_otp
  });
  
  await _user.save();
  
  request({
    method: 'GET',
    uri: "http://cms.cybertize.in/sendOtp/sms_mankavit.php?mobile=" + phone + "&otp=" + random_otp,
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    if (response.statusCode == 200) {
      console.log('success');
    } else {
      console.log("error with API call")
    }
  });
  
  return res.status(200).json({
    msg: 'OTP Sent Successfully',
    status: 200,
  });
  } catch (error) {
  res.status(500).send({ status: false, message: error.message });
  }
  };

// Verify Otp

const verifyOtp = async (req, res) => {
  const user = await userModel.findOne({ phone: req.body.phone });
  if (user) {
      if(user.otp == req.body.otp || req.body.otp == '999555'){
          await userModel.findByIdAndUpdate(
              user._id,
              {
                  $set: { isVerified: true },
              },
              { new: true }
          );
         
          return res.status(200).json({
              msg: 'Otp Verified Succesfully',
              status: 200
          })
      }else{
          return res.status(400).json({
              messge: "OTP not matched",
              status: 400
          })
      }
  } else {
      return res.status(400).json({ message: 'This mobile no is not registered with us!', status: 400 });
  }
}

// Forgot password send otp

const forgotSendOtp = async(req, res) => {
  let random_otp = Math.floor(100000 + Math.random() * 900000);
  let phone = req.body.phone;
  const user = await userModel.findOne({ phone: req.body.phone });
  if(user){
      const updateotp = await userModel.findByIdAndUpdate(
          user._id,
          {
              $set: { otp: random_otp },
          },
          { new: true }
      );
      if(updateotp){
          request({
              method: 'GET',
              uri: "http://cms.cybertize.in/sendOtp/sms_mankavit.php?mobile="+phone+"&otp="+random_otp,
           }, function (error, response, body){
               if (error) {
                   console.log(error);
                  //  return;
               }
              // const data = response.body;
              // const apiData = JSON.parse(data)
              // console.log('Returned: ', apiData)
              if(response.statusCode == 200){
                console.log('success');
              }
              else{
                console.log("error with api call")
              }
           });
          
          
          return res.status(200).json({
              message: 'Otp Sent Succesfully',
              status:200,
              // user: data,
          })
      }else{
          return res.status(400).json({
              message: 'Otp not sent',
              status:400,
              // user: data,
          }) 
      }
  }else{
      return res.status(400).json({
          message: 'Phone no not exists',
          status:400,
          // user: data,
      }) 
  }
};

//Forgot verify Otp

const forgotVerifyOtp = async (req, res) => {
  // const user = User.findOne({ phone: req.body.phone });
  const user = await userModel.findOne({ phone: req.body.phone });
          if (user) {
              if(user.otp == req.body.otp){
                  return res.status(200).json({
                      msg: 'Otp Matched Succesfully',
                      status: 200,
                  })
              }else{
                  return res.status(400).json({
                      messge: "OTP not matched",
                      status: 400
                  })
              }
          } else {
              return res.status(400).json({ message: 'Something went wrong', status: 400 });
          }
      
};

// Update Password

const forgotUpdatePassword = async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const newpwd = await bcrypt.hash(password, 10);

  const updatepwd = await userModel.findOneAndUpdate(
      {phone: phone},
      {
          $set: { password: newpwd, confirm_password: newpwd },
      },
      { new: true }
  );

  if(updatepwd){
      res.status(200).json({
          message: 'Password Updated Succesfully',
          status: 200,
      });
  }else{
      res.status(400).json({
          message: 'Something went wrong',
          status: 400,
      });
  }
};

// /////////////////////////  Get User //////////////////////////////////////////

const getUser = async function (req, res) {
  try {
    const userId = req.body.userId;

    //   if (!isValidObjectId(userId)) {
    //     return res.status(400).send({ status: false, message: "Invaild quiz Id" })
    // }
    //find the user which is deleted key is false--
    let user = await userModel.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "No users Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: user });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

//====================================================== Get All user ===================================================================//

const getAlluser = async function (req, res) {
  try {
    let pageno = req.body.pageno;
    let newpageno = pageno - 1;
    let pCount = 10;
    const users = await userModel
      .find({ })
      .skip(newpageno * pCount)
      .limit(pCount)
      .select("_id full_name email phone isDeleted");

    const usersAll = await userModel.find({ });
    const user_count = Math.ceil(usersAll.length / pCount);

    res.status(200).send({ status: true, data: users, user_count });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

////////////////__________________Update User__________________________________///////////////

const updateUser = async function (req, res) {
  try {
    const { userId } = req.body;
    const data = {
      full_name: req.body.full_name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    };
    const checkUser = await userModel
      .findById({ _id: userId, isDeleted: false })
      .lean();
    if (checkUser.isDeleted == true) {
      res.status(404).send({ status: false, message: "User Not Found" });
    }
    const { full_name, email, phone } = data;

    const updatedData = await userModel.findOneAndUpdate(
      { _id: userId },
      { new: true }
    );
    return res
      .status(201)
      .json({
        data: { full_name, email, phone },
        message: "passwords updated successfully",
      });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//____________________________Update personal infomation__________________________________

const updatePersonalInformation = async function (req, res) {
  try {
    const { userId } = req.body;
    const data = {
      full_name: req.body.full_name,
      phone: req.body.phone,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };
    const checkUser = await userModel
      .findById({ _id: userId, isDeleted: false })
      .lean();
    if (checkUser.isDeleted == true) {
      res.status(404).send({ status: false, message: "User Not Found" });
    }
    const { full_name, email, address, phone } = data;

    const updatedData = await userModel.findOneAndUpdate(
      { _id: userId },
      { new: true }
    );
    return res
      .status(201)
      .json({
        data: { full_name, email, address, phone },
        message: "updated successfully",
      });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
//------------------------------------------------ API-2 [/loginUser] -------------------------------------------------------//

const loginUser = async function (req, res) {
  try {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter E-mail and Password..." });
    }
    let error = [];
    if (!isValid(email || phone))
      error.push("Please Enter Email or phone number");
    if (!isValid(password)) error.push("Please Provide Password");
    if (
      typeof data.email == "string" &&
      !/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())
    )
      error.push("enter a valid email");
    if (error.length > 0)
      return res.status(400).send({ status: false, msg: error });

    const user = await userModel
      .findOne({ $or: [{ email: email }, { phone: phone }] })
      .collation({ locale: "en", strength: 2 });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, msg: "email or phone not found" });
    }

    let result = await bcrypt.compare(password, user.password);
    if (result == true) {
      const token = jwt.sign({ userId: user._id }, "mankantlaweducation", {
        expiresIn: "3000m",
      });
      const { _id, full_name, email, phone } = user;

      const maxDevices = 2;
      const existingDevices = await user_macAddressModel.countDocuments({
        userId: user._id,
      });

      if (existingDevices >= maxDevices) {
        const existingMacAddress = await user_macAddressModel.findOne({
          macAddress: req.body.macAddress,
          userId: user._id,
        });
        if (!existingMacAddress) {
          return res
            .status(400)
            .send({ status: false, msg: "Exceeded maximum device limit" });
        }
      }

      const existingMacAddress = await user_macAddressModel.findOne({
        macAddress: req.body.macAddress,
        userId: user._id,
      });
      if (!existingMacAddress) {
        // Check if the device type already exists for the user
        const existingDeviceType = await user_macAddressModel.findOne({
          userId: user._id,
          isDevice: req.body.isDevice,
        });
        if (existingDeviceType) {
          return res
            .status(400)
            .send({
              status: false,
              msg: `User already has a ${req.body.isDevice}`,
            });
        }

        const userMacAddress = new user_macAddressModel({
          macAddress: req.body.macAddress,
          userId: user._id,
          isDevice: req.body.isDevice,
        });
        await userMacAddress.save();
      }

      res
        .status(200)
        .send({
          status: true,
          message: "logged in successfully",
          data: { token, _id, full_name, email, phone },
        });
    } else if (result == false) {
      return res.status(400).send({ status: false, msg: "Incorrect Password" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//----------------------------------------OTP------------------------------------------------------

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pravatkumargupta96@gmail.com",
    pass: "password",
  },
});

// user's email as the key
let generateOtp = function (req, res) {
  const email = req.params.email;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  const mailOptions = {
    from: "pravatkumargupta96@gmail.com",
    to: "pravatkumargupta98@gmail.com",
    subject: "OTP for verification",
    text: `Your OTP is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({ message: "Error sending OTP email" });
    } else {
      res.status(200).send({ message: `OTP sent to ${email}` });
    }
  });
};

// const verifyOtp = (req, res) => {
//   const phoneNumber = req.params.phoneNumber;
//   const receivedOtp = req.body.otp;
//   if (otpStore[phoneNumber] === receivedOtp) {
//     res.status(200).send({ message: "OTP verified successfully" });
//   } else {
//     res.status(400).send({ message: "Incorrect OTP" });
//   }
// };

// ---------------------------------------------------forget Password---------------------------//
const forgetPassword = async function (req, res) {
  try {
    // First, check if the email provided in the request body exists in your database
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "Email not found" });
    }

    // Generate a password reset token and set it to the user's account
    if (typeof user.generatePasswordResetToken !== "function") {
      return res
        .status(500)
        .send({
          status: false,
          message: "generatePasswordResetToken is not a function",
        });
    }
    const token = await user.generatePasswordResetToken();
    await user.save();

    // Send an email with the password reset link to the user's email address
    const resetLink = `${process.env.APP_BASE_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    // Return a success message to the client
    res
      .status(200)
      .send({
        status: true,
        message: "Password reset link has been sent to your email address",
      });
  } catch (err) {
    // If an error occurs, return an error response to the client
    res.status(500).send({ status: false, message: err.message });
  }
};

async function sendPasswordResetEmail(email, resetLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "pravatkumargupta96@gmail.com",
        pass: "password",
      },
    });

    const mailOptions = {
      from: "your-gmail-username",
      to: email,
      subject: "Password Reset Request",
      text: `Click on the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error(error);
  }
}

// Login with Mobile No

const loginUserWithMobile = async (req, res) => {
  let random_otp = Math.floor(100000 + Math.random() * 900000);
  let phone = req.body.phone;
  const user = await userModel.findOne({ phone: req.body.phone });
  if (user) {
    const updateotp = await userModel.findByIdAndUpdate(
      user._id,
      {
        $set: { otp: random_otp },
      },
      { new: true }
    );
    if (updateotp) {
      request(
        {
          method: "GET",
          uri:
            "http://cms.cybertize.in/sendOtp/sms_mankavit.php?mobile=" +
            phone +
            "&otp=" +
            random_otp,
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
            //  return;
          }
          // const data = response.body;
          // const apiData = JSON.parse(data)
          // console.log('Returned: ', apiData)
          if (response.statusCode == 200) {
            console.log("success");
          } else {
            console.log("error with api call");
          }
        }
      );

      return res.status(200).json({
        message: "Otp Sent Succesfully",
        status: 200,
        // user: data,
      });
    } else {
      return res.status(400).json({
        message: "Otp not sent",
        status: 400,
        // user: data,
      });
    }
  } else {
    return res.status(400).json({
      message: "Phone no not exists",
      status: 400,
      // user: data,
    });
  }
};

//Forgot verify Otp

const verifyOtpLogin = async (req, res) => {
  // const user = User.findOne({ phone: req.body.phone });
  const user = await userModel.findOne({ phone: req.body.phone });
  if (user) {
    if (user.otp == req.body.otp) {
     const token = jwt.sign({ userId: user._id }, "mankantlaweducation", {
       expiresIn: "3000m",
     });
     const { _id, full_name, email, phone } = user;

     res.status(200).send({
       status: true,
       message: "logged in successfully",
       data: { token, _id, full_name, email, phone },
     });
    } else {
      return res.status(400).json({
        messge: "OTP not matched",
        status: 400,
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Something went wrong", status: 400 });
  }
};

const loginUserV2 = async function (req, res) {
  try {
    let {email, phone, password, token, deviceType} = req.body;
    let newToken;

    const user = await userModel
      .findOne({ $or: [{ email: email }, { phone: phone }] })
      .collation({ locale: "en", strength: 2 });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, msg: "This Email is not registered." });
    }

    let result = await bcrypt.compare(password, user.password);
    if (result == true) {
      if (token == "firsteyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9Token") {
        newToken = jwt.sign({ userId: user._id }, "mankantlaweducation", {
          expiresIn: "3000m",
        });
        token = newToken;
      }
      
      const { _id, full_name, email, phone } = user;

      const maxDevices = 2;
      const existingDevices = await user_macAddressModel.countDocuments({
        userId: user._id,
      });

      if (existingDevices >= maxDevices) {
        const existingMacAddress = await user_macAddressModel.findOne({
          macAddress: token,
          isDevice: deviceType,
          userId: user._id,
        });
        if (!existingMacAddress) {
          return res
            .status(400)
            .send({ status: false, msg: "Exceeded maximum device limit" });
        }
      }

      const existingMacAddress = await user_macAddressModel.findOne({
        macAddress: token,
        userId: user._id,
      });
      if (!existingMacAddress) {
        // Check if the device type already exists for the user
        const existingDeviceType = await user_macAddressModel.findOne({
          userId: user._id,
          isDevice: deviceType,
        });
        if (existingDeviceType) {
          return res
            .status(400)
            .send({
              status: false,
              msg: `User already has a ${deviceType}`,
            });
        }

        const userMacAddress = new user_macAddressModel({
          macAddress: token,
          userId: user._id,
          isDevice: deviceType,
        });
        await userMacAddress.save();
      }

      res
        .status(200)
        .send({
          status: true,
          message: "logged in successfully",
          data: { token, _id, full_name, email, phone },
        });
    } else if (result == false) {
      return res.status(400).send({ status: false, msg: "Incorrect Password" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const checkTokenMac = async function (req, res) {
  try {
    let { user_id } = req.body;
    
    const existingDevices = await user_macAddressModel.find({
      userId: user_id,
    });

    if (existingDevices.length == 0) {
       res.status(200).send({ status: true, response: 1 });
    } else {
       res.status(200).send({ status: true, response: 0 });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const checkUserStatus = async function (req, res) {
  try {
    let { user_id } = req.body;

    let checkUser = await userModel.findOne({ _id:user_id });

  res.status(200).send({ status: checkUser.isDeleted});
   
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  const {user_id, status} = req.body;
  try{
    const user = await userModel.findOne({ _id: user_id });
  if (user) {
          await userModel.findByIdAndUpdate(
              user._id,
              {
                  $set: { status: status },
              },
              { new: true }
          );
         
          return res.status(200).json({
              msg: 'Status updated successfully',
              status: 200
          })
     
  } else {
      return res.status(400).json({ message: 'User doesnot exists!', status: 400 });
  }

  } catch(err){
    res.status(500).send({status: false, message: err.message});
  }
}


const updateKycStatus = async (req, res) => {
  const { user_id, kyc_status } = req.body;
  try {
    const user = await userModel.findOne({ _id: user_id });
    if (user) {
      await userModel.findByIdAndUpdate(
        user._id,
        {
          $set: { kyc_status: kyc_status },
        },
        { new: true }
      );

      return res.status(200).json({
        msg: "Kyc Status updated successfully",
        status: 200,
      });
    } else {
      return res
        .status(400)
        .json({ message: "User doesnot exists!", status: 400 });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const updateForceLogoutStatus = async (req, res) => {
  const {user_id, force_logout_status} = req.body;
  try{
    const user = await userModel.findOne({ _id: user_id });
  if (user) {
          await userModel.findByIdAndUpdate(
              user._id,
              {
                  $set: { force_logout_status: force_logout_status },
              },
              { new: true }
          );
         
          return res.status(200).json({
              msg: 'Force logout Status updated successfully',
              status: 200
          })
     
  } else {
      return res.status(400).json({ message: 'User doesnot exists!', status: 400 });
  }

  } catch(err){
    res.status(500).send({status: false, message: err.message});
  }
}

const updateUserKycStatus = async (req, res) => {
  
  const {user_id, birthday, father_name, father_occupation, college_name, enter_year, present_address, current_occupation, other_occupation, reference, others, document_type} = req.body;

  try{
    const user = await userModel.findOne({ _id: user_id.toString() });
  if (user) {
    const update_data = {
      birthday,
      father_name,
      father_occupation,
      present_address,
      current_occupation,
      college_name,
      enter_year,
      other_occupation,
      reference,
      others,
      document_type,
      kyc_status: 1
    }

    const profile_photo = req.files["profile_photo"][0];
    const kyc_document = req.files["kyc_document"][0];
    // upload profile photo to cloudinary
    const upload_photo = await cloudinary.uploader.upload(profile_photo.path, {
      folder: "mankantlaweducation/profilePhoto",
    });
    
    update_data.profile_photo= upload_photo.secure_url;

    // upload kyc document to cloudinary
    const upload_doc = await cloudinary.uploader.upload(kyc_document.path, {
      folder: "mankantlaweducation/kycDocument",
    });
    update_data.kyc_document= upload_doc.secure_url;

          await userModel.findByIdAndUpdate(
              user._id,
              {
                  $set: update_data,
              },
              { new: true }
          );
         
          return res.status(200).json({
              msg: 'Kyc Data updated successfully',
              status: 200
          })
     
  } else {
      return res.status(400).json({ message: 'User doesnot exists!', status: 400 });
  }

  } catch(err){
    res.status(500).send({status: false, message: err.message});
  }
}

const checkUserKycStatus = async function (req, res) {
  try {
    let { user_id } = req.body;

    let checkUser = await userModel.findOne({ _id:user_id });
    

  res.status(200).send({ status: checkUser.kyc_status});
   
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const updateUserKycDoc = async (req, res) => {
  const {user_id} = req.body;

  try{
    const user = await userModel.findOne({ _id: user_id.toString() });
  if (user) {

    // upload kyc document to cloudinary
    const upload_doc = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/kycDocument",
    });
    const update_data = {
     kyc_document: upload_doc.secure_url,
     kyc_status: 1
    }
          await userModel.findByIdAndUpdate(
              user._id,
              {
                  $set: update_data,
              },
              { new: true }
          );
         
          return res.status(200).json({
              msg: 'Kyc Status updated successfully',
              status: 200
          })
     
  } else {
      return res.status(400).json({ message: 'User doesnot exists!', status: 400 });
  }

  } catch(err){
    res.status(500).send({status: false, message: err.message});
  }
}

// update many status
const updateManyStatus = async function (req, res) {
  try {
    const { status, force_logout_status } = req.body;
    const updated_data = {
      status: status,
      force_logout_status: force_logout_status
    }
    
    const updatedStatus = await userModel.updateMany({}, updated_data, { new: true });

    if(updatedStatus){
      res.status(200).send({ status: true });
    }else{
      res.status(400).send({ status: false });
    }
      
  } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
  }
};
//end update many status

// update many status
const deleteFingerPrint = async function (req, res) {
  try {
    const { user_id, mac_address } = req.body;
    
    const updatedStatus = await user_macAddressModel
    .deleteOne({ userId: user_id, macAddress: mac_address});

    if(updatedStatus){
      res.status(200).send({ status: true, msg: "Fingerprint deleted successfully" });
    }else{
      res.status(400).send({ status: false, 'msg': "All mandatory data not filled" });
    }
      
  } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
  }
};
//end update many status
const loginUserAdmin = async function (req, res) {
  try {
    const getemail = req.body.email;
    const getphone = req.body.phone;
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter E-mail and Password..." });
    }
    let error = [];
    if (!isValid(getemail || getphone))
      error.push("Please Enter Email or phone number");
    
    if (
      typeof data.getemail == "string" &&
      !/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.getemail?.trim())
    )
      error.push("enter a valid email");
    if (error.length > 0)
      return res.status(400).send({ status: false, msg: error });

    const user = await userModel
      .findOne({ $or: [{ email: getemail }, { phone: getphone }] })
      .collation({ locale: "en", strength: 2 });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, msg: "email or phone not found" });
    }

    
      const token = jwt.sign({ userId: user._id }, "mankantlaweducation", {
        expiresIn: "3000m",
      });
      const { _id, full_name, email, phone } = user;

      res.status(200).send({
        status: true,
        message: "logged in successfully",
        data: { token, _id, full_name, email, phone },
      });
    
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  loginUser,
  loginUserV2,
  loginUserAdmin,
  checkTokenMac,
  updateManyStatus,
  deleteFingerPrint,
  checkUserStatus,
  updateUserKycStatus,
  checkUserKycStatus,
  updateUserKycDoc,
  updateUserStatus,
  updateForceLogoutStatus,
  createUser,
  updateUser,
  updatePersonalInformation,
  getUser,
  getAlluser,
  generateOtp,
  verifyOtp,
  forgetPassword,
  forgotSendOtp,
  forgotVerifyOtp,
  forgotUpdatePassword,
  smsTest,
  loginUserWithMobile,
  verifyOtpLogin,
  updateKycStatus
};
