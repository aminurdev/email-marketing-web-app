'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface MobileTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (value: unknown, item: T) => ReactNode;
  }[];
  onSelect?: (id: string, checked: boolean) => void;
  selectedItems?: string[];
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
}

export function MobileTable<T extends Record<string, unknown> & { _id: string }>({ 
  data, 
  columns, 
  onSelect, 
  selectedItems = [], 
  actions,
  emptyMessage = "No data available"
}: MobileTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <Card key={item._id || index} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {onSelect && (
                <div className="flex-shrink-0 pt-1">
                  <Checkbox
                    checked={selectedItems.includes(item._id)}
                    onCheckedChange={(checked) => onSelect(item._id, !!checked)}
                    className="touch-manipulation"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0 space-y-2">
                {columns.map((column) => {
                  const value = item[column.key as keyof T];
                  const displayValue = column.render ? column.render(value, item) : String(value || '');
                  
                  return (
                    <div key={column.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide sm:w-24 flex-shrink-0">
                        {column.label}
                      </div>
                      <div className="text-sm font-medium text-foreground break-words">
                        {displayValue}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {actions && (
                <div className="flex-shrink-0">
                  {actions(item)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Desktop table component for larger screens
interface DesktopTableProps<T = Record<string, unknown>> extends MobileTableProps<T> {
  showSelectAll?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

export function DesktopTable<T extends Record<string, unknown> & { _id: string }>({ 
  data, 
  columns, 
  onSelect, 
  selectedItems = [], 
  actions,
  showSelectAll,
  onSelectAll,
  emptyMessage = "No data available"
}: DesktopTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {onSelect && (
              <th className="text-left p-3 w-12">
                {showSelectAll && onSelectAll && (
                  <Checkbox
                    checked={selectedItems.length === data.length && data.length > 0}
                    onCheckedChange={onSelectAll}
                    className="touch-manipulation"
                  />
                )}
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} className="text-left p-3 text-sm font-medium text-muted-foreground">
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id || index} className="border-b hover:bg-muted/50">
              {onSelect && (
                <td className="p-3">
                  <Checkbox
                    checked={selectedItems.includes(item._id)}
                    onCheckedChange={(checked) => onSelect(item._id, !!checked)}
                    className="touch-manipulation"
                  />
                </td>
              )}
              {columns.map((column) => {
                const value = item[column.key as keyof T];
                const displayValue = column.render ? column.render(value, item) : String(value || '');
                
                return (
                  <td key={column.key} className="p-3 text-sm">
                    {displayValue}
                  </td>
                );
              })}
              {actions && (
                <td className="p-3 text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Responsive table that switches between mobile and desktop views
export function ResponsiveTable<T extends Record<string, unknown> & { _id: string }>(props: DesktopTableProps<T>) {
  return (
    <>
      <div className="block lg:hidden">
        <MobileTable {...props} />
      </div>
      <div className="hidden lg:block">
        <DesktopTable {...props} />
      </div>
    </>
  );
}