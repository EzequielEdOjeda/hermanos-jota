import { crearError } from "../utils/httpError.js";

// 24 caracteres hexadecimales. (mongoose.isValidObjectId también acepta
// cualquier string de 12 caracteres, por eso se usa una regex más estricta).
const REGEX_OBJECT_ID = /^[a-f\d]{24}$/i;

/**
 * Devuelve un middleware que responde 400 si req.params[param] no es un
 * ObjectId válido, evitando que Mongoose llegue a lanzar un CastError.
 */
export function validarObjectId(param = "id") {
  return (req, res, next) => {
    if (!REGEX_OBJECT_ID.test(req.params[param])) {
      return next(crearError(400, `El ${param} "${req.params[param]}" no es válido`));
    }
    next();
  };
}
