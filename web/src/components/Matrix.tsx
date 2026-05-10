import { useMemo } from "react";
import {
  ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import type { StateRecord } from "../data/state.schema";
import type { Profile } from "../data/profile.schema";
import { computeWeighted, ScoredRow } from "../scoring";

interface Row extends ScoredRow {
  name: string;
}

interface Props {
  states: StateRecord[];
  profile: Profile;
}

const fmtUsd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const fmtPct = (n: number) => `${n.toFixed(1)}`;

export function Matrix({ states, profile }: Props) {
  const rows = useMemo<Row[]>(() => {
    const scored = computeWeighted(states, profile);
    const byCode = new Map(scored.map((r) => [r.code, r]));
    return states.map((s) => ({ ...byCode.get(s.code)!, name: s.name }));
  }, [states, profile]);

  const columns = useMemo<ColumnDef<Row>[]>(() => [
    { accessorKey: "name", header: "State" },
    { accessorKey: "totalTaxBurden", header: "Tax burden", cell: (c) => fmtUsd(c.getValue<number>()) },
    { accessorKey: "colAdjustedIncome", header: "COL-adj income", cell: (c) => fmtUsd(c.getValue<number>()) },
    { accessorKey: "moneyScore", header: "Money", cell: (c) => fmtPct(c.getValue<number>()) },
    { accessorKey: "climateScore", header: "Climate", cell: (c) => fmtPct(c.getValue<number>()) },
    { accessorKey: "lifestyleScore", header: "Lifestyle", cell: (c) => fmtPct(c.getValue<number>()) },
    { accessorKey: "weightedScore", header: "Weighted", cell: (c) => fmtPct(c.getValue<number>()) },
  ], []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: "weightedScore", desc: true }] },
  });

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th
                key={h.id}
                onClick={h.column.getToggleSortingHandler()}
                style={{ cursor: "pointer", textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}
              >
                {flexRender(h.column.columnDef.header, h.getContext())}
                {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((r) => (
          <tr key={r.id}>
            {r.getVisibleCells().map((c) => (
              <td key={c.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {flexRender(c.column.columnDef.cell, c.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
