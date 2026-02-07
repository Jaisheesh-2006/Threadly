import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const verifyPassword = async (hashPassword, password) => {
  return argon2.verify(hashPassword, password);
};

//* generates jwt token basic
export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const isProduction = process.env.NODE_ENV === "production";
  const cookieConfig = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //? MS
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };
  res.cookie("jwt", token, cookieConfig);
  return token;
};
