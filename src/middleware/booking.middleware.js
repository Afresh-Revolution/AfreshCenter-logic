import Joi from 'joi';

export const validateBooking = (req, res, next) => {
    const schema = Joi.object({
        full_name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        phone_number: Joi.string().required().trim(),
        company: Joi.string().allow('', null).trim(),
        project_details: Joi.string().required().trim()
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

export const validateBookingTemplateUpdate = (req, res, next) => {
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
