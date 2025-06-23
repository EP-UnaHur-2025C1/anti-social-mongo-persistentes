const existsModelById = (modelo) => {
    return async (req, res, next) => {
        const id = req.params.id;

        // Validar formato de ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: `El id ${id} no es válido` });
        }

        try {
            const data = await modelo.findById(id);
            if (!data) {
                return res.status(404).json({ message: El `id ${id} no se encuentra registrado` });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Error en la validación del id', error: error.message });
        }
    };
};

const schemaValidator = (schema) => {
    return (req, res, next) => {
        const { error, _ } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errores = error.details.map(e => ({
                atributo: e.path[0],
                mensaje: e.message,
                tipoError: e.type
            }));
            return res.status(400).json({ errores });
        }
        next();
    };
};

module.exports = { existsModelById, schemaValidator };