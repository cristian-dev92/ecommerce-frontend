// src/app/models/user.ts

/**
 * Define la estructura de datos básica para un Usuario en el frontend.
 * Se utiliza para el registro y para almacenar la información del usuario loggeado.
 */
export interface User {
  id?: number; // Opcional, ya que no se envía en el registro
  name: string;
  email: string;
  password?: string; // Opcional si solo se usa para mostrar perfil
  token?: string; // Token de autenticación JWT (se usa después del login)
}

/**
 * Define la estructura de las credenciales para la petición de Login.
 */
export interface LoginCredentials {
  name: string;
  password: string;
}

/**
 * Define la estructura para el registro (Register).
 */
export interface RegisterDetails {
  name: string;
  email: string;
  password: string;
}
