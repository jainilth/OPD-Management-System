import { TableCell, TableRow } from "@/components/ui/Table";

interface TableSkeletonRowsProps {
    columns: number;
    rows?: number;
}

export function TableSkeletonRows({ columns, rows = 5 }: TableSkeletonRowsProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: columns }).map((__, cellIndex) => (
                        <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
