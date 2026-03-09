import { IsString, IsOptional } from 'class-validator';

export class UpdatePieceDto {
    @IsString()
    @IsOptional()
    deNum?: string;

    @IsString()
    @IsOptional()
    deName?: string;

    @IsString()
    @IsOptional()
    ruNum?: string;

    @IsString()
    @IsOptional()
    ruName?: string;
}
