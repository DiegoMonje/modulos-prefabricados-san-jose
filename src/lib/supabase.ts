import { createClient } from '@supabase/supabase-js';

const oldSupabaseUrl = 'https://giqbwlwkdycpsngdhzam.supabase.co';
const fallbackSupabaseUrl = 'https://wrremolyjmjcyijrmypv.supabase.co';
const fallbackSupabaseAnonKey = 'sb_publishable_8Xqw716bnR1y5fqHe6V7JQ_PleVHp4V';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = envSupabaseUrl && envSupabaseUrl !== oldSupabaseUrl ? envSupabaseUrl : fallbackSupabaseUrl;
const supabaseAnonKey = envSupabaseUrl && envSupabaseUrl !== oldSupabaseUrl && envSupabaseAnonKey ? envSupabaseAnonKey : fallbackSupabaseAnonKey;

export const activeSupabaseUrl = supabaseUrl;

const REMEMBER_SESSION_KEY = 'mpsj_admin_remember_session';
const SESSION_STORAGE_PREFIX = 'mpsj_supabase_auth';

const canUseBrowserStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage && window.sessionStorage);

const shouldRememberSession = () => {
  if (!canUseBrowserStorage()) return true;
  return window.localStorage.getItem(REMEMBER_SESSION_KEY) !== 'false';
};

const preferredStorage = () => {
  if (!canUseBrowserStorage()) return undefined;
  return shouldRememberSession() ? window.localStorage : window.sessionStorage;
};

const secondaryStorage = () => {
  if (!canUseBrowserStorage()) return undefined;
  return shouldRememberSession() ? window.sessionStorage : window.localStorage;
};

const authStorage = {
  getItem: (key: string) => {
    const primary = preferredStorage();
    const secondary = secondaryStorage();
    return primary?.getItem(key) ?? secondary?.getItem(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    const primary = preferredStorage();
    const secondary = secondaryStorage();
    primary?.setItem(key, value);
    secondary?.removeItem(key);
  },
  removeItem: (key: string) => {
    if (!canUseBrowserStorage()) return;
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export const setRememberAdminSession = (remember: boolean) => {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(REMEMBER_SESSION_KEY, remember ? 'true' : 'false');
};

export const getRememberAdminSession = () => shouldRememberSession();

export const clearAdminAuthStorage = () => {
  if (!canUseBrowserStorage()) return;
  Object.keys(window.localStorage)
    .filter((key) => key.includes('supabase') || key.startsWith(SESSION_STORAGE_PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
  Object.keys(window.sessionStorage)
    .filter((key) => key.includes('supabase') || key.startsWith(SESSION_STORAGE_PREFIX))
    .forEach((key) => window.sessionStorage.removeItem(key));
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: SESSION_STORAGE_PREFIX,
        storage: authStorage,
      },
    })
  : null;
