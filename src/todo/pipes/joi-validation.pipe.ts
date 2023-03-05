import {Injectable, NotAcceptableException, PipeTransform, ArgumentMetadata} from "@nestjs/common";
import {ObjectSchema} from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly objectSchema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata): any {
        let { error } = this.objectSchema.validate(value);

        if (error) {
            throw new NotAcceptableException({
                messages: "Invalid description.",
                data: error
            });
        }

        return value;
    }
}
