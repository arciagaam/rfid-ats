'use client'
import React from 'react'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
} from '@tanstack/react-table'

import { DataTablePagination } from '@/components/global/datatable/pagination'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { CardHeader } from '../../ui/card'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    noPagination?: boolean
    initialPageSize?: number
    component?: React.ReactNode
    columnSearch?: string
    searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    component,
    noPagination,
    initialPageSize,
    columnSearch,
    searchPlaceholder,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: initialPageSize ?? 10,
                pageIndex: 0,
            },
        },
    })

    return (
        <div className='flex flex-col gap-3'>
            <CardHeader className='px-0 pb-3'>
                <div className='flex justify-between'>
                    {columnSearch && (
                        <Input
                            placeholder={`${searchPlaceholder ?? 'Search'}`}
                            value={
                                (table.getColumn(columnSearch)?.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                table.getColumn(columnSearch)?.setFilterValue(event.target.value)
                            }
                            className='max-w-sm'
                        />
                    )}

                    <div>{component}</div>
                </div>
            </CardHeader>

            <div className='border rounded-md bg-white'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            {...{
                                                key: cell.id,
                                                style: {
                                                    width: cell.column.getSize(),
                                                },
                                            }}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!noPagination && <DataTablePagination table={table} />}
        </div>
    )
}
