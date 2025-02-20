import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO for updating an existing product.
 * Inherits all properties from CreateProductDto but makes them optional.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
