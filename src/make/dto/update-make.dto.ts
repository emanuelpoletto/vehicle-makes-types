import { PartialType } from '@nestjs/mapped-types';
import { CreateMakeDto } from './create-make.dto';

export class UpdateMakeDto extends PartialType(CreateMakeDto) {}
