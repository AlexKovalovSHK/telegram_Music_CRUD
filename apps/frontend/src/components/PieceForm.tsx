import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { Piece, CreatePiecePayload } from '../types/piece';
import { useCreatePiece, useUpdatePiece } from '../hooks/usePieces';

interface PieceFormProps {
    piece?: Piece | null;
    onClose: () => void;
}

const PieceForm: React.FC<PieceFormProps> = ({ piece, onClose }) => {
    const [formData, setFormData] = useState<CreatePiecePayload>({
        ruNum: '',
        ruName: '',
        deNum: '',
        deName: '',
    });

    const createMutation = useCreatePiece();
    const updateMutation = useUpdatePiece();

    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (piece) {
            setFormData({
                ruNum: piece.ruNum,
                ruName: piece.ruName,
                deNum: piece.deNum,
                deName: piece.deName,
            });
        } else {
            setFormData({
                ruNum: '',
                ruName: '',
                deNum: '',
                deName: '',
            });
        }
    }, [piece]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (piece) {
            updateMutation.mutate({ id: piece.id, ...formData }, { onSuccess: onClose });
        } else {
            createMutation.mutate(formData, { onSuccess: onClose });
        }
    };

    return (
        <Modal show onHide={onClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{piece ? 'Edit Piece' : 'Add Piece'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Номер (RU)</Form.Label>
                        <Form.Control
                            name="ruNum"
                            value={formData.ruNum}
                            onChange={handleChange}
                            placeholder="1."
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Название (RU)</Form.Label>
                        <Form.Control
                            name="ruName"
                            value={formData.ruName}
                            onChange={handleChange}
                            placeholder="Соната"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Номер (DE)</Form.Label>
                        <Form.Control
                            name="deNum"
                            value={formData.deNum}
                            onChange={handleChange}
                            placeholder="1."
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Название (DE)</Form.Label>
                        <Form.Control
                            name="deName"
                            value={formData.deName}
                            onChange={handleChange}
                            placeholder="Sonate"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={isPending}>
                        Отмена
                    </Button>
                    <Button variant="primary" type="submit" disabled={isPending}>
                        {isPending ? <Spinner animation="border" size="sm" /> : 'Сохранить'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PieceForm;
