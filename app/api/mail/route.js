import Mailjet from "node-mailjet";

// Set up Mailjet with environment variables
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    const emailData = {
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL,
            Name: process.env.MAILJET_FROM_NAME,
          },
          To: [
            {
              Email: "soumya.parida3@gmail.com",
              Name: "InnoAI Admin",
            },
          ],
          Subject: `${name.toUpperCase()} sent you a message from Contact Form`,
          TextPart: `Email: ${email}\n\n${message}`,
          HTMLPart: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
        },
      ],
    };

    // Send the email using Mailjet's API
    const response = await mailjet.post("send", { version: "v3.1" }).request(emailData);

    if (response.response.status === 200) {
      return new Response(JSON.stringify({ message: "Your message was sent successfully." }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Failed to send message." }), { status: response.response.status });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: `Error sending email: ${error.message}` }), { status: 500 });
  }
}
