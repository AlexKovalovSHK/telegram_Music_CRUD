import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Piece } from './piece.entity';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';

@Injectable()
export class PiecesService {
    constructor(
        @InjectRepository(Piece)
        private pieceRepository: Repository<Piece>,
    ) { }

    findAll(): Promise<Piece[]> {
        return this.pieceRepository.find();
    }

    async findOne(id: number): Promise<Piece> {
        const piece = await this.pieceRepository.findOneBy({ id });
        if (!piece) {
            throw new NotFoundException(`Piece with id ${id} not found`);
        }
        return piece;
    }

    create(createPieceDto: CreatePieceDto): Promise<Piece> {
        const piece = this.pieceRepository.create(createPieceDto);
        return this.pieceRepository.save(piece);
    }

    async update(id: number, updatePieceDto: UpdatePieceDto): Promise<Piece> {
        const piece = await this.findOne(id);
        const updatedPiece = Object.assign(piece, updatePieceDto);
        return this.pieceRepository.save(updatedPiece);
    }

    async remove(id: number): Promise<{ id: number }> {
        const piece = await this.findOne(id);
        await this.pieceRepository.remove(piece);
        return { id };
    }
}
