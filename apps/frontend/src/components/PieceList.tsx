import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Stack, Spinner, Alert } from 'react-bootstrap';
import { usePieces, useDeletePiece } from '../hooks/usePieces';
import type { Piece } from '../types/piece';
import PieceItem from './PieceItem';
import PieceForm from './PieceForm';

const PieceList: React.FC = () => {
    const [search, setSearch] = useState('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [modal, setModal] = useState<{ open: boolean; piece?: Piece | null }>({
        open: false,
        piece: null
    });

    const { data: pieces, isLoading, isError } = usePieces();
    const deleteMutation = useDeletePiece();

    const filtered = useMemo(() => {
        if (!pieces) return [];
        return pieces
            .filter(p => p.ruName.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const result = a.ruName.localeCompare(b.ruName, 'ru');
                return sortDir === 'asc' ? result : -result;
            });
    }, [pieces, search, sortDir]);

    const handleEdit = (piece: Piece) => {
        setModal({ open: true, piece });
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Удалить произведение?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleAdd = () => {
        setModal({ open: true, piece: null });
    };

    const handleCloseModal = () => {
        setModal({ open: false, piece: null });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="danger" className="mt-3">
                Не удалось загрузить список
            </Alert>
        );
    }

    return (
        <Container className="py-3">
            <Stack direction="horizontal" gap={3} className="mb-4 justify-content-between">
                <h4 className="mb-0">Произведения</h4>
                <Button variant="primary" onClick={handleAdd}>
                    [+Добавить]
                </Button>
            </Stack>

            <Row className="mb-3 g-2">
                <Col xs={8}>
                    <Form.Control
                        type="search"
                        placeholder="🔍 Поиск по названию (RU)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col xs={4}>
                    <Form.Select value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}>
                        <option value="asc">А-Я ▼</option>
                        <option value="desc">Я-А ▲</option>
                    </Form.Select>
                </Col>
            </Row>

            {filtered.length === 0 ? (
                <Alert variant="info">Ничего не найдено</Alert>
            ) : (
                filtered.map(piece => (
                    <PieceItem
                        key={piece.id}
                        piece={piece}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}

            {modal.open && (
                <PieceForm
                    piece={modal.piece}
                    onClose={handleCloseModal}
                />
            )}
        </Container>
    );
};

export default PieceList;
