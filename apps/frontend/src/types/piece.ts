export interface Piece {
    id: number;
    deNum: string;
    deName: string;
    ruNum: string;
    ruName: string;
}

export type CreatePiecePayload = Omit<Piece, 'id'>;
export type UpdatePiecePayload = Partial<CreatePiecePayload>;
