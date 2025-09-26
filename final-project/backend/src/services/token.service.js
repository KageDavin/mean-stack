import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import RefreshToken from '../models/RefreshToken.js';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export async function saveRefreshToken(token, userId) {
  const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);
  const decoded = verifyRefreshToken(token);
  const expiresAt = new Date(decoded.exp * 1000);

  // store hashed token
  const doc = await RefreshToken.create({ tokenHash, user: userId, expiresAt });
  return doc;
}

export async function revokeRefreshToken(token) {
  // remove any refresh token matching tokenHash
  const tokens = await RefreshToken.find();
  for (const t of tokens) {
    const match = await bcrypt.compare(token, t.tokenHash);
    if (match) await t.deleteOne();
  }
}

export async function findRefreshToken(token) {
  const tokens = await RefreshToken.find();
  for (const t of tokens) {
    const match = await bcrypt.compare(token, t.tokenHash);
    if (match) return t;
  }
  return null;
}
// export async function findRefreshToken(token) {
//   const tokens = await RefreshToken.find();
//   for (const t of tokens) {
//     const match = await bcrypt.compare(token, t.tokenHash);
//     if (match) return t;
//   }
//   return null;
// }