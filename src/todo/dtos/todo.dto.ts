import Joi from "joi";

export let TodoDataSchema = Joi.object({
    description: Joi.string().min(1).max(30).required()
});

export interface TodoDto {
    description: string;
}
