import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function TableSkeleton({ columns = 5, rows = 10 }) {
  return (
    <div>
      <div className="rounded-md border">
        {/* Header Filter Skeleton */}
        <div className="p-3 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        {/* Table Skeleton */}
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-8 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
        <div className="text-sm text-muted-foreground">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
