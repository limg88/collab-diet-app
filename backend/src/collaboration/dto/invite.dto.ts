import { IsEmail } from 'class-validator';

export class InviteDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
