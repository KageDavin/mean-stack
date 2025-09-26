import bcrypt from 'bcrypt';
import User from '../models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  findRefreshToken,
  revokeRefreshToken
} from '../services/token.service.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export async function register(req, res, next) {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'username taken' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, password: hashed, role: role || 'student' });

    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });

    await saveRefreshToken(refreshToken, user._id);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });

    await saveRefreshToken(refreshToken, user._id);

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    const payload = verifyRefreshToken(refreshToken);
    // verify token exists in DB (hashed)
    const tokenDoc = await findRefreshToken(refreshToken);
    if (!tokenDoc) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = signAccessToken({ id: payload.id });
    // optionally rotate refresh tokens:
    // const newRefresh = signRefreshToken({ id: payload.id });
    // await revokeRefreshToken(refreshToken);
    // await saveRefreshToken(newRefresh, payload.id);

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
    await revokeRefreshToken(refreshToken);
    return res.json({ message: 'logged out' });
  } catch (err) {
    next(err);
  }
}
// export async function logout(req, res, next) {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
//     await revokeRefreshToken(refreshToken);
//     return res.json({ message: 'logged out' });
//   } catch (err) {
//     next(err);
//   }
// }