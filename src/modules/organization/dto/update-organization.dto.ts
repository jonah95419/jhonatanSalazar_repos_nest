import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { MessageValues } from '../../../constants/MessageValues';

@Exclude()
export class UpdateOrganizationDto {
  @Expose()
  @IsNotEmpty({ message: MessageValues.REQUEST_ID_EMPTY })
  @IsNumber()
  readonly id_organization: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: MessageValues.MESSAGE_400 })
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly status: number;
}
