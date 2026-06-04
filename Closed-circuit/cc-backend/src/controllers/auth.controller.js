import {
  authenticateAdmin,
  createAccessToken,
  changeAdminPassword,
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

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changeAdminPassword(req.user.id, currentPassword, newPassword);

    if (!result.ok) {
      return sendError(res, result.message, 400);
    }

    return sendSuccess(res, { message: 'Password updated successfully.' });
  } catch (err) {
    console.error('changePassword error:', err.message);
    return sendError(res, 'Password update failed.', 500);
  }
}
