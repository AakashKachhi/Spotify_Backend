import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const registerUser = async function (req, res) {
  const { username, email, password, role = "user" } = req.body

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  })

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already Exist",
    })
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username, 
    email,
    password,
    role
  })

  const token = jwt.sign({
    id: user._id,
    role: user.role
  }, process.env.JWT_SECRET)

  res.cookie("token", token)

  res.status(201).json({
    message: "User registered successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
  })
}

export default {registerUser}