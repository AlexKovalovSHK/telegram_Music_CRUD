import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('piece')
export class Piece {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    deNum: string;

    @Column()
    deName: string;

    @Column()
    ruNum: string;

    @Column()
    ruName: string;
}
