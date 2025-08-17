interface ExportButtonProps {
  onExport: () => void;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <button className="export-button" onClick={onExport}>
      <span className="export-icon">💾</span>
      Export JSON
    </button>
  );
}
