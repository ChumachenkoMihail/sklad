import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    description: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Yzg5OWQ5Yi0zMjkxLTRiZTAtYmQ1OS1lNDgzODI1ZDQyOTEiLCJlbWFpbCI6InVzZWZkc2dockBnbWFpbC5jb20iLCJpYXQiOjE2NzY2NzMyMjYsImV4cCI6MTY3NjY3NDEyNn0.R3bKxzWbBOdNAUHrkxP4i-d-mHWXMALZIyvJALPz3YE',
  })
  accessToken: string;

  @ApiProperty({
    description: 'refreshToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Yzg5OWQ5Yi0zMjkxLTRiZTAtYmQ1OS1lNDgzODI1ZDQyOTEiLCJlbWFpbCI6InVzZWZkc2dockBnbWFpbC5jb20iLCJpYXQiOjE2NzY2NzMyMjYsImV4cCI6MTY3NjY3NDEyNn0.R3bKxzWbBOdNAUHrkxP4i-d-mHWXMALZIyvJALPz3YE',
  })
  refreshToken: string;
}
