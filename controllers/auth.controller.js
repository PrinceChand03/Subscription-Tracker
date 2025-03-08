import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//a req.body is an object containing data from the client(POST request)

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    // check if a user already exists with the email
    const existingUser = await User.findOne({ email, });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //add session in case of error during transaction
    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

    const token = jwt.sign({ id: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created sucessfully',
      data: {
        token,
        user: newUsers[0],
      }
    });

  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();

    // Pass the error to the error handler
    next(error);
  }

}

export const signIn = async (req, res, next) => {


}

export const signOut = async (req, res, next) => {


}