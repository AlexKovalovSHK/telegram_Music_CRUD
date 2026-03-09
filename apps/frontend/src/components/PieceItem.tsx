import React from 'react';
import { Card, Button, Stack } from 'react-bootstrap';
import type { Piece } from '../types/piece';

interface PieceItemProps {
    piece: Piece;
    onEdit: (piece: Piece) => void;
    onDelete: (id: number) => void;
}

const PieceItem: React.FC<PieceItemProps> = ({ piece, onEdit, onDelete }) => {
    return (
        <Card className="mb-2 shadow-sm">
            <Card.Body>
                <Stack direction="horizontal" gap={3} className="justify-content-between align-items-start">
                    <div>
                        <div className="fw-bold">
                            {piece.ruNum}. {piece.ruName}
                        </div>
                        <div className="text-muted small">
                            {piece.deNum}. {piece.deName}
                        </div>
                    </div>
                    <Stack direction="horizontal" gap={2}>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => onEdit(piece)}
                            title="Edit"
                        >
                            ✏️
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(piece.id)}
                            title="Delete"
                        >
                            🗑️
                        </Button>
                    </Stack>
                </Stack>
            </Card.Body>
        </Card>
    );
};

export default PieceItem;
