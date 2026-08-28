import jwt from "jsonwebtoken";

export const generateToken = (id,username) => {
  const token = jwt.sign(
    {
      id,
      username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return token;
};
