import { useState, useEffect } from "react";
import "./customcalculadora.css";
import logo from "../../assets/logoba.png";


export default function CalculadoraPreco() {
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotalGarimpo, setValorTotalGarimpo] = useState(0);
  const [custosFixosGerais, setCustosFixosGerais] = useState(0);
  const [proLabore, setProLabore] = useState(0);
  const [custosVariaveis, setCustosVariaveis] = useState(0);
  const [margemLucro, setMargemLucro] = useState(0);
  const [animar, setAnimar] = useState(false);

  const custoUnitario = quantidade > 0 ? valorTotalGarimpo / quantidade : 0;
  const custosTotaisFixos =
    Number(custosFixosGerais) + Number(proLabore) + Number(custosVariaveis);
  const custoTotalPorPeca =
    quantidade > 0 ? (valorTotalGarimpo + custosTotaisFixos) / quantidade : 0;
  const precoIdeal = custoTotalPorPeca * (1 + margemLucro / 100);

  useEffect(() => {
    if (!isNaN(precoIdeal) && precoIdeal > 0) {
      setAnimar(true);
      const timer = setTimeout(() => setAnimar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [precoIdeal]);

  const limparCampos = () => {
    setQuantidade(0);
    setValorTotalGarimpo(0);
    setCustosFixosGerais(0);
    setProLabore(0);
    setCustosVariaveis(0);
    setMargemLucro(0);
  };

  return (
    <div>
      <header>
        <div className="container">
          <img
          src={logo}
          alt="Logo Brechó Academy"
          className="logo"
          />
        </div>
      </header>

      <main>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="card">
            <h2>Calculadora de Preços para Brechó</h2>

            {/* Passo 1 */}
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
                onChange={(e) =>
                  setValorTotalGarimpo(Number(e.target.value) || 0)
                }
              />

              <p>Custo unitário: R$ {custoUnitario.toFixed(2)}</p>
            </section>

            {/* Passo 2 */}
            <section>
              <h3>Passo 2: Custos Operacionais</h3>

              <label>Custos fixos gerais (R$)</label>
              <input
                type="number"
                value={custosFixosGerais || ""}
                onChange={(e) =>
                  setCustosFixosGerais(Number(e.target.value) || 0)
                }
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
                onChange={(e) =>
                  setCustosVariaveis(Number(e.target.value) || 0)
                }
              />

              <p>Total de custos: R$ {custosTotaisFixos.toFixed(2)}</p>
            </section>

            {/* Passo 3 */}
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

            {/* Resultado Final */}
            <section className={`resultado ${animar ? "fade-in" : ""}`}>
              <h3>💰 Resumo Final</h3>
              <p>
                Custos totais:{" "}
                <strong>R$ {custosTotaisFixos.toFixed(2)}</strong>
              </p>
              <p>
                Margem aplicada: <strong>{margemLucro.toFixed(0)}%</strong>
              </p>
              <p className="preco-final">
                Preço ideal por peça:{" "}
                <strong>R$ {precoIdeal.toFixed(2)}</strong>
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
