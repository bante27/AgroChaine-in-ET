
import AppError from '../utils/appError.js';

export default function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            const errorMessage = error.errors
                ? error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
                : error.message;
            return next(new AppError(errorMessage, 400));
        }
    };
}
