import Joi from 'joi';

export const validateTeamMember = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        role: Joi.string().required().trim(),
        bio: Joi.string().allow('', null).trim(),
        image_url: Joi.string().uri().allow('', null).trim()
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

export const validateTeamMemberUpdate = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().trim(),
        role: Joi.string().trim(),
        bio: Joi.string().allow('', null).trim(),
        image_url: Joi.string().uri().allow('', null).trim()
    }).min(1);

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
