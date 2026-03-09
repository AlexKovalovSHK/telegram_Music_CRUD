import type { Piece, CreatePiecePayload, UpdatePiecePayload } from '../types/piece';

//const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const BASE = '/api';

export const fetchPieces = (): Promise<Piece[]> =>
    fetch(`${BASE}/pieces`).then(r => {
        if (!r.ok) throw new Error('Failed to fetch pieces');
        return r.json();
    });

export const fetchPiece = (id: number): Promise<Piece> =>
    fetch(`${BASE}/pieces/${id}`).then(r => {
        if (!r.ok) throw new Error('Failed to fetch piece');
        return r.json();
    });

export const createPiece = (body: CreatePiecePayload): Promise<Piece> =>
    fetch(`${BASE}/pieces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(r => {
        if (!r.ok) throw new Error('Failed to create piece');
        return r.json();
    });

export const updatePiece = (id: number, body: UpdatePiecePayload): Promise<Piece> =>
    fetch(`${BASE}/pieces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(r => {
        if (!r.ok) throw new Error('Failed to update piece');
        return r.json();
    });

export const deletePiece = (id: number): Promise<{ id: number }> =>
    fetch(`${BASE}/pieces/${id}`, { method: 'DELETE' }).then(r => {
        if (!r.ok) throw new Error('Failed to delete piece');
        return r.json();
    });
