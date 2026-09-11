// ============================================================
// AUTH SERVICE — Llamadas a la API de autenticación (dummyjson.com)
// Dominio: Productora de Eventos
// ============================================================
import axios from 'axios';
import type { AuthResponse, AuthTokens, LoginCredentials, RegisterData } from '../types';
import { api } from './api';

const BASE_URL = 'https://dummyjson.com';

/**
 * Autentica al usuario con username y password contra dummyjson.
 * Se usa `axios` directo (no la instancia `api`) porque el interceptor
 * de `api` intenta inyectar un token que todavía no existe.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30,
  });
  return data;
}

/**
 * Registra un nuevo productor. dummyjson.com no tiene un endpoint real de
 * registro, así que se simula la creación de cuenta con un pequeño delay
 * y tokens de demostración — suficiente para practicar el flujo completo
 * (formulario → store → SecureStore → navegación condicional).
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: Math.floor(Math.random() * 100000),
    username: data.username,
    email: data.email,
    firstName: data.firstName ?? data.username,
    lastName: data.lastName ?? '',
    image: '',
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  };
}

/**
 * Renueva el access token usando el refresh token.
 * Llamado automáticamente por el interceptor de Axios en respuestas 401.
 * Usa axios directo (NO la instancia `api`) para evitar un loop infinito.
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const { data } = await axios.post<AuthTokens>(`${BASE_URL}/auth/refresh`, {
    refreshToken,
    expiresInMins: 30,
  });
  return data;
}

/** Obtiene el perfil del usuario autenticado directamente del servidor. */
export async function getProfile(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>(`${BASE_URL}/auth/me`);
  return data;
}
