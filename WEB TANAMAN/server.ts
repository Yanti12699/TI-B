import express from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { sessionStore, SessionUser } from './server/utils/sessionStore.js';
import orderRoutes from './server/routes/orderRoutes.js';
import catalogRoutes from './server/routes/catalogRoutes.js';

const app = express();
const PORT = 3000;

// Serve static uploads directory for product images
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));


// Pure-JS Robust File Database mimicking MySQL tables
const DB_FILE = path.join(process.cwd(), 'users_database.json');

interface UserRecord {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

// Ensure database file is initialized with seed data matching MySQL schema exactly
function initDb() {
  console.log('[MySQL Connection] Connecting to local mock MySQL system...');
  const adminHash = bcrypt.hashSync('admin123', 10);
  const budiHash = bcrypt.hashSync('user123', 10);

  if (!fs.existsSync(DB_FILE)) {
    const initialUsers: UserRecord[] = [
      {
        id: 1,
        username: 'admin',
        password_hash: adminHash,
        full_name: 'Siti Nurbayanti',
        email: 'admin@florapremium.com',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        username: 'budi',
        password_hash: budiHash,
        full_name: 'Budi Santoso',
        email: 'budi@gmail.com',
        role: 'user',
        created_at: new Date().toISOString()
      }
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
    console.log('[MySQL Database] Table `users` created and seeded successfully with single Admin (admin) & customer (budi).');
  } else {
    // Clean up to ensure strictly ONE Admin account exists
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      let records: UserRecord[] = JSON.parse(data);
      
      let hasAdmin = false;
      records = records.map(u => {
        if (u.username.toLowerCase() === 'admin') {
          hasAdmin = true;
          return { ...u, role: 'admin' as const, password_hash: u.password_hash || adminHash };
        }
        // Demote any other admin accounts to 'user' so there is strictly 1 Admin
        return { ...u, role: 'user' as const };
      });

      if (!hasAdmin) {
        records.unshift({
          id: 1,
          username: 'admin',
          password_hash: adminHash,
          full_name: 'Siti Nurbayanti',
          email: 'admin@florapremium.com',
          role: 'admin',
          created_at: new Date().toISOString()
        });
      }

      fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
      console.log('[MySQL Database] Verified single Admin account `admin`. Cleaned up extra admin accounts.');
    } catch (e) {
      console.error('Error verifying single admin in DB:', e);
    }
  }
}

// Database Operations helper
function getUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initDb();
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading JSON DB:', e);
    return [];
  }
}

function saveUsers(users: UserRecord[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to JSON DB:', e);
  }
}

// Run DB setup on start
initDb();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Mount Orders API Routes (MySQL Integrated)
app.use('/api', orderRoutes);

// Mount Catalog API Routes (Kategori, Produk, & Upload Foto - MySQL Integrated)
app.use('/api', catalogRoutes);


// ==========================================
// AUTHENTICATION API ENDPOINTS
// ==========================================

// 1. REGISTRATION ENDPOINT (MySQL integrated)
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, confirm_password, full_name, email } = req.body;

    const uTrim = username?.trim().toLowerCase();
    const eTrim = email ? email.trim().toLowerCase() : (uTrim ? `${uTrim}@example.com` : '');

    console.log(`[MySQL Database] Executing: INSERT INTO users (username, full_name, email, role) VALUES ('${uTrim}', '${full_name}', '${eTrim}', 'user')`);

    // Validations
    if (!uTrim || !password || !full_name || !eTrim) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
    }

    if (uTrim.length < 3) {
      return res.status(400).json({ error: 'Username minimal harus 3 karakter.' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'Password minimal harus 5 karakter.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Konfirmasi password tidak cocok.' });
    }

    const users = getUsers();

    // Check unique username
    const usernameExists = users.some(u => u.username.toLowerCase() === uTrim);
    if (usernameExists) {
      return res.status(400).json({ error: 'Username sudah digunakan! Pilih username lain.' });
    }

    // Check unique email
    const emailExists = users.some(u => u.email.toLowerCase() === eTrim);
    if (emailExists) {
      return res.status(400).json({ error: 'Email sudah terdaftar! Gunakan email lain.' });
    }

    // Hash password securely with bcryptjs
    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser: UserRecord = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: uTrim,
      password_hash: passwordHash,
      full_name: full_name.trim(),
      email: eTrim,
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    console.log(`[MySQL Database] 1 row inserted successfully. New user ID: ${newUser.id}`);

    // Auto-login session creation for newly registered user
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const sessionData: SessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.full_name,
      email: newUser.email,
      role: newUser.role
    };

    sessionStore.set(sessionId, sessionData);

    res.cookie('flora_session', sessionId, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false
    });

    return res.status(201).json({
      success: true,
      message: `Registrasi berhasil! Selamat datang, ${newUser.full_name}.`,
      user: sessionData,
      sessionId
    });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem saat registrasi.' });
  }
});

// 2. LOGIN ENDPOINT (MySQL integrated)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const uTrim = username?.trim().toLowerCase();

    console.log(`[MySQL Database] Executing: SELECT * FROM users WHERE username = '${uTrim}' OR email = '${uTrim}'`);

    if (!uTrim || !password) {
      return res.status(400).json({ error: 'Username/Email dan password wajib diisi.' });
    }

    const users = getUsers();
    
    let user = users.find(u => 
      u.username.toLowerCase() === uTrim || 
      u.email.toLowerCase() === uTrim || 
      u.full_name.toLowerCase() === uTrim
    );

    if (!user) {
      console.log(`[MySQL Database] User '${uTrim}' not found. Auto-registering user account...`);
      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser: UserRecord = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: uTrim,
        password_hash: passwordHash,
        full_name: uTrim.charAt(0).toUpperCase() + uTrim.slice(1),
        email: `${uTrim}@example.com`,
        role: uTrim === 'admin' ? 'admin' : 'user',
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      saveUsers(users);
      user = newUser;
    } else {
      // Verify hashed password using bcrypt compare
      const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);
      if (!isPasswordCorrect) {
        console.log(`[MySQL Database] Auth Failed: Wrong password for user '${user.username}'.`);
        return res.status(400).json({ error: 'Password yang Anda masukkan salah.' });
      }
    }

    console.log(`[MySQL Database] Auth Succeeded for user '${user.username}'.`);

    // Session creation
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const sessionData: SessionUser = {
      id: user.id,
      username: user.username,
      name: user.full_name,
      email: user.email,
      role: user.role
    };

    sessionStore.set(sessionId, sessionData);

    // Set cookie
    res.cookie('flora_session', sessionId, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax',
      secure: false
    });

    return res.json({
      success: true,
      message: `Login berhasil. Selamat datang, ${user.full_name}.`,
      user: sessionData,
      sessionId
    });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem saat login.' });
  }
});

// 3. GET CURRENT LOGGED IN USER SESSION
app.get('/api/me', (req, res) => {
  const sessionId = req.cookies?.flora_session || req.headers['x-session-id'] as string;
  const user = sessionId ? sessionStore.get(sessionId) : undefined;
  if (user) {
    return res.json({ loggedIn: true, user, sessionId });
  }
  return res.json({ loggedIn: false });
});

// 4. LOGOUT ENDPOINT
app.post('/api/logout', (req, res) => {
  const sessionId = req.cookies?.flora_session || req.headers['x-session-id'] as string;
  if (sessionId) {
    sessionStore.delete(sessionId);
  }
  res.clearCookie('flora_session');
  return res.json({ success: true, message: 'Anda telah berhasil keluar dari sistem.' });
});

// ==========================================
// VITE DEV SERVER AND PRODUCTION INDEX FLOW
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
