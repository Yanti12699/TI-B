import fs from 'fs';
import path from 'path';

export interface SessionUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const SESSION_FILE = path.join(process.cwd(), 'sessions_db.json');

// Persistent Session Manager
class SessionStore {
  private sessions: Record<string, SessionUser> = {};

  constructor() {
    this.loadSessions();
  }

  private loadSessions() {
    try {
      if (fs.existsSync(SESSION_FILE)) {
        const data = fs.readFileSync(SESSION_FILE, 'utf-8');
        this.sessions = JSON.parse(data);
      }
    } catch (err) {
      console.error('[SessionStore] Failed to load sessions from disk:', err);
      this.sessions = {};
    }
  }

  private saveSessions() {
    try {
      fs.writeFileSync(SESSION_FILE, JSON.stringify(this.sessions, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SessionStore] Failed to save sessions to disk:', err);
    }
  }

  public get(sessionId: string): SessionUser | undefined {
    return this.sessions[sessionId];
  }

  public set(sessionId: string, user: SessionUser): void {
    this.sessions[sessionId] = user;
    this.saveSessions();
  }

  public delete(sessionId: string): void {
    delete this.sessions[sessionId];
    this.saveSessions();
  }

  public getAll(): Record<string, SessionUser> {
    return { ...this.sessions };
  }
}

export const sessionStore = new SessionStore();
