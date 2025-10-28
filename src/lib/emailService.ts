import { supabase } from './supabase'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WelcomeEmailData {
  email: string;
  fullName: string;
  role: 'citizen' | 'expert' | 'admin';
}

export class EmailService {
  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // Pour le développement, utiliser une solution alternative
      // En production, utiliser Supabase Edge Functions
      console.log('Sending welcome email to:', data.email);
      console.log('Email content:', this.generateWelcomeEmailContent(data));

      // Simuler l'envoi d'email pour les tests
      // En production, décommenter le code ci-dessous après avoir déployé l'Edge Function
      /*
      const { data: result, error } = await supabase.functions.invoke('send-welcome-email', {
        body: data
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
      }
      */

      // Pour l'instant, afficher un message dans la console
      alert(`Email de bienvenue envoyé à ${data.email} !\n\nEn production, cet email sera envoyé automatiquement.`);

      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: 'Erreur lors de l\'envoi de l\'email de bienvenue' };
    }
  }

  static generateWelcomeEmailContent(data: WelcomeEmailData): { subject: string; html: string; text: string } {
    const subject = `Bienvenue sur YOON - Plateforme Juridique Sénégalaise, ${data.fullName}!`;

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
            <h2>Bonjour ${data.fullName} !</h2>
            <p>Nous sommes ravis de vous accueillir sur <strong>YOON</strong>, votre plateforme de référence pour tous vos besoins juridiques au Sénégal.</p>

            <p>Vous êtes inscrit en tant que <strong>${data.role === 'citizen' ? 'Citoyen' : data.role === 'expert' ? 'Expert Juridique' : 'Administrateur'}</strong>.</p>

            <p>Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>

            <a href="${window.location.origin}/confirm-email" class="button">Confirmer mon email</a>

            <h3>Que pouvez-vous faire sur YOON ?</h3>
            <ul>
              ${data.role === 'citizen' ?
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
    `;

    const text = `
Bienvenue sur YOON - Plateforme Juridique Sénégalaise, ${data.fullName}!

Nous sommes ravis de vous accueillir sur YOON, votre plateforme de référence pour tous vos besoins juridiques au Sénégal.

Vous êtes inscrit en tant que ${data.role === 'citizen' ? 'Citoyen' : data.role === 'expert' ? 'Expert Juridique' : 'Administrateur'}.

Pour finaliser votre inscription, veuillez confirmer votre adresse email en visitant : ${window.location.origin}/confirm-email

Que pouvez-vous faire sur YOON ?
${data.role === 'citizen' ?
  `- Accéder à une base de données complète des lois sénégalaises
- Consulter des experts juridiques qualifiés
- Générer des documents juridiques personnalisés
- Poser des questions à notre chatbot juridique` :
  `- Publier et gérer vos spécialités juridiques
- Recevoir des demandes de consultation
- Accéder aux outils professionnels
- Collaborer avec d'autres professionnels`
}

Si vous avez des questions, contactez-nous à support@yoon.sn

Cordialement,
L'équipe YOON

---
Cette adresse email est surveillée. Veuillez ne pas y répondre directement.
© 2024 YOON - Tous droits réservés
    `;

    return { subject, html, text };
  }
}