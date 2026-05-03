import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    let payload: any = {};

    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ ok: true, message: "Sem JSON" }), {
        status: 200,
      });
    }

    console.log("Webhook Eduzz recebido:", payload);

    if (!payload?.event) {
      return new Response(JSON.stringify({ ok: true, message: "Verificação OK" }), {
        status: 200,
      });
    }

    const event = payload.event;
    const buyerEmail = payload?.data?.buyer?.email;
    const buyerName = payload?.data?.buyer?.name;

    if (!buyerEmail) {
      return new Response(JSON.stringify({ ok: true, message: "Sem email no payload" }), {
        status: 200,
      });
    }

    const supabaseUrl = Deno.env.get("PROJECT_URL")!;
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (event === "myeduzz.invoice_paid") {
      const temporaryPassword = crypto.randomUUID();

      const { data: createdUser, error: createUserError } =
        await supabase.auth.admin.createUser({
          email: buyerEmail,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            name: buyerName,
            origem: "eduzz",
          },
        });

      if (createUserError && !createUserError.message.includes("already")) {
        console.error("Erro ao criar usuário:", createUserError);
      }

      let userId = createdUser?.user?.id;

      if (!userId) {
        const { data: usersList, error: listError } =
          await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const existingUser = usersList.users.find(
          (user) => user.email === buyerEmail
        );

        userId = existingUser?.id;
      }

      if (!userId) {
        return new Response(JSON.stringify({ error: "Não foi possível obter user_id" }), {
          status: 500,
        });
      }

      const { error: upsertError } = await supabase.from("usuarios").upsert(
        {
          email: buyerEmail,
          user_id: userId,
          acesso: true,
        },
        {
          onConflict: "email",
        }
      );

      if (upsertError) throw upsertError;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        buyerEmail,
       {
        redirectTo: "https://app.kalindyrodrigues.com.br/reset-password",
       }
      );

      if (resetError) {
        console.error("Erro ao enviar email de criação de senha:", resetError);
      } else {
        console.log("Email de criação de senha enviado para:", buyerEmail);
      }

      return new Response(JSON.stringify({ ok: true, message: "Acesso liberado" }), {
        status: 200,
      });
    }

    if (
      event === "myeduzz.invoice_canceled" ||
      event === "myeduzz.invoice_waiting_refund"
    ) {
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({ acesso: false })
        .eq("email", buyerEmail);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ ok: true, message: "Acesso bloqueado" }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ ok: true, message: "Evento ignorado", event }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erro no webhook:", error);

    return new Response(JSON.stringify({ error: String(error?.message || error) }), {
      status: 500,
    });
  }
});