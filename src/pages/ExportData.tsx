export default function Export() {
  const exportCSV = () => {
    const existing = localStorage.getItem("formData");
    if (!existing) {
      alert("Nenhum dado para exportar.");
      return;
    }

    const data = JSON.parse(existing);

    const headers = [
      "ID",
      "Nome",
      "Email",
      "Celular",
      "Tempo (s)",
      "Movimentos",
    ];
    const rows = data.map((item: any) => [
      item.id,
      item.nome,
      item.email,
      item.celular,
      item.tempo ?? "--",
      item.movimentos ?? "--",
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((r: any) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `cadastros-clientes.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="section-form">
        <div style={{ marginTop: "20px" }}>
          <button onClick={exportCSV}>Exportar CSV</button>
        </div>
      </section>
    </>
  );
}
