import { findByEmail } from "../../repositories/userRepository.mjs";
import bcrypt from "bcrypt";
import { issueJwTForUser } from "../../services/googleAuthServices.mjs";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = issueJwTForUser(user.userId);

    // Store token in HTTP-only cookie
    res.cookie("auth-token", token, {
      httpOnly: true,
      maxAge: 60000 * 60,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
