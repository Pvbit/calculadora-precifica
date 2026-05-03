import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const alterarSenha = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      setMensagem("Erro ao alterar senha: " + error.message);
    } else {
      setMensagem("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "20px" }}>
      <h2>Redefinir senha</h2>

      <form onSubmit={alterarSenha}>
        <label>Nova senha</label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Digite sua nova senha"
          required
          minLength={6}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Alterando..." : "Alterar senha"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}