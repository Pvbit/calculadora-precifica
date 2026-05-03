import { useState, useEffect } from "react";
import "./customcalculadora.css";
import logo from "../../assets/logoba.png";
import { supabase } from "../../lib/supabase";

export default function CalculadoraPreco() {
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotalGarimpo, setValorTotalGarimpo] = useState(0);
  const [custosFixosGerais, setCustosFixosGerais] = useState(0);
  const [proLabore, setProLabore] = useState(0);
  const [custosVariaveis, setCustosVariaveis] = useState(0);
  const [margemLucro, setMargemLucro] = useState(0);
  const [animar, setAnimar] = useState(false);

  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  const custoUnitario = quantidade > 0 ? valorTotalGarimpo / quantidade : 0;

  const custosTotaisFixos =
    Number(custosFixosGerais) + Number(proLabore) + Number(custosVariaveis);

  const custoTotalPorPeca =
    quantidade > 0 ? (Number(valorTotalGarimpo) + custosTotaisFixos) / quantidade : 0;

  const precoIdeal = custoTotalPorPeca * (1 + Number(margemLucro) / 100);

  useEffect(() => {
    if (!isNaN(precoIdeal) && precoIdeal > 0) {
      setAnimar(true);
      const timer = setTimeout(() => setAnimar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [precoIdeal]);

  useEffect(() => {
    async function verificarAcesso() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          window.location.href = "/login?erro=sem-acesso";
          return;
        }

        const { data, error } = await supabase
          .from("usuarios")
          .select("id, email, acesso, user_id")
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          console.error("Erro ao buscar usuário:", error);
          alert("Seu acesso não foi encontrado. Faça login novamente ou fale com o suporte.");
          await supabase.auth.signOut();
          window.location.href = "/login?erro=sem-acesso";
          return;
        }

        if (data.acesso !== true) {
          alert("Seu acesso à calculadora está bloqueado.");
          await supabase.auth.signOut();
          window.location.href = "/login?erro=sem-acesso";
          return;
        }

        setAutorizado(true);
      } catch (err) {
        console.error("Erro inesperado ao validar acesso:", err);
        alert("Erro ao validar seu acesso.");
        await supabase.auth.signOut();
        window.location.href = "/login?erro=sem-acesso";
      } finally {
        setLoading(false);
      }
    }

    verificarAcesso();
  }, []);

  const limparCampos = () => {
    setQuantidade(0);
    setValorTotalGarimpo(0);
    setCustosFixosGerais(0);
    setProLabore(0);
    setCustosVariaveis(0);
    setMargemLucro(0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Verificando acesso...</h2>
      </div>
    );
  }

  if (!autorizado) {
    return null;
  }

  return (
    <div>
      <header>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="Logo Brechó Academy" className="logo" />

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#c61d1d",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="card">
            <h2>Calculadora de Preços para Brechó</h2>

            <section>
              <h3>Passo 1: Garimpo</h3>

              <label>Quantidade de peças</label>
              <input
                type="number"
                value={quantidade || ""}
                onChange={(e) => setQuantidade(Number(e.target.value) || 0)}
              />

              <label>Valor total do garimpo (R$)</label>
              <input
                type="number"
                value={valorTotalGarimpo || ""}
                onChange={(e) => setValorTotalGarimpo(Number(e.target.value) || 0)}
              />

              <p>Custo unitário: R$ {custoUnitario.toFixed(2)}</p>
            </section>

            <section>
              <h3>Passo 2: Custos Operacionais</h3>

              <label>Custos fixos gerais (R$)</label>
              <input
                type="number"
                value={custosFixosGerais || ""}
                onChange={(e) => setCustosFixosGerais(Number(e.target.value) || 0)}
              />

              <label>Pró-labore (R$)</label>
              <input
                type="number"
                value={proLabore || ""}
                onChange={(e) => setProLabore(Number(e.target.value) || 0)}
              />

              <label>Custos variáveis (R$)</label>
              <input
                type="number"
                value={custosVariaveis || ""}
                onChange={(e) => setCustosVariaveis(Number(e.target.value) || 0)}
              />

              <p>Total de custos: R$ {custosTotaisFixos.toFixed(2)}</p>
            </section>

            <section>
              <h3>Passo 3: Margem de Lucro</h3>

              <label>Margem de lucro desejada (%)</label>
              <input
                type="number"
                value={margemLucro || ""}
                onChange={(e) => setMargemLucro(Number(e.target.value) || 0)}
              />

              <p>Custo total por peça: R$ {custoTotalPorPeca.toFixed(2)}</p>
            </section>

            <section className={`resultado ${animar ? "fade-in" : ""}`}>
              <h3>💰 Resumo Final</h3>
              <p>
                Custos totais: <strong>R$ {custosTotaisFixos.toFixed(2)}</strong>
              </p>
              <p>
                Margem aplicada: <strong>{margemLucro.toFixed(0)}%</strong>
              </p>
              <p className="preco-final">
                Preço ideal por peça: <strong>R$ {precoIdeal.toFixed(2)}</strong>
              </p>
            </section>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button type="button" onClick={limparCampos}>
                Limpar Campos
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}