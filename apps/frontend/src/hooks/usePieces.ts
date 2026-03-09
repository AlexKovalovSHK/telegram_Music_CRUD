import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPieces, fetchPiece, createPiece, updatePiece, deletePiece } from '../api/pieces';
import type { UpdatePiecePayload } from '../types/piece';

export const pieceKeys = {
    all: ['pieces'] as const,
    detail: (id: number) => ['pieces', id] as const,
};

export const usePieces = () =>
    useQuery({ queryKey: pieceKeys.all, queryFn: fetchPieces });

export const usePiece = (id: number) =>
    useQuery({ queryKey: pieceKeys.detail(id), queryFn: () => fetchPiece(id), enabled: !!id });

export const useCreatePiece = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPiece,
        onSuccess: () => qc.invalidateQueries({ queryKey: pieceKeys.all }),
    });
};

export const useUpdatePiece = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdatePiecePayload) =>
            updatePiece(id, body),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: pieceKeys.all });
            qc.invalidateQueries({ queryKey: pieceKeys.detail(id) });
        },
    });
};

export const useDeletePiece = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deletePiece,
        onSuccess: () => qc.invalidateQueries({ queryKey: pieceKeys.all }),
    });
};
