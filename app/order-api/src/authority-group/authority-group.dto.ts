import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';
import {
  AuthorityJSON,
  AuthorityResponseDto,
} from 'src/authority/authority.dto';

export class GetAllAuthorityGroupsDto {
  @ApiProperty({ required: false })
  @AutoMap()
  @IsOptional()
  role?: string;

  @ApiProperty({ required: false })
  @AutoMap()
  @IsOptional()
  inRole?: boolean;
}

export class CreateAuthorityGroupDto {}

export class UpdateAuthorityGroupDto {}

export class AuthorityGroupResponseDto extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  code: string;

  @ApiProperty()
  @AutoMap()
  description?: string;

  @ApiProperty()
  @AutoMap(() => AuthorityResponseDto)
  authorities: AuthorityResponseDto[];
}

export class AuthorityGroupJSON {
  @AutoMap()
  group: string;

  @AutoMap()
  code: string;

  @AutoMap(() => AuthorityJSON)
  authorities: AuthorityJSON[];
}
