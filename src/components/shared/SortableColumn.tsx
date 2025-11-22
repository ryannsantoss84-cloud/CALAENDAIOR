import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortDirection } from "@/hooks/useSorting";

interface SortableColumnProps {
    label: string;
    sortKey: string;
    currentSortKey: string;
    currentSortDirection: SortDirection;
    onSort: (key: string) => void;
    className?: string;
}

export function SortableColumn({
    label,
    sortKey,
    currentSortKey,
    currentSortDirection,
    onSort,
    className = "",
}: SortableColumnProps) {
    const isActive = currentSortKey === sortKey;

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => onSort(sortKey)}
            className={`-ml-3 h-8 data-[state=open]:bg-accent hover:bg-muted/50 ${className}`}
        >
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            {isActive ? (
                currentSortDirection === "asc" ? (
                    <ArrowUp className="ml-2 h-3 w-3" />
                ) : (
                    <ArrowDown className="ml-2 h-3 w-3" />
                )
            ) : (
                <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50" />
            )}
        </Button>
    );
}
