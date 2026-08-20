const sgMail = require("@sendgrid/mail");

const configureSendGrid = () => {
  const apiKey =
    process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    throw new Error(
      "SENDGRID_API_KEY is not configured."
    );
  }

  sgMail.setApiKey(apiKey);
};

const buildNewsletterHtml = ({
  title,
  summary,
  content,
}) => {
  const safeContent = String(content)
    .split("\n")
    .map(
      (paragraph) =>
        `<p style="line-height:1.7;color:#334155;">${paragraph}</p>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#f8fafc;">
      <div style="background:linear-gradient(135deg,#087aa5,#13a89e);padding:28px;border-radius:18px;color:white;">
        <h1 style="margin:0 0 10px;">${title}</h1>
        ${
          summary
            ? `<p style="margin:0;opacity:.92;">${summary}</p>`
            : ""
        }
      </div>

      <div style="background:white;margin-top:18px;padding:26px;border-radius:18px;">
        ${safeContent}

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:26px 0;" />

        <p style="font-size:12px;color:#64748b;">
          OralVista provides general educational information and does not replace professional dental diagnosis or treatment.
        </p>

        <p style="font-size:12px;color:#64748b;">
          You received this message because you subscribed to OralVista newsletters. You can unsubscribe from your patient account.
        </p>
      </div>
    </div>
  `;
};

const sendNewsletterBatch = async ({
  recipients,
  newsletter,
}) => {
  configureSendGrid();

  const fromEmail =
    process.env.SENDGRID_FROM_EMAIL;

  const fromName =
    process.env.SENDGRID_FROM_NAME ||
    "OralVista";

  if (!fromEmail) {
    throw new Error(
      "SENDGRID_FROM_EMAIL is not configured."
    );
  }

  const messages = recipients.map(
    (recipient) => ({
      to: recipient.email,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: newsletter.subject,
      text: `${newsletter.title}\n\n${newsletter.content}`,
      html: buildNewsletterHtml(
        newsletter
      ),
    })
  );

  const settled =
    await Promise.allSettled(
      messages.map((message) =>
        sgMail.send(message)
      )
    );

  const sentCount = settled.filter(
    (result) =>
      result.status === "fulfilled"
  ).length;

  const failedCount =
    settled.length - sentCount;

  return {
    sentCount,
    failedCount,
  };
};

module.exports = {
  sendNewsletterBatch,
};
