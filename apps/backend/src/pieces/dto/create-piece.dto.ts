import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePieceDto {
    @IsString()
    @IsNotEmpty()
    deNum: string;

    @IsString()
    @IsNotEmpty()
    deName: string;

    @IsString()
    @IsNotEmpty()
    ruNum: string;

    @IsString()
    @IsNotEmpty()
    ruName: string;
}
