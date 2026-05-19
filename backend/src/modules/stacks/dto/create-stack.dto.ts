import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateStackDto {
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  idea!: string

  @IsOptional()
  @IsObject()
  selections?: Record<string, string>
}
