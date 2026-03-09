import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiecesModule } from './pieces/pieces.module';
import { Piece } from './pieces/piece.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'libsql' as any,
            url: `file:${process.env.DB_PATH ?? 'data/db.sqlite'}`,
            entities: [Piece],
            synchronize: true,
        }),
        PiecesModule,
    ],
})
export class AppModule { }
