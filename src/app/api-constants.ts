// api-constants.ts

/**
 * Constantes de configuración de la API para el entorno de desarrollo.
 * * Usamos el puerto 8080 ya que Spring Boot (servidor web) usa el puerto por defecto,
 * * mientras que el puerto 5432 es usado por la base de datos PostgreSQL.
 */
export const API_CONSTANTS = {
  // Corregido: La URL de la API debe apuntar a 8080
  BASE_URL: 'http://localhost:8080/api',
};
