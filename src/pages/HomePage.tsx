import { Form } from "../components/Form";
import logo from "../../public/images/logo-eletropassos.png";
import instagram from "../../public/images/instagram.png";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section className="section-form">
        <img src={logo} alt="" className="logo" />
        <h1 className="titulo">JOGO DA MEMÓRIA</h1>

        <Form />
        <img src={instagram} alt="" className="logo instagram" />

        {/* 
<button onClick={() => navigate("/exportar")}>
  {" "}
  exportar **devonly{" "}
</button>
*/}
      </section>
    </>
  );
}
