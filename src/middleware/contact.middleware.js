import Joi from 'joi';

export const validateContactSubmission = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        phone: Joi.string().allow('', null).trim(),
        subject: Joi.string().allow('', null).trim(),
        message: Joi.string().required().trim()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map(d => ({ field: d.path[0], message: d.message }))
        });
    }

    req.validated = value;
    next();
};

export const validateTemplateUpdate = (req, res, next) => {
    const schema = Joi.object({
        subject: Joi.string().required().trim(),
        body: Joi.string().required().trim()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map(d => ({ field: d.path[0], message: d.message }))
        });
    }

    req.validated = value;
    next();
};
