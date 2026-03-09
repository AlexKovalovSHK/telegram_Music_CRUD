import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Piece } from './piece.entity';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Piece])],
    controllers: [PiecesController],
    providers: [PiecesService],
    exports: [TypeOrmModule, PiecesService],
})
export class PiecesModule { }
