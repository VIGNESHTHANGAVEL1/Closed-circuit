import {
  authenticateAdmin,
  createAccessToken,
} from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;
    const user = await authenticateAdmin(username.trim(), password);

    if (!user) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const token = createAccessToken(user);

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('adminLogin error:', err);
    return sendError(res, 'Login failed.', 500);
  }
}

export async function getAdminProfile(req, res) {
  return sendSuccess(res, { user: req.user });
}
