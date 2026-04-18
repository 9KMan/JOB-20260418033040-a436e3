import bcrypt from 'bcryptjs';
import { Database } from '../config/database.js';

export const User = {
  async create(email, password, name) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await Database.run(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );
    return { id: result.lastInsertRowid, email, name };
  },

  async findByEmail(email) {
    return Database.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  async findById(id) {
    return Database.get('SELECT * FROM users WHERE id = ?', [id]);
  },

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
};
