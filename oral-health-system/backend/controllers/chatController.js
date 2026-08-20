const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 10;

/*
 * Topics that the OralVista assistant may answer.
 */
const ORAL_HEALTH_TERMS = [
  "tooth",
  "teeth",
  "gum",
  "gums",
  "mouth",
  "oral",
  "dental",
  "dentist",
  "brushing",
  "brush",
  "floss",
  "flossing",
  "plaque",
  "calculus",
  "tartar",
  "caries",
  "cavity",
  "cavities",
  "gingivitis",
  "periodontitis",
  "ulcer",
  "sensitivity",
  "bleeding",
  "breath",
  "tongue",
  "swelling",
  "toothache",
  "pain",
  "wisdom tooth",
  "root canal",
  "filling",
  "crown",
  "dentures",
  "orthodontic",
  "braces",
  "betel",
  "smoking",
  "sugar",
  "toothpaste",
  "mouthwash",
];

/*
 * Emergency phrases requiring urgent professional help.
 */
const URGENT_TERMS = [
  "difficulty breathing",
  "cannot breathe",
  "trouble breathing",
  "difficulty swallowing",
  "cannot swallow",
  "uncontrolled bleeding",
  "heavy bleeding",
  "face swelling",
  "facial swelling",
  "swollen face",
  "jaw swelling",
  "high fever",
  "knocked out tooth",
  "tooth knocked out",
  "serious injury",
  "severe trauma",
];

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const isOralHealthQuestion = (message) => {
  const normalizedMessage =
    normalizeText(message);

  return ORAL_HEALTH_TERMS.some((term) =>
    normalizedMessage.includes(term)
  );
};

const containsUrgentSymptoms = (
  message
) => {
  const normalizedMessage =
    normalizeText(message);

  return URGENT_TERMS.some((term) =>
    normalizedMessage.includes(term)
  );
};

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item) =>
        item &&
        ["user", "assistant"].includes(
          item.role
        ) &&
        typeof item.content === "string"
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: item.content
        .trim()
        .slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content);
};

const buildConversationText = ({
  message,
  history,
  patientName,
}) => {
  const conversation = history
    .map((item) => {
      const speaker =
        item.role === "assistant"
          ? "Assistant"
          : "Patient";

      return `${speaker}: ${item.content}`;
    })
    .join("\n");

  return `
Patient name: ${patientName || "Patient"}

Previous conversation:
${
  conversation ||
  "No previous conversation."
}

Current patient question:
${message}
  `.trim();
};

const SYSTEM_INSTRUCTION = `
You are OralVista Dental Assistant, an educational oral-health assistant for patients in Sri Lanka.

Your allowed scope:
- Everyday oral hygiene
- Tooth brushing and flossing
- Dental caries and cavities
- Gingivitis and gum health
- Periodontitis education
- Calculus and plaque
- Oral ulcers
- Tooth sensitivity
- Bad breath
- Diet and oral health
- Smoking and betel-chewing oral-health risks
- When to visit a dentist
- General preventive dental education

Required behaviour:
1. Answer only questions related to oral or dental health.
2. Do not diagnose a disease or claim certainty.
3. Do not prescribe prescription medication.
4. Do not give medication dosages.
5. Do not replace a dentist or medical professional.
6. Explain possible general causes using cautious wording such as "may", "could" and "can sometimes".
7. Recommend professional dental assessment when symptoms are persistent, severe, worsening or unclear.
8. For urgent symptoms such as facial swelling, difficulty breathing, difficulty swallowing, uncontrolled bleeding, severe trauma or a knocked-out tooth, advise urgent professional or emergency care.
9. Never ask for passwords, identification numbers, financial information or unnecessary personal medical data.
10. Reply in the same language used by the patient when reasonably possible. Support English, Sinhala and Tamil.
11. Keep answers clear, supportive and normally under 180 words.
12. End health guidance with a brief reminder that the response is educational and not a diagnosis.
13. When the question is outside oral health, politely explain that you can only help with oral-health education.
`.trim();

/*
 * POST /api/chat/message
 *
 * This endpoint does not save chat history in MongoDB.
 * The frontend sends only the recent conversation
 * needed for the current answer.
 */
exports.sendChatMessage = async (
  req,
  res
) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message:
          "The AI assistant has not been configured. Add GEMINI_API_KEY to the backend environment.",
      });
    }

    const message = String(
      req.body?.message || ""
    ).trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter an oral-health question.",
      });
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your message is too long. Please keep it below 1,000 characters.",
      });
    }

    /*
     * Local emergency check before contacting Gemini.
     */
    if (containsUrgentSymptoms(message)) {
      return res.status(200).json({
        success: true,
        urgent: true,
        reply:
          "Your message may describe an urgent dental or medical situation. Please seek immediate professional care, especially if you have facial swelling, difficulty breathing or swallowing, uncontrolled bleeding, severe trauma, or a knocked-out tooth. Contact a nearby emergency service, hospital, or dentist now. This message is general safety guidance and not a diagnosis.",
      });
    }

    /*
     * Restrict clearly unrelated questions locally.
     * A short greeting is still allowed.
     */
    const normalizedMessage =
      normalizeText(message);

    const isGreeting = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ].some((greeting) =>
      normalizedMessage.startsWith(
        greeting
      )
    );

    if (
      !isGreeting &&
      !isOralHealthQuestion(message)
    ) {
      return res.status(200).json({
        success: true,
        outOfScope: true,
        reply:
          "I am the OralVista Dental Assistant, so I can only help with oral-health education, dental symptoms, hygiene, prevention and guidance about when to visit a dentist. Please ask me an oral-health question.",
      });
    }

    const history = sanitizeHistory(
      req.body?.history
    );

    const patientName =
      req.user?.fullName || "Patient";

    const model =
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash";

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

    const geminiResponse = await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "x-goog-api-key":
            process.env.GEMINI_API_KEY,
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: SYSTEM_INSTRUCTION,
              },
            ],
          },

          contents: [
            {
              role: "user",

              parts: [
                {
                  text:
                    buildConversationText({
                      message,
                      history,
                      patientName,
                    }),
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            maxOutputTokens: 450,
          },

          safetySettings: [
            {
              category:
                "HARM_CATEGORY_HARASSMENT",
              threshold:
                "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category:
                "HARM_CATEGORY_HATE_SPEECH",
              threshold:
                "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category:
                "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold:
                "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category:
                "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold:
                "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    const responseData =
      await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error(
        "Gemini API error:",
        responseData
      );

      if (
        geminiResponse.status === 429
      ) {
        return res.status(429).json({
          success: false,
          message:
            "The AI assistant is temporarily busy. Please wait and try again.",
        });
      }

      if (
        geminiResponse.status === 401 ||
        geminiResponse.status === 403
      ) {
        return res.status(503).json({
          success: false,
          message:
            "The Gemini API key is invalid or does not have permission.",
        });
      }

      return res.status(502).json({
        success: false,
        message:
          "The AI service could not generate a response. Please try again.",
      });
    }

    const blockReason =
      responseData?.promptFeedback
        ?.blockReason;

    if (blockReason) {
      return res.status(400).json({
        success: false,
        message:
          "The AI service could not process that message safely. Please rephrase your oral-health question.",
      });
    }

    const reply =
      responseData?.candidates?.[0]
        ?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message:
          "The AI assistant returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      urgent: false,
      outOfScope: false,
      reply,
      disclaimer:
        "OralVista provides educational guidance only and does not replace diagnosis or treatment by a qualified dentist.",
    });
  } catch (error) {
    console.error(
      "Chat assistant error:",
      error
    );

    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        message:
          "The AI assistant took too long to respond.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to contact the AI assistant.",
    });
  }
};