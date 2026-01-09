interface TicketInfo {
  id: string;
  ticketNumber: number;
  ticketUrl: string;
}

interface SendTicketEmailParams {
  to: string;
  customerName: string;
  eventTitle: string;
  ticketTypeName: string;
  tickets: TicketInfo[];
  totalAmount: number;
  reference: string;
}

export async function sendTicketConfirmationEmail({
  to,
  customerName,
  eventTitle,
  ticketTypeName,
  tickets,
  totalAmount,
  reference,
}: SendTicketEmailParams) {
  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
  
  if (!MAILERLITE_API_KEY) {
    throw new Error('MAILERLITE_API_KEY is not configured');
  }

  // Generate ticket links HTML
  const ticketLinksHtml = tickets
    .map(
      (ticket, index) => `
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">
            <strong>Ticket #${index + 1}</strong>
          </td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">
            <a href="${ticket.ticketUrl}" 
               style="color: #10b981; text-decoration: none; font-weight: 600;">
              View & Download →
            </a>
          </td>
        </tr>
      `
    )
    .join('');

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Tickets for ${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🎉 Payment Successful!</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                Your tickets are ready
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
                Thank you for your purchase! Your ${tickets.length > 1 ? 'tickets are' : 'ticket is'} confirmed for:
              </p>

              <!-- Event Details -->
              <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 30px 0;">
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">${eventTitle}</h2>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Ticket Type:</strong> ${ticketTypeName}<br>
                  <strong>Number of Tickets:</strong> ${tickets.length}<br>
                  <strong>Total Amount Paid:</strong> ₦${(totalAmount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}<br>
                  <strong>Reference:</strong> ${reference}
                </p>
              </div>

              <!-- Ticket Links -->
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Your Ticket${tickets.length > 1 ? 's' : ''}:</h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb; color: #374151;">Ticket</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb; color: #374151;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${ticketLinksHtml}
                </tbody>
              </table>

              <!-- Instructions -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 0 0 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📱 Important Instructions:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Click the links above to view and download your QR codes</li>
                  <li style="margin-bottom: 8px;">Save or print your QR codes before the event</li>
                  <li style="margin-bottom: 8px;">Present your QR code at the event entrance</li>
                  <li>Each ticket can only be used once</li>
                </ul>
              </div>

              <!-- Call to Action -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${tickets[0].ticketUrl}" 
                       style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View My Ticket${tickets.length > 1 ? 's' : ''}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
                <strong>See you at the event!</strong>
              </p>

              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                If you have any questions or concerns, feel free to reach out to us at 
                <a href="mailto:events@balanceunleashed.org" style="color: #10b981; text-decoration: none;">
                  events@balanceunleashed.org
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                Thank you for choosing Balance Unleashed
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const emailText = `
Dear ${customerName},

Thank you for your purchase! Your ${tickets.length > 1 ? 'tickets are' : 'ticket is'} confirmed for ${eventTitle}.

EVENT DETAILS:
- Event: ${eventTitle}
- Ticket Type: ${ticketTypeName}
- Number of Tickets: ${tickets.length}
- Total Amount Paid: ₦${(totalAmount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
- Reference: ${reference}

YOUR TICKETS:
${tickets.map((ticket, index) => `Ticket #${index + 1}: ${ticket.ticketUrl}`).join('\n')}

IMPORTANT INSTRUCTIONS:
- View and download your QR codes from the links above
- Save or print your QR codes before the event
- Present your QR code at the event entrance
- Each ticket can only be used once

See you at the event!

If you have any questions or concerns, feel free to reach out to us at events@balanceunleashed.org

---
Thank you for choosing Balance Unleashed
This is an automated confirmation email.
  `;

  try {
    const response = await fetch('https://connect.mailerlite.com/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        from: {
          email: 'ray@balanceunleashed.org',
          name: 'Balance Unleashed Events',
        },
        subject: `Your Ticket${tickets.length > 1 ? 's' : ''} for ${eventTitle} - Confirmation`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`MailerLite API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
