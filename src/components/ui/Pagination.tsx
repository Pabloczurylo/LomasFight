import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    // Build page number window: always show first, last, current ±1
    const getPages = () => {
        const pages: (number | 'ellipsis')[] = [];
        const delta = 1;
        const range: number[] = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        pages.push(1);
        if (range[0] > 2) pages.push('ellipsis');
        pages.push(...range);
        if (range[range.length - 1] < totalPages - 1) pages.push('ellipsis');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    return (
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3', className)}>
            <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                Mostrando <span className="font-bold text-gray-700">{start}–{end}</span> de{' '}
                <span className="font-bold text-gray-700">{totalItems}</span> registros
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-brand-red hover:text-brand-red disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Página anterior"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPages().map((page, idx) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                'w-8 h-8 rounded-lg border text-sm font-bold transition-all',
                                currentPage === page
                                    ? 'bg-brand-red text-white border-brand-red shadow-sm shadow-red-200'
                                    : 'border-gray-200 text-gray-600 hover:border-brand-red hover:text-brand-red'
                            )}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-brand-red hover:text-brand-red disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Página siguiente"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
