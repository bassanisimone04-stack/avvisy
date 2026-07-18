import { PageTitle } from "@/components/dash";
import { IconDoc } from "@/components/icons";
import { formatDate } from "@/lib/format";

const docs = [
  ["Fattura vendita ORD-2026-0139.pdf", "Fattura", "2026-07-02", "Emessa"],
  ["Nota commissione Scortvia — giugno.pdf", "Commissione", "2026-07-01", "Disponibile"],
  ["DDT ORD-2026-0132.pdf", "Trasporto", "2026-06-28", "Archiviato"],
  ["Certificato conformità cuscinetti.pdf", "Certificazione", "2026-07-04", "Allegato lotto"],
  ["Visura camerale Metalfer.pdf", "Verifica KYB", "2026-06-15", "Verificato"],
];

export default function DocumentiVenditorePage() {
  return (
    <>
      <PageTitle
        title="Documenti"
        subtitle="Fatture, note di commissione, DDT e documentazione di verifica (simulati)."
      />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Documento</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Stato</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {docs.map(([name, type, date, status]) => (
                <tr key={name} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <IconDoc width={16} height={16} className="text-muted" /> {name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{type}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(date)}</td>
                  <td className="px-4 py-3">
                    <span className="chip bg-brand-soft text-brand-dark">{status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm font-semibold text-brand-dark hover:underline">
                      Scarica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
