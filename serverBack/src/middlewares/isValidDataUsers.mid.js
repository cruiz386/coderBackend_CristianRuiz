import crypto from "crypto";

// Middleware para validar los datos de los usuarios
function isValidDataUser(req, res, next) {
  try {
    const { email, password, role, photo, isOnline } = req.body;

    // Validación de Usuario
    if (!email) {
      throw new Error("Email is required");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    req.body.role = role || 0; // Valor por defecto
    req.body.photo = photo || "default_photo_url"; // Valor por defecto
    req.body.isOnline = isOnline || false; // Valor por defecto
    req.body.id = req.body.id || generateHexId(); // Genera un ID hexadecimal si no existe

    return next(); // Si todo es válido, avanza al siguiente middleware
  } catch (error) {
    error.statusCode = 400; // Establece el código de estado
    return next(error); // Pasa el error al siguiente middleware
  }
}

// Generar un ID hexadecimal
function generateHexId() {
  return crypto.randomBytes(12).toString("hex");
}

export default isValidDataUser;
