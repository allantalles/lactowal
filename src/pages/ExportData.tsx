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
      "Tipo de Pessoa", // 👈 Adicionado
      "Tempo (s)",
      "Movimentos",
    ];
    const rows = data.map((item: any) => [
      item.id,
      item.nome,
      item.email,
      item.celular,
      item.tipoPessoa === "fisica" ? "Pessoa Física" : 
      item.tipoPessoa === "juridica" ? "Pessoa Jurídica" : 
      "Não informado", // 👈 Adicionado - trata dados antigos
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