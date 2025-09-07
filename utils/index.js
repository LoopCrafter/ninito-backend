import jwt from "jsonwebtoken";

export const getExpiryDate = (days = 1) =>
  Date.now() + days * 24 * 60 * 60 * 1000;

export const generateAccessToken = (res, userId, userRole) => {
  const token = jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  return token;
};
export const generateRefreshTokenAndSetCookie = (res, userId, userRole) => {
  const token = jwt.sign({ userId, userRole }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function applyDefaultTransforms(schema, hiddenFields = []) {
  function transform(doc, ret) {
    hiddenFields.forEach((field) => {
      delete ret[field];
    });
    delete ret.__v;
    return ret;
  }

  schema.set("toJSON", {
    virtuals: true,
    transform,
  });

  schema.set("toObject", {
    virtuals: true,
    transform,
  });
}
