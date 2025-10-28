import "./styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Instale com: npm install uuid

export function Form() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const navigate = useNavigate();

  // Protege saída da página se houver dados incompletos
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (nome || email || celular) {
        e.preventDefault();
        e.returnValue = ""; // necessário para exibir o alerta
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [nome, email, celular]);

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
      value = value.replace(/^(\d*)$/, "($1");
    }

    setCelular(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = uuidv4(); // gera ID único
    const newEntry = {
      id,
      nome,
      email,
      celular,
      tempo: null, // será preenchido após o jogo
    };

    const existing = localStorage.getItem("formData");
    const data = existing ? JSON.parse(existing) : [];

    data.push(newEntry);
    localStorage.setItem("formData", JSON.stringify(data));
    localStorage.setItem("jogadorAtual", id); // marca jogador atual

    setNome("");
    setEmail("");
    setCelular("");

    navigate("/game");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nome" className="label">
          Nome
        </label>
        <input
          type="text"
          name="nome"
          placeholder="Seu nome aqui..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Seu email aqui..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="celular" className="label">
          Celular
        </label>
        <input
          type="text"
          name="celular"
          placeholder="(99) 99999-9999"
          value={celular}
          onChange={handleCelularChange}
          maxLength={15}
          required
        />
      </div>
      <button type="submit" className="botao">
        Vamos começar!
      </button>
    </form>
  );
}
