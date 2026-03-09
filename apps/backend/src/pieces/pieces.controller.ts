import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';

@Controller('pieces')
export class PiecesController {
    constructor(private readonly piecesService: PiecesService) { }

    @Get()
    findAll() {
        return this.piecesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.piecesService.findOne(id);
    }

    @Post()
    create(@Body() createPieceDto: CreatePieceDto) {
        return this.piecesService.create(createPieceDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePieceDto: UpdatePieceDto,
    ) {
        return this.piecesService.update(id, updatePieceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.piecesService.remove(id);
    }
}
