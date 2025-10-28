import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailData {
  email: string;
  fullName: string;
  role: 'citizen' | 'expert' | 'admin';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { email, fullName, role }: WelcomeEmailData = await req.json()

    const subject = `Bienvenue sur YOON - Plateforme Juridique Sénégalaise, ${fullName}!`

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur YOON</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6B4C4C, #8A6A6A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #6B4C4C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>YOON</h1>
            <p>Plateforme Juridique Sénégalaise</p>
          </div>
          <div class="content">
            <h2>Bonjour ${fullName} !</h2>
            <p>Nous sommes ravis de vous accueillir sur <strong>YOON</strong>, votre plateforme de référence pour tous vos besoins juridiques au Sénégal.</p>

            <p>Vous êtes inscrit en tant que <strong>${role === 'citizen' ? 'Citoyen' : role === 'expert' ? 'Expert Juridique' : 'Administrateur'}</strong>.</p>

            <p>Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien dans l'email de confirmation que vous avez reçu.</p>

            <h3>Que pouvez-vous faire sur YOON ?</h3>
            <ul>
              ${role === 'citizen' ?
                `<li>Accéder à une base de données complète des lois sénégalaises</li>
                 <li>Consulter des experts juridiques qualifiés</li>
                 <li>Générer des documents juridiques personnalisés</li>
                 <li>Poser des questions à notre chatbot juridique</li>` :
                `<li>Publier et gérer vos spécialités juridiques</li>
                 <li>Recevoir des demandes de consultation</li>
                 <li>Accéder aux outils professionnels</li>
                 <li>Collaborer avec d'autres professionnels</li>`
              }
            </ul>

            <p>Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:support@yoon.sn">support@yoon.sn</a></p>

            <p>Cordialement,<br>L'équipe YOON</p>
          </div>
          <div class="footer">
            <p>Cette adresse email est surveillée. Veuillez ne pas y répondre directement.</p>
            <p>© 2024 YOON - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await supabaseClient.auth.admin.sendRawEmail({
      to: email,
      subject: subject,
      html: html,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})