const tutorLessons = [
  {
    id: "oral-hygiene-basics",
    number: 1,
    title: "Oral Hygiene Basics",
    category: "Prevention",
    duration: "8 minutes",
    description:
      "Learn the correct daily routine for keeping teeth and gums clean.",
    lessonContent: [
      "Brush your teeth twice each day using fluoride toothpaste.",
      "Brush gently for approximately two minutes.",
      "Clean between the teeth daily using floss or another interdental cleaner.",
      "Replace your toothbrush every three to four months or when the bristles become worn.",
      "Visit a dentist for regular oral-health examinations.",
    ],
    questions: [
      {
        id: "ohb-q1",
        question:
          "How many times should most people brush their teeth each day?",
        options: [
          "Once",
          "Twice",
          "Three times",
          "Only when the teeth feel dirty",
        ],
        correctAnswer: 1,
        explanation:
          "Brushing twice daily helps remove plaque and supports tooth and gum health.",
      },
      {
        id: "ohb-q2",
        question:
          "Approximately how long should one brushing session last?",
        options: [
          "Thirty seconds",
          "One minute",
          "Two minutes",
          "Ten minutes",
        ],
        correctAnswer: 2,
        explanation:
          "A brushing time of around two minutes helps clean all tooth surfaces properly.",
      },
      {
        id: "ohb-q3",
        question:
          "When should a toothbrush normally be replaced?",
        options: [
          "Every week",
          "Every three to four months",
          "Every two years",
          "Only when it breaks",
        ],
        correctAnswer: 1,
        explanation:
          "A toothbrush should generally be replaced every three to four months or earlier when the bristles are worn.",
      },
    ],
  },

  {
    id: "teeth-anatomy",
    number: 2,
    title: "Teeth Anatomy",
    category: "Education",
    duration: "7 minutes",
    description:
      "Understand the main parts of a tooth and their functions.",
    lessonContent: [
      "Enamel is the hard outer covering of the tooth.",
      "Dentine is located beneath the enamel.",
      "The pulp contains nerves and blood vessels.",
      "The root anchors the tooth inside the jawbone.",
      "Healthy gums help protect and support the teeth.",
    ],
    questions: [
      {
        id: "ta-q1",
        question:
          "What is the hard outer covering of a tooth called?",
        options: [
          "Pulp",
          "Enamel",
          "Root",
          "Gum",
        ],
        correctAnswer: 1,
        explanation:
          "Enamel is the hard protective outer layer of the tooth.",
      },
      {
        id: "ta-q2",
        question:
          "Which part of a tooth contains nerves and blood vessels?",
        options: [
          "Enamel",
          "Dentine only",
          "Pulp",
          "Crown surface",
        ],
        correctAnswer: 2,
        explanation:
          "The dental pulp contains nerves, blood vessels and connective tissue.",
      },
      {
        id: "ta-q3",
        question:
          "What is the main function of the tooth root?",
        options: [
          "To whiten the tooth",
          "To anchor the tooth in the jaw",
          "To create saliva",
          "To clean the enamel",
        ],
        correctAnswer: 1,
        explanation:
          "The root helps hold the tooth securely within the jawbone.",
      },
    ],
  },

  {
    id: "common-dental-diseases",
    number: 3,
    title: "Common Dental Diseases",
    category: "Diseases",
    duration: "10 minutes",
    description:
      "Learn about dental caries, gingivitis and periodontitis.",
    lessonContent: [
      "Dental caries develops when acids produced by bacteria damage tooth structure.",
      "Gingivitis is inflammation of the gums and may cause redness or bleeding.",
      "Untreated gingivitis can sometimes progress to periodontitis.",
      "Periodontitis can damage the tissues and bone supporting the teeth.",
      "Early dental assessment can prevent oral-health conditions from becoming more serious.",
    ],
    questions: [
      {
        id: "cdd-q1",
        question:
          "Dental caries is more commonly known as:",
        options: [
          "A mouth ulcer",
          "Tooth decay",
          "A broken jaw",
          "Dry mouth",
        ],
        correctAnswer: 1,
        explanation:
          "Dental caries is the clinical term commonly used for tooth decay.",
      },
      {
        id: "cdd-q2",
        question:
          "Which condition mainly describes inflammation of the gums?",
        options: [
          "Gingivitis",
          "Dental fluorosis",
          "Tooth fracture",
          "Oral thrush",
        ],
        correctAnswer: 0,
        explanation:
          "Gingivitis is an early form of gum disease involving gum inflammation.",
      },
      {
        id: "cdd-q3",
        question:
          "What may happen when serious gum disease is left untreated?",
        options: [
          "The teeth automatically become stronger",
          "Supporting bone and tissues may be damaged",
          "The enamel becomes thicker",
          "The gums become permanently immune to plaque",
        ],
        correctAnswer: 1,
        explanation:
          "Periodontitis can damage the supporting tissues and bone around teeth.",
      },
    ],
  },

  {
    id: "diet-and-nutrition",
    number: 4,
    title: "Diet and Nutrition",
    category: "Nutrition",
    duration: "8 minutes",
    description:
      "Understand how sugar, water and nutrition affect oral health.",
    lessonContent: [
      "Frequent sugary foods and drinks increase the risk of dental caries.",
      "Bacteria in dental plaque use sugar and produce acids.",
      "Water supports hydration and helps wash away food particles.",
      "Balanced meals support both general health and oral health.",
      "Limiting how frequently sugar is consumed is important.",
    ],
    questions: [
      {
        id: "dn-q1",
        question:
          "Why can frequent sugar consumption increase tooth-decay risk?",
        options: [
          "Sugar makes teeth grow too quickly",
          "Plaque bacteria use sugar and produce acids",
          "Sugar removes enamel stains",
          "Sugar directly strengthens the gums",
        ],
        correctAnswer: 1,
        explanation:
          "Plaque bacteria metabolise sugar and produce acids that may damage tooth enamel.",
      },
      {
        id: "dn-q2",
        question:
          "Which drink is generally the best everyday choice for hydration?",
        options: [
          "Water",
          "Sugary soft drink",
          "Energy drink",
          "Sweetened tea",
        ],
        correctAnswer: 0,
        explanation:
          "Water supports hydration without exposing the teeth to added sugar.",
      },
      {
        id: "dn-q3",
        question:
          "Which behaviour can help reduce dental-caries risk?",
        options: [
          "Frequently snacking on sweets",
          "Limiting the frequency of sugary foods and drinks",
          "Drinking soft drinks before sleep",
          "Keeping sugary food in the mouth for longer",
        ],
        correctAnswer: 1,
        explanation:
          "Reducing how often the teeth are exposed to sugar can reduce repeated acid attacks.",
      },
    ],
  },

  {
    id: "preventive-dental-care",
    number: 5,
    title: "Preventive Dental Care",
    category: "Prevention",
    duration: "9 minutes",
    description:
      "Learn how check-ups, fluoride and early detection protect oral health.",
    lessonContent: [
      "Routine dental examinations help identify problems early.",
      "Fluoride helps protect tooth enamel against acid damage.",
      "Professional cleaning can remove calculus that brushing cannot remove.",
      "Dental sealants may protect vulnerable chewing surfaces.",
      "Prevention is usually easier than treating advanced dental disease.",
    ],
    questions: [
      {
        id: "pdc-q1",
        question:
          "Why are routine dental examinations important?",
        options: [
          "They guarantee that dental disease never occurs",
          "They can help identify problems early",
          "They replace daily brushing",
          "They make flossing unnecessary",
        ],
        correctAnswer: 1,
        explanation:
          "Regular dental examinations support early identification and management of oral-health problems.",
      },
      {
        id: "pdc-q2",
        question:
          "What is one important benefit of fluoride?",
        options: [
          "It helps strengthen and protect enamel",
          "It replaces saliva",
          "It permanently removes every type of stain",
          "It causes plaque to grow faster",
        ],
        correctAnswer: 0,
        explanation:
          "Fluoride can strengthen enamel and make it more resistant to acid damage.",
      },
      {
        id: "pdc-q3",
        question:
          "What can professional cleaning remove that normal brushing may not?",
        options: [
          "All tooth roots",
          "Calculus",
          "Healthy enamel",
          "Dental fillings",
        ],
        correctAnswer: 1,
        explanation:
          "Hardened calculus normally requires professional dental cleaning.",
      },
    ],
  },

  {
    id: "gum-health",
    number: 6,
    title: "Gum Health",
    category: "Gums",
    duration: "9 minutes",
    description:
      "Recognise signs of gum problems and understand how to protect the gums.",
    lessonContent: [
      "Healthy gums are generally firm and do not bleed regularly.",
      "Bleeding during brushing may be associated with gum inflammation.",
      "Plaque removal is essential for reducing gingivitis risk.",
      "Smoking can increase the risk and severity of gum disease.",
      "Persistent gum symptoms should be assessed by a dental professional.",
    ],
    questions: [
      {
        id: "gh-q1",
        question:
          "Which may be an early sign of gum inflammation?",
        options: [
          "Regular gum bleeding during brushing",
          "Teeth becoming naturally longer overnight",
          "A toothbrush changing colour",
          "The tongue becoming permanently smooth",
        ],
        correctAnswer: 0,
        explanation:
          "Bleeding during brushing can be an early sign of inflamed gums.",
      },
      {
        id: "gh-q2",
        question:
          "What is an important method of preventing gingivitis?",
        options: [
          "Allowing plaque to remain on the teeth",
          "Effective daily plaque removal",
          "Avoiding all water",
          "Brushing only once each month",
        ],
        correctAnswer: 1,
        explanation:
          "Regular brushing and interdental cleaning help remove plaque that contributes to gingivitis.",
      },
      {
        id: "gh-q3",
        question:
          "Which habit can increase gum-disease risk?",
        options: [
          "Drinking water",
          "Smoking",
          "Using a soft toothbrush correctly",
          "Attending dental check-ups",
        ],
        correctAnswer: 1,
        explanation:
          "Smoking is an important risk factor for gum disease.",
      },
    ],
  },

  {
    id: "oral-cancer-awareness",
    number: 7,
    title: "Oral Cancer Awareness",
    category: "Awareness",
    duration: "10 minutes",
    description:
      "Learn about warning signs and important Sri Lankan oral-cancer risk factors.",
    lessonContent: [
      "Tobacco, smoking and betel chewing are important oral-cancer risk factors.",
      "A mouth ulcer that does not heal should be examined.",
      "Unexplained red or white patches require professional assessment.",
      "Difficulty swallowing or a persistent mouth lump should not be ignored.",
      "Early professional examination improves the chance of early detection.",
    ],
    questions: [
      {
        id: "oca-q1",
        question:
          "Which habit is an important oral-cancer risk factor?",
        options: [
          "Drinking plain water",
          "Betel chewing with tobacco",
          "Using fluoride toothpaste",
          "Eating balanced meals",
        ],
        correctAnswer: 1,
        explanation:
          "Betel chewing, particularly with tobacco, is associated with increased oral-cancer risk.",
      },
      {
        id: "oca-q2",
        question:
          "Which symptom should receive professional assessment?",
        options: [
          "A mouth ulcer that does not heal",
          "Temporary thirst after exercise",
          "A toothbrush becoming wet",
          "Normal saliva production",
        ],
        correctAnswer: 0,
        explanation:
          "A persistent non-healing ulcer should be checked by a qualified dental or medical professional.",
      },
      {
        id: "oca-q3",
        question:
          "Why is early oral-cancer assessment important?",
        options: [
          "It can support earlier detection and treatment",
          "It guarantees that no examination is required",
          "It makes every tooth grow again",
          "It removes the need to stop tobacco use",
        ],
        correctAnswer: 0,
        explanation:
          "Early assessment can support earlier diagnosis and management.",
      },
    ],
  },

  {
    id: "dental-emergencies",
    number: 8,
    title: "Dental Emergencies",
    category: "Emergency",
    duration: "8 minutes",
    description:
      "Learn how to respond safely to urgent dental situations.",
    lessonContent: [
      "Facial swelling with difficulty breathing or swallowing requires urgent care.",
      "A knocked-out permanent tooth requires immediate professional attention.",
      "Severe uncontrolled bleeding requires emergency assessment.",
      "Dental trauma should be assessed even when pain appears mild.",
      "OralVista provides education and does not replace emergency services.",
    ],
    questions: [
      {
        id: "de-q1",
        question:
          "Which combination requires urgent professional care?",
        options: [
          "Facial swelling and difficulty breathing",
          "Mild thirst after walking",
          "A clean toothbrush",
          "Normal chewing without pain",
        ],
        correctAnswer: 0,
        explanation:
          "Facial swelling with breathing difficulty can indicate a serious emergency.",
      },
      {
        id: "de-q2",
        question:
          "What should you do after a permanent tooth is knocked out?",
        options: [
          "Wait several weeks",
          "Seek urgent professional dental care",
          "Throw away the tooth immediately",
          "Ignore the injury when bleeding stops",
        ],
        correctAnswer: 1,
        explanation:
          "A knocked-out permanent tooth requires immediate professional dental care.",
      },
      {
        id: "de-q3",
        question:
          "Can OralVista replace emergency medical or dental services?",
        options: [
          "Yes, in every situation",
          "Only during weekends",
          "No",
          "Only for children",
        ],
        correctAnswer: 2,
        explanation:
          "OralVista provides educational guidance and cannot replace emergency care.",
      },
    ],
  },
];

/* =========================================================
   MULTILINGUAL LESSON CONTENT
   - English remains the original source above.
   - Sinhala (si) and Tamil (ta) are display translations.
   - Question IDs and option order are preserved so quiz
     scoring continues to use the same correctAnswer indexes.
========================================================= */

const tutorLessonTranslations = {
  "oral-hygiene-basics": {
    si: {
      title: "මුඛ සෞඛ්‍ය මූලික කරුණු",
      category: "වැළැක්වීම",
      duration: "මිනිත්තු 8",
      description:
        "දත් සහ දත් මස් පිරිසිදුව තබා ගැනීමට නිවැරදි දෛනික පුරුදු ඉගෙන ගන්න.",
      lessonContent: [
        "ෆ්ලෝරයිඩ් දන්තාලේපයක් භාවිතා කර දිනකට දෙවරක් දත් මදින්න.",
        "මිනිත්තු දෙකක් පමණ මෘදු ලෙස දත් මදින්න.",
        "දිනපතා ෆ්ලොස් හෝ වෙනත් අන්තර්දන්ත පිරිසිදුකාරකයක් භාවිතා කර දත් අතර පිරිසිදු කරන්න.",
        "දත් බුරුසුව මාස තුනෙන් හතරකට වරක් හෝ කෙඳි ගෙවී ගිය විට මාරු කරන්න.",
        "නියමිත මුඛ සෞඛ්‍ය පරීක්ෂණ සඳහා දන්ත වෛද්‍යවරයෙකු හමුවන්න.",
      ],
      questions: [
        {
          id: "ohb-q1",
          question:
            "බොහෝ දෙනා දිනකට කී වතාවක් දත් මැදිය යුතුද?",
          options: [
            "එක් වරක්",
            "දෙවරක්",
            "තුන් වරක්",
            "දත් අපිරිසිදු බව දැනෙන විට පමණක්",
          ],
          explanation:
            "දිනකට දෙවරක් දත් මැදීමෙන් දන්ත පටලය ඉවත් කිරීමට සහ දත් හා දත් මස් සෞඛ්‍යය රැක ගැනීමට උපකාරී වේ.",
        },
        {
          id: "ohb-q2",
          question:
            "එක් දත් මැදීමේ වාරයක් සාමාන්‍යයෙන් කොපමණ කාලයක් පැවතිය යුතුද?",
          options: [
            "තත්පර තිහක්",
            "මිනිත්තුවක්",
            "මිනිත්තු දෙකක්",
            "මිනිත්තු දහයක්",
          ],
          explanation:
            "මිනිත්තු දෙකක් පමණ දත් මැදීමෙන් දත් මතුපිට සියල්ල හොඳින් පිරිසිදු කිරීමට උපකාරී වේ.",
        },
        {
          id: "ohb-q3",
          question:
            "දත් බුරුසුව සාමාන්‍යයෙන් කවදා මාරු කළ යුතුද?",
          options: [
            "සෑම සතියකම",
            "මාස තුනෙන් හතරකට වරක්",
            "වසර දෙකකට වරක්",
            "කැඩුණු විට පමණක්",
          ],
          explanation:
            "දත් බුරුසුව සාමාන්‍යයෙන් මාස තුනෙන් හතරකට වරක් හෝ කෙඳි ගෙවී ගිය විට ඊට පෙර මාරු කළ යුතුය.",
        },
      ],
    },

    ta: {
      title: "வாய்ச் சுகாதார அடிப்படைகள்",
      category: "தடுப்பு",
      duration: "8 நிமிடங்கள்",
      description:
        "பற்களையும் ஈறுகளையும் சுத்தமாக வைத்திருக்க சரியான தினசரி பழக்கத்தை கற்றுக்கொள்ளுங்கள்.",
      lessonContent: [
        "ஃப்ளூரைடு பற்பசையை பயன்படுத்தி தினமும் இருமுறை பல் துலக்குங்கள்.",
        "சுமார் இரண்டு நிமிடங்கள் மெதுவாக பல் துலக்குங்கள்.",
        "பல் நூல் அல்லது மற்றொரு பற்களுக்கிடை சுத்திகரிப்பு கருவியைப் பயன்படுத்தி தினமும் பற்களுக்கிடையில் சுத்தம் செய்யுங்கள்.",
        "மூன்று முதல் நான்கு மாதங்களுக்கு ஒருமுறை அல்லது முட்கள் சேதமடைந்தால் பல் துலக்கியை மாற்றுங்கள்.",
        "வழக்கமான வாய்ச் சுகாதார பரிசோதனைகளுக்கு பல் மருத்துவரை அணுகுங்கள்.",
      ],
      questions: [
        {
          id: "ohb-q1",
          question:
            "பெரும்பாலானவர்கள் ஒரு நாளில் எத்தனை முறை பல் துலக்க வேண்டும்?",
          options: [
            "ஒருமுறை",
            "இருமுறை",
            "மூன்று முறை",
            "பற்கள் அழுக்காக உணரும்போது மட்டும்",
          ],
          explanation:
            "தினமும் இருமுறை பல் துலக்குவது பல் தகட்டை அகற்றவும் பற்கள் மற்றும் ஈறுகளின் ஆரோக்கியத்தை பாதுகாக்கவும் உதவுகிறது.",
        },
        {
          id: "ohb-q2",
          question:
            "ஒரு முறை பல் துலக்கும் நேரம் சுமார் எவ்வளவு இருக்க வேண்டும்?",
          options: [
            "முப்பது விநாடிகள்",
            "ஒரு நிமிடம்",
            "இரண்டு நிமிடங்கள்",
            "பத்து நிமிடங்கள்",
          ],
          explanation:
            "சுமார் இரண்டு நிமிடங்கள் பல் துலக்குவது அனைத்து பல் மேற்பரப்புகளையும் நன்றாக சுத்தம் செய்ய உதவுகிறது.",
        },
        {
          id: "ohb-q3",
          question:
            "பல் துலக்கியை பொதுவாக எப்போது மாற்ற வேண்டும்?",
          options: [
            "ஒவ்வொரு வாரமும்",
            "மூன்று முதல் நான்கு மாதங்களுக்கு ஒருமுறை",
            "இரண்டு ஆண்டுகளுக்கு ஒருமுறை",
            "அது உடைந்தால் மட்டும்",
          ],
          explanation:
            "பல் துலக்கியை பொதுவாக மூன்று முதல் நான்கு மாதங்களுக்கு ஒருமுறை அல்லது முட்கள் சேதமடைந்தால் அதற்கு முன்பே மாற்ற வேண்டும்.",
        },
      ],
    },
  },

  "teeth-anatomy": {
    si: {
      title: "දත් ව්‍යුහ විද්‍යාව",
      category: "අධ්‍යාපනය",
      duration: "මිනිත්තු 7",
      description:
        "දතක ප්‍රධාන කොටස් සහ ඒවායේ කාර්යයන් තේරුම් ගන්න.",
      lessonContent: [
        "එනැමල් යනු දතේ දෘඩ පිටත ආවරණයයි.",
        "ඩෙන්ටින් එනැමල් යටින් පිහිටා ඇත.",
        "පල්ප් තුළ ස්නායු සහ රුධිර නාල අඩංගු වේ.",
        "මුල දත හකු අස්ථිය තුළ ස්ථිර කරයි.",
        "සෞඛ්‍ය සම්පන්න දත් මස් දත් ආරක්ෂා කිරීමට සහ සහාය දීමට උපකාරී වේ.",
      ],
      questions: [
        {
          id: "ta-q1",
          question:
            "දතක දෘඩ පිටත ආවරණය කුමක් ලෙස හඳුන්වයිද?",
          options: [
            "පල්ප්",
            "එනැමල්",
            "මුල",
            "දත් මස්",
          ],
          explanation:
            "එනැමල් යනු දතේ දෘඩ ආරක්ෂිත පිටත ස්ථරයයි.",
        },
        {
          id: "ta-q2",
          question:
            "දතක ස්නායු සහ රුධිර නාල අඩංගු කොටස කුමක්ද?",
          options: [
            "එනැමල්",
            "ඩෙන්ටින් පමණක්",
            "පල්ප්",
            "කිරුළ මතුපිට",
          ],
          explanation:
            "දන්ත පල්ප් තුළ ස්නායු, රුධිර නාල සහ සම්බන්ධක පටක අඩංගු වේ.",
        },
        {
          id: "ta-q3",
          question:
            "දත් මුලේ ප්‍රධාන කාර්යය කුමක්ද?",
          options: [
            "දත සුදු කිරීම",
            "දත හකු තුළ ස්ථිර කිරීම",
            "ලාලා නිපදවීම",
            "එනැමල් පිරිසිදු කිරීම",
          ],
          explanation:
            "මුල දත හකු අස්ථිය තුළ ස්ථිරව තබා ගැනීමට උපකාරී වේ.",
        },
      ],
    },

    ta: {
      title: "பல் உடற்கூறியல்",
      category: "கல்வி",
      duration: "7 நிமிடங்கள்",
      description:
        "ஒரு பல்லின் முக்கிய பகுதிகளையும் அவற்றின் செயல்பாடுகளையும் புரிந்துகொள்ளுங்கள்.",
      lessonContent: [
        "எனாமல் என்பது பல்லின் கடினமான வெளிப்புற உறையாகும்.",
        "டென்டின் எனாமலின் கீழே அமைந்துள்ளது.",
        "பல்ப் பகுதியில் நரம்புகளும் இரத்த நாளங்களும் உள்ளன.",
        "வேர் பல்லை தாடை எலும்பிற்குள் நிலைநிறுத்துகிறது.",
        "ஆரோக்கியமான ஈறுகள் பற்களை பாதுகாக்கவும் ஆதரிக்கவும் உதவுகின்றன.",
      ],
      questions: [
        {
          id: "ta-q1",
          question:
            "ஒரு பல்லின் கடினமான வெளிப்புற உறை என்ன என்று அழைக்கப்படுகிறது?",
          options: [
            "பல்ப்",
            "எனாமல்",
            "வேர்",
            "ஈறு",
          ],
          explanation:
            "எனாமல் என்பது பல்லின் கடினமான பாதுகாப்பு வெளிப்புற அடுக்காகும்.",
        },
        {
          id: "ta-q2",
          question:
            "பல்லின் எந்த பகுதியில் நரம்புகளும் இரத்த நாளங்களும் உள்ளன?",
          options: [
            "எனாமல்",
            "டென்டின் மட்டும்",
            "பல்ப்",
            "கிரீடத்தின் மேற்பரப்பு",
          ],
          explanation:
            "பல் பல்ப் பகுதியில் நரம்புகள், இரத்த நாளங்கள் மற்றும் இணைப்பு திசுக்கள் உள்ளன.",
        },
        {
          id: "ta-q3",
          question:
            "பல் வேரின் முக்கிய செயல்பாடு என்ன?",
          options: [
            "பல்லை வெண்மையாக்குவது",
            "பல்லை தாடையில் நிலைநிறுத்துவது",
            "உமிழ்நீரை உருவாக்குவது",
            "எனாமலை சுத்தம் செய்வது",
          ],
          explanation:
            "வேர் பல்லை தாடை எலும்பிற்குள் உறுதியாக வைத்திருக்க உதவுகிறது.",
        },
      ],
    },
  },

  "common-dental-diseases": {
    si: {
      title: "සාමාන්‍ය දන්ත රෝග",
      category: "රෝග",
      duration: "මිනිත්තු 10",
      description:
        "දත් කුහර, ජින්ජිවයිටිස් සහ පෙරියොඩොන්ටයිටිස් ගැන ඉගෙන ගන්න.",
      lessonContent: [
        "බැක්ටීරියා නිපදවන අම්ල දත් ව්‍යුහයට හානි කරන විට දත් කුහර ඇතිවේ.",
        "ජින්ජිවයිටිස් යනු දත් මස් දැවිල්ලක් වන අතර රතු වීම හෝ ලේ ගැලීම ඇති කළ හැක.",
        "ප්‍රතිකාර නොකළ ජින්ජිවයිටිස් සමහර විට පෙරියොඩොන්ටයිටිස් දක්වා වර්ධනය විය හැක.",
        "පෙරියොඩොන්ටයිටිස් දත් අල්ලාගෙන සිටින පටක සහ අස්ථියට හානි කළ හැක.",
        "ඉක්මන් දන්ත ඇගයීමෙන් මුඛ සෞඛ්‍ය තත්ත්වයන් වඩාත් බරපතල වීම වැළැක්විය හැක.",
      ],
      questions: [
        {
          id: "cdd-q1",
          question:
            "Dental caries සාමාන්‍යයෙන් කුමක් ලෙස හඳුන්වයිද?",
          options: [
            "මුඛ තුවාලයක්",
            "දත් කුහර වීම",
            "හකු කැඩීම",
            "වියළි මුඛය",
          ],
          explanation:
            "Dental caries යනු දත් කුහර වීම සඳහා භාවිතා කරන වෛද්‍ය නාමයයි.",
        },
        {
          id: "cdd-q2",
          question:
            "දත් මස් දැවිල්ල ප්‍රධාන වශයෙන් විස්තර කරන තත්ත්වය කුමක්ද?",
          options: [
            "ජින්ජිවයිටිස්",
            "දන්ත ෆ්ලෝරෝසිස්",
            "දත් කැඩීම",
            "මුඛ කැන්ඩිඩා ආසාදනය",
          ],
          explanation:
            "ජින්ජිවයිටිස් යනු දත් මස් දැවිල්ල ඇතුළත් මුල් අවධියේ දත් මස් රෝගයකි.",
        },
        {
          id: "cdd-q3",
          question:
            "බරපතල දත් මස් රෝගයට ප්‍රතිකාර නොකළහොත් කුමක් සිදුවිය හැකිද?",
          options: [
            "දත් ස්වයංක්‍රීයව ශක්තිමත් වේ",
            "දත් සඳහා සහාය දෙන අස්ථි සහ පටක හානි විය හැක",
            "එනැමල් තද වේ",
            "දත් මස් දන්ත පටලයට සදාකාලික ප්‍රතිරෝධයක් ලබා ගනී",
          ],
          explanation:
            "පෙරියොඩොන්ටයිටිස් දත් වටා ඇති සහායක පටක සහ අස්ථියට හානි කළ හැක.",
        },
      ],
    },

    ta: {
      title: "பொதுவான பல் நோய்கள்",
      category: "நோய்கள்",
      duration: "10 நிமிடங்கள்",
      description:
        "பல் சொத்தை, ஈறு அழற்சி மற்றும் பல் சுற்றுத் திசு அழற்சி பற்றி கற்றுக்கொள்ளுங்கள்.",
      lessonContent: [
        "பாக்டீரியா உருவாக்கும் அமிலங்கள் பல் அமைப்பை சேதப்படுத்தும்போது பல் சொத்தை உருவாகிறது.",
        "ஈறு அழற்சி என்பது ஈறுகளில் ஏற்படும் அழற்சி; இது சிவப்பு அல்லது இரத்தப்போக்கை ஏற்படுத்தலாம்.",
        "சிகிச்சையளிக்கப்படாத ஈறு அழற்சி சில நேரங்களில் பல் சுற்றுத் திசு அழற்சியாக முன்னேறலாம்.",
        "பல் சுற்றுத் திசு அழற்சி பற்களை ஆதரிக்கும் திசுக்களையும் எலும்பையும் சேதப்படுத்தலாம்.",
        "ஆரம்ப பல் பரிசோதனை வாய்ச் சுகாதார பிரச்சினைகள் தீவிரமடைவதைத் தடுக்க உதவும்.",
      ],
      questions: [
        {
          id: "cdd-q1",
          question:
            "Dental caries பொதுவாக எவ்வாறு அழைக்கப்படுகிறது?",
          options: [
            "வாய் புண்",
            "பல் சொத்தை",
            "தாடை முறிவு",
            "வாய் உலர்வு",
          ],
          explanation:
            "Dental caries என்பது பல் சொத்தைக்கு பொதுவாக பயன்படுத்தப்படும் மருத்துவச் சொல்லாகும்.",
        },
        {
          id: "cdd-q2",
          question:
            "ஈறுகளில் அழற்சியை முக்கியமாக குறிக்கும் நிலை எது?",
          options: [
            "ஈறு அழற்சி",
            "பல் ஃப்ளூரோசிஸ்",
            "பல் முறிவு",
            "வாய் பூஞ்சை தொற்று",
          ],
          explanation:
            "ஈறு அழற்சி என்பது ஈறுகளில் அழற்சி ஏற்படும் ஆரம்பநிலை ஈறு நோயாகும்.",
        },
        {
          id: "cdd-q3",
          question:
            "கடுமையான ஈறு நோயை சிகிச்சையின்றி விட்டால் என்ன நடக்கலாம்?",
          options: [
            "பற்கள் தானாகவே வலுப்படும்",
            "ஆதரிக்கும் எலும்பும் திசுக்களும் சேதமடையலாம்",
            "எனாமல் தடிமனாகும்",
            "ஈறுகள் பல் தகட்டுக்கு நிரந்தர எதிர்ப்பு பெறும்",
          ],
          explanation:
            "பல் சுற்றுத் திசு அழற்சி பற்களைச் சுற்றியுள்ள ஆதரவு திசுக்களையும் எலும்பையும் சேதப்படுத்தலாம்.",
        },
      ],
    },
  },

  "diet-and-nutrition": {
    si: {
      title: "ආහාර සහ පෝෂණය",
      category: "පෝෂණය",
      duration: "මිනිත්තු 8",
      description:
        "සීනි, ජලය සහ පෝෂණය මුඛ සෞඛ්‍යයට බලපාන ආකාරය තේරුම් ගන්න.",
      lessonContent: [
        "නිතර සීනි සහිත ආහාර සහ බීම ගැනීම දත් කුහර අවදානම වැඩි කරයි.",
        "දන්ත පටලයේ බැක්ටීරියා සීනි භාවිතා කර අම්ල නිපදවයි.",
        "ජලය ශරීරයේ ජල සමතුලිතතාවයට සහ ආහාර අංශු ඉවත් කිරීමට උපකාරී වේ.",
        "සමබර ආහාර සාමාන්‍ය සෞඛ්‍යයට සහ මුඛ සෞඛ්‍යයට සහාය වේ.",
        "සීනි පරිභෝජනය කරන වාර ගණන සීමා කිරීම වැදගත්ය.",
      ],
      questions: [
        {
          id: "dn-q1",
          question:
            "නිතර සීනි ගැනීමෙන් දත් කුහර අවදානම වැඩි වන්නේ ඇයි?",
          options: [
            "සීනි නිසා දත් ඉතා වේගයෙන් වැඩේ",
            "දන්ත පටල බැක්ටීරියා සීනි භාවිතා කර අම්ල නිපදවයි",
            "සීනි එනැමල් පැල්ලම් ඉවත් කරයි",
            "සීනි සෘජුව දත් මස් ශක්තිමත් කරයි",
          ],
          explanation:
            "දන්ත පටල බැක්ටීරියා සීනි පරිවර්තනය කර දත් එනැමල්ට හානි කළ හැකි අම්ල නිපදවයි.",
        },
        {
          id: "dn-q2",
          question:
            "දෛනික ජලපානය සඳහා සාමාන්‍යයෙන් හොඳම බීම කුමක්ද?",
          options: [
            "ජලය",
            "සීනි සහිත සිසිල් බීම",
            "ශක්ති බීම",
            "සීනි දමා තේ",
          ],
          explanation:
            "ජලය අමතර සීනි දත් වෙත නිරාවරණය නොකර ශරීරයේ ජල සමතුලිතතාවයට සහාය වේ.",
        },
        {
          id: "dn-q3",
          question:
            "දත් කුහර අවදානම අඩු කිරීමට උපකාරී විය හැකි හැසිරීම කුමක්ද?",
          options: [
            "නිතර රසකැවිලි කෑම",
            "සීනි සහිත ආහාර සහ බීම ගන්නා වාර ගණන සීමා කිරීම",
            "නිදා ගැනීමට පෙර සිසිල් බීම පානය කිරීම",
            "සීනි සහිත ආහාර දිගු කාලයක් මුඛයේ තබා ගැනීම",
          ],
          explanation:
            "දත් සීනිවලට නිරාවරණය වන වාර ගණන අඩු කිරීමෙන් නැවත නැවත ඇතිවන අම්ල ප්‍රහාර අඩු කළ හැක.",
        },
      ],
    },

    ta: {
      title: "உணவு மற்றும் ஊட்டச்சத்து",
      category: "ஊட்டச்சத்து",
      duration: "8 நிமிடங்கள்",
      description:
        "சர்க்கரை, தண்ணீர் மற்றும் ஊட்டச்சத்து வாய்ச் சுகாதாரத்தை எவ்வாறு பாதிக்கின்றன என்பதை புரிந்துகொள்ளுங்கள்.",
      lessonContent: [
        "அடிக்கடி சர்க்கரை உணவுகளும் பானங்களும் உட்கொள்வது பல் சொத்தை அபாயத்தை அதிகரிக்கிறது.",
        "பல் தகட்டிலுள்ள பாக்டீரியா சர்க்கரையை பயன்படுத்தி அமிலங்களை உருவாக்குகின்றன.",
        "தண்ணீர் உடல் நீர்ப்பராமரிப்பை ஆதரித்து உணவுத் துகள்களை அகற்ற உதவுகிறது.",
        "சமநிலையான உணவு உடல் ஆரோக்கியத்தையும் வாய்ச் சுகாதாரத்தையும் ஆதரிக்கிறது.",
        "சர்க்கரை உட்கொள்ளும் அடிக்கடி தன்மையை கட்டுப்படுத்துவது முக்கியம்.",
      ],
      questions: [
        {
          id: "dn-q1",
          question:
            "அடிக்கடி சர்க்கரை உட்கொள்வது பல் சொத்தை அபாயத்தை ஏன் அதிகரிக்கலாம்?",
          options: [
            "சர்க்கரை பற்களை மிக வேகமாக வளரச் செய்கிறது",
            "பல் தகட்டு பாக்டீரியா சர்க்கரையை பயன்படுத்தி அமிலங்களை உருவாக்குகின்றன",
            "சர்க்கரை எனாமல் கறைகளை அகற்றுகிறது",
            "சர்க்கரை நேரடியாக ஈறுகளை வலுப்படுத்துகிறது",
          ],
          explanation:
            "பல் தகட்டு பாக்டீரியா சர்க்கரையை மாற்றி பல் எனாமலை சேதப்படுத்தக்கூடிய அமிலங்களை உருவாக்குகின்றன.",
        },
        {
          id: "dn-q2",
          question:
            "தினசரி நீர்ப்பராமரிப்புக்கு பொதுவாக சிறந்த பானம் எது?",
          options: [
            "தண்ணீர்",
            "சர்க்கரை குளிர்பானம்",
            "எனர்ஜி பானம்",
            "சர்க்கரை சேர்த்த தேநீர்",
          ],
          explanation:
            "தண்ணீர் கூடுதல் சர்க்கரைக்கு பற்களை வெளிப்படுத்தாமல் நீர்ப்பராமரிப்பை ஆதரிக்கிறது.",
        },
        {
          id: "dn-q3",
          question:
            "பல் சொத்தை அபாயத்தை குறைக்க எந்த பழக்கம் உதவும்?",
          options: [
            "அடிக்கடி இனிப்புகளை சாப்பிடுவது",
            "சர்க்கரை உணவுகள் மற்றும் பானங்களை உட்கொள்ளும் அடிக்கடி தன்மையை குறைப்பது",
            "தூங்குவதற்கு முன் குளிர்பானம் குடிப்பது",
            "சர்க்கரை உணவை நீண்ட நேரம் வாயில் வைத்திருப்பது",
          ],
          explanation:
            "பற்கள் சர்க்கரைக்கு வெளிப்படும் அடிக்கடி தன்மையை குறைப்பது மீண்டும் மீண்டும் ஏற்படும் அமில தாக்கங்களை குறைக்கலாம்.",
        },
      ],
    },
  },

  "preventive-dental-care": {
    si: {
      title: "වැළැක්වීමේ දන්ත සත්කාර",
      category: "වැළැක්වීම",
      duration: "මිනිත්තු 9",
      description:
        "පරීක්ෂණ, ෆ්ලෝරයිඩ් සහ ඉක්මන් හඳුනාගැනීම මුඛ සෞඛ්‍යය ආරක්ෂා කරන ආකාරය ඉගෙන ගන්න.",
      lessonContent: [
        "නියමිත දන්ත පරීක්ෂණ ගැටලු ඉක්මනින් හඳුනා ගැනීමට උපකාරී වේ.",
        "ෆ්ලෝරයිඩ් දත් එනැමල් අම්ල හානියෙන් ආරක්ෂා කිරීමට උපකාරී වේ.",
        "සාමාන්‍ය දත් මැදීමෙන් ඉවත් කළ නොහැකි කැල්කියුලස් වෘත්තීය පිරිසිදු කිරීමෙන් ඉවත් කළ හැක.",
        "දන්ත සීලන්ට් අවදානම් සහිත කෑම මතුපිට ආරක්ෂා කිරීමට උපකාරී විය හැක.",
        "දියුණු දන්ත රෝග ප්‍රතිකාරයට වඩා වැළැක්වීම සාමාන්‍යයෙන් පහසුය.",
      ],
      questions: [
        {
          id: "pdc-q1",
          question:
            "නියමිත දන්ත පරීක්ෂණ වැදගත් වන්නේ ඇයි?",
          options: [
            "දන්ත රෝග කිසිදා ඇති නොවන බවට සහතික කරයි",
            "ගැටලු ඉක්මනින් හඳුනා ගැනීමට උපකාරී වේ",
            "දෛනික දත් මැදීම වෙනුවට භාවිතා කළ හැක",
            "ෆ්ලොස් කිරීම අවශ්‍ය නොකරයි",
          ],
          explanation:
            "නියමිත දන්ත පරීක්ෂණ මුඛ සෞඛ්‍ය ගැටලු ඉක්මනින් හඳුනා ගැනීමට සහ කළමනාකරණයට උපකාරී වේ.",
        },
        {
          id: "pdc-q2",
          question:
            "ෆ්ලෝරයිඩ්හි වැදගත් ප්‍රතිලාභයක් කුමක්ද?",
          options: [
            "එනැමල් ශක්තිමත් කර ආරක්ෂා කිරීමට උපකාරී වේ",
            "ලාලා වෙනුවට භාවිතා වේ",
            "සියලු වර්ගයේ පැල්ලම් සදාකාලිකව ඉවත් කරයි",
            "දන්ත පටල ඉක්මනින් වර්ධනය කරයි",
          ],
          explanation:
            "ෆ්ලෝරයිඩ් එනැමල් ශක්තිමත් කර අම්ල හානියට ප්‍රතිරෝධී කිරීමට උපකාරී වේ.",
        },
        {
          id: "pdc-q3",
          question:
            "සාමාන්‍ය දත් මැදීමෙන් ඉවත් කළ නොහැකි කුමක් වෘත්තීය පිරිසිදු කිරීමෙන් ඉවත් කළ හැකිද?",
          options: [
            "සියලු දත් මුල්",
            "කැල්කියුලස්",
            "සෞඛ්‍ය සම්පන්න එනැමල්",
            "දන්ත පිරවුම්",
          ],
          explanation:
            "දෘඩ වූ කැල්කියුලස් සාමාන්‍යයෙන් වෘත්තීය දන්ත පිරිසිදු කිරීමක් අවශ්‍ය කරයි.",
        },
      ],
    },

    ta: {
      title: "தடுப்பு பல் பராமரிப்பு",
      category: "தடுப்பு",
      duration: "9 நிமிடங்கள்",
      description:
        "பல் பரிசோதனைகள், ஃப்ளூரைடு மற்றும் ஆரம்ப கண்டறிதல் வாய்ச் சுகாதாரத்தை எவ்வாறு பாதுகாக்கின்றன என்பதை கற்றுக்கொள்ளுங்கள்.",
      lessonContent: [
        "வழக்கமான பல் பரிசோதனைகள் பிரச்சினைகளை ஆரம்பத்திலேயே கண்டறிய உதவுகின்றன.",
        "ஃப்ளூரைடு பல் எனாமலை அமில சேதத்திலிருந்து பாதுகாக்க உதவுகிறது.",
        "சாதாரண பல் துலக்குதல் அகற்ற முடியாத பல் கல்லை தொழில்முறை சுத்தம் அகற்ற முடியும்.",
        "பல் சீலன்ட்கள் பாதிக்கப்படக்கூடிய மெல்வதற்கான மேற்பரப்புகளை பாதுகாக்க உதவலாம்.",
        "மேம்பட்ட பல் நோயை சிகிச்சையளிப்பதை விட தடுப்பது பொதுவாக எளிதானது.",
      ],
      questions: [
        {
          id: "pdc-q1",
          question:
            "வழக்கமான பல் பரிசோதனைகள் ஏன் முக்கியம்?",
          options: [
            "பல் நோய் ஒருபோதும் ஏற்படாது என்று உறுதி செய்கின்றன",
            "பிரச்சினைகளை ஆரம்பத்திலேயே கண்டறிய உதவுகின்றன",
            "தினசரி பல் துலக்குதலை மாற்றுகின்றன",
            "பல் நூல் பயன்படுத்த தேவையில்லை",
          ],
          explanation:
            "வழக்கமான பல் பரிசோதனைகள் வாய்ச் சுகாதார பிரச்சினைகளை ஆரம்பத்திலேயே கண்டறிந்து நிர்வகிக்க உதவுகின்றன.",
        },
        {
          id: "pdc-q2",
          question:
            "ஃப்ளூரைடின் முக்கிய நன்மைகளில் ஒன்று எது?",
          options: [
            "எனாமலை வலுப்படுத்தி பாதுகாக்க உதவுகிறது",
            "உமிழ்நீரை மாற்றுகிறது",
            "அனைத்து கறைகளையும் நிரந்தரமாக அகற்றுகிறது",
            "பல் தகட்டு விரைவாக வளரச் செய்கிறது",
          ],
          explanation:
            "ஃப்ளூரைடு எனாமலை வலுப்படுத்தி அமில சேதத்துக்கு அதிக எதிர்ப்புள்ளதாக மாற்ற உதவுகிறது.",
        },
        {
          id: "pdc-q3",
          question:
            "சாதாரண பல் துலக்குதல் அகற்ற முடியாத எதை தொழில்முறை சுத்தம் அகற்ற முடியும்?",
          options: [
            "அனைத்து பல் வேர்களையும்",
            "பல் கல்",
            "ஆரோக்கியமான எனாமல்",
            "பல் நிரப்புதல்கள்",
          ],
          explanation:
            "கடினமடைந்த பல் கல்லை பொதுவாக தொழில்முறை பல் சுத்தம் மூலம் அகற்ற வேண்டும்.",
        },
      ],
    },
  },

  "gum-health": {
    si: {
      title: "දත් මස් සෞඛ්‍යය",
      category: "දත් මස්",
      duration: "මිනිත්තු 9",
      description:
        "දත් මස් ගැටලු වල ලක්ෂණ හඳුනාගෙන දත් මස් ආරක්ෂා කරන ආකාරය තේරුම් ගන්න.",
      lessonContent: [
        "සෞඛ්‍ය සම්පන්න දත් මස් සාමාන්‍යයෙන් තද වන අතර නිතර ලේ ගැලීම සිදු නොවේ.",
        "දත් මැදීමේදී ලේ ගැලීම දත් මස් දැවිල්ල සමඟ සම්බන්ධ විය හැක.",
        "ජින්ජිවයිටිස් අවදානම අඩු කිරීමට දන්ත පටල ඉවත් කිරීම අත්‍යවශ්‍ය වේ.",
        "දුම්පානය දත් මස් රෝගයේ අවදානම සහ බරපතලකම වැඩි කළ හැක.",
        "දිගටම පවතින දත් මස් රෝග ලක්ෂණ දන්ත වෛද්‍ය වෘත්තිකයෙකු විසින් ඇගයිය යුතුය.",
      ],
      questions: [
        {
          id: "gh-q1",
          question:
            "දත් මස් දැවිල්ලේ මුල් ලක්ෂණයක් විය හැක්කේ කුමක්ද?",
          options: [
            "දත් මැදීමේදී නිතර දත් මස් ලේ ගැලීම",
            "දත් එක රැයකින් ස්වභාවිකව දිගු වීම",
            "දත් බුරුසුවේ වර්ණය වෙනස් වීම",
            "දිව සදාකාලිකව මෘදු වීම",
          ],
          explanation:
            "දත් මැදීමේදී ලේ ගැලීම දැවිල්ල ඇති දත් මස් වල මුල් ලක්ෂණයක් විය හැක.",
        },
        {
          id: "gh-q2",
          question:
            "ජින්ජිවයිටිස් වැළැක්වීමට වැදගත් ක්‍රමයක් කුමක්ද?",
          options: [
            "දන්ත පටල දත් මත තබා ගැනීම",
            "දිනපතා දන්ත පටල ඵලදායීව ඉවත් කිරීම",
            "සියලු ජලය වළක්වා ගැනීම",
            "මාසයකට එක් වරක් පමණක් දත් මැදීම",
          ],
          explanation:
            "නිතර දත් මැදීම සහ දත් අතර පිරිසිදු කිරීම ජින්ජිවයිටිස් සඳහා දායක වන දන්ත පටල ඉවත් කිරීමට උපකාරී වේ.",
        },
        {
          id: "gh-q3",
          question:
            "දත් මස් රෝග අවදානම වැඩි කළ හැකි පුරුද්ද කුමක්ද?",
          options: [
            "ජලය පානය කිරීම",
            "දුම්පානය",
            "මෘදු දත් බුරුසුවක් නිවැරදිව භාවිතා කිරීම",
            "දන්ත පරීක්ෂණ සඳහා යාම",
          ],
          explanation:
            "දුම්පානය දත් මස් රෝග සඳහා වැදගත් අවදානම් සාධකයකි.",
        },
      ],
    },

    ta: {
      title: "ஈறு ஆரோக்கியம்",
      category: "ஈறுகள்",
      duration: "9 நிமிடங்கள்",
      description:
        "ஈறு பிரச்சினைகளின் அறிகுறிகளை அறிந்து ஈறுகளை எவ்வாறு பாதுகாப்பது என்பதை புரிந்துகொள்ளுங்கள்.",
      lessonContent: [
        "ஆரோக்கியமான ஈறுகள் பொதுவாக உறுதியாக இருக்கும் மற்றும் அடிக்கடி இரத்தம் கசியாது.",
        "பல் துலக்கும் போது இரத்தப்போக்கு ஈறு அழற்சியுடன் தொடர்புடையதாக இருக்கலாம்.",
        "ஈறு அழற்சி அபாயத்தை குறைக்க பல் தகட்டை அகற்றுவது அவசியம்.",
        "புகைப்பிடித்தல் ஈறு நோயின் அபாயத்தையும் தீவிரத்தையும் அதிகரிக்கலாம்.",
        "தொடர்ந்து நீடிக்கும் ஈறு அறிகுறிகளை பல் மருத்துவ நிபுணர் மதிப்பீடு செய்ய வேண்டும்.",
      ],
      questions: [
        {
          id: "gh-q1",
          question:
            "ஈறு அழற்சியின் ஆரம்ப அறிகுறியாக எது இருக்கலாம்?",
          options: [
            "பல் துலக்கும் போது அடிக்கடி ஈறு இரத்தப்போக்கு",
            "பற்கள் இரவில் இயல்பாக நீளமாவதல்",
            "பல் துலக்கியின் நிறம் மாறுதல்",
            "நாக்கு நிரந்தரமாக மென்மையாக மாறுதல்",
          ],
          explanation:
            "பல் துலக்கும் போது இரத்தப்போக்கு ஈறுகளில் அழற்சியின் ஆரம்ப அறிகுறியாக இருக்கலாம்.",
        },
        {
          id: "gh-q2",
          question:
            "ஈறு அழற்சியை தடுக்கும் முக்கிய முறை எது?",
          options: [
            "பல் தகட்டை பற்களில் விடுவது",
            "தினசரி பல் தகட்டை திறம்பட அகற்றுவது",
            "அனைத்து தண்ணீரையும் தவிர்ப்பது",
            "மாதத்திற்கு ஒருமுறை மட்டும் பல் துலக்குவது",
          ],
          explanation:
            "வழக்கமான பல் துலக்குதல் மற்றும் பற்களுக்கிடை சுத்தம் ஈறு அழற்சிக்கு காரணமான பல் தகட்டை அகற்ற உதவுகின்றன.",
        },
        {
          id: "gh-q3",
          question:
            "ஈறு நோய் அபாயத்தை அதிகரிக்கக்கூடிய பழக்கம் எது?",
          options: [
            "தண்ணீர் குடிப்பது",
            "புகைப்பிடித்தல்",
            "மென்மையான பல் துலக்கியை சரியாக பயன்படுத்துவது",
            "பல் பரிசோதனைகளுக்கு செல்வது",
          ],
          explanation:
            "புகைப்பிடித்தல் ஈறு நோய்க்கான முக்கிய அபாய காரணியாகும்.",
        },
      ],
    },
  },

  "oral-cancer-awareness": {
    si: {
      title: "මුඛ පිළිකා පිළිබඳ දැනුවත්භාවය",
      category: "දැනුවත්භාවය",
      duration: "මිනිත්තු 10",
      description:
        "අවදානම් ලක්ෂණ සහ ශ්‍රී ලංකාවට වැදගත් මුඛ පිළිකා අවදානම් සාධක ගැන ඉගෙන ගන්න.",
      lessonContent: [
        "දුම්කොළ, දුම්පානය සහ බුලත් හපීම වැදගත් මුඛ පිළිකා අවදානම් සාධක වේ.",
        "සුව නොවන මුඛ තුවාලයක් පරීක්ෂා කළ යුතුය.",
        "හේතුව නොදන්නා රතු හෝ සුදු පැල්ලම් වෘත්තීය ඇගයීමක් අවශ්‍ය කරයි.",
        "ගිලීමට අපහසු වීම හෝ දිගටම පවතින මුඛ ගැටිත්තක් නොසලකා හැරිය යුතු නැත.",
        "ඉක්මන් වෘත්තීය පරීක්ෂාව ඉක්මන් හඳුනාගැනීමේ අවස්ථාව වැඩි කරයි.",
      ],
      questions: [
        {
          id: "oca-q1",
          question:
            "වැදගත් මුඛ පිළිකා අවදානම් පුරුද්ද කුමක්ද?",
          options: [
            "සාමාන්‍ය ජලය පානය කිරීම",
            "දුම්කොළ සමඟ බුලත් හපීම",
            "ෆ්ලෝරයිඩ් දන්තාලේප භාවිතය",
            "සමබර ආහාර ගැනීම",
          ],
          explanation:
            "විශේෂයෙන් දුම්කොළ සමඟ බුලත් හපීම මුඛ පිළිකා අවදානම වැඩි වීම සමඟ සම්බන්ධ වේ.",
        },
        {
          id: "oca-q2",
          question:
            "වෘත්තීය ඇගයීමක් ලබාගත යුතු රෝග ලක්ෂණය කුමක්ද?",
          options: [
            "සුව නොවන මුඛ තුවාලයක්",
            "ව්‍යායාමයෙන් පසු තාවකාලික පිපාසය",
            "දත් බුරුසුව තෙත් වීම",
            "සාමාන්‍ය ලාලා නිෂ්පාදනය",
          ],
          explanation:
            "දිගටම සුව නොවන තුවාලයක් සුදුසුකම් ලත් දන්ත හෝ වෛද්‍ය වෘත්තිකයෙකු විසින් පරීක්ෂා කළ යුතුය.",
        },
        {
          id: "oca-q3",
          question:
            "මුඛ පිළිකා සඳහා ඉක්මන් ඇගයීම වැදගත් වන්නේ ඇයි?",
          options: [
            "ඉක්මන් හඳුනාගැනීම සහ ප්‍රතිකාර සඳහා උපකාරී විය හැක",
            "කිසිදු පරීක්ෂාවක් අවශ්‍ය නොවන බවට සහතික කරයි",
            "සියලු දත් නැවත වැඩීමට හේතු වේ",
            "දුම්කොළ නතර කිරීමේ අවශ්‍යතාවය ඉවත් කරයි",
          ],
          explanation:
            "ඉක්මන් ඇගයීම ඉක්මන් රෝග විනිශ්චය සහ කළමනාකරණයට සහාය විය හැක.",
        },
      ],
    },

    ta: {
      title: "வாய் புற்றுநோய் விழிப்புணர்வு",
      category: "விழிப்புணர்வு",
      duration: "10 நிமிடங்கள்",
      description:
        "எச்சரிக்கை அறிகுறிகளையும் இலங்கையில் முக்கியமான வாய் புற்றுநோய் அபாய காரணிகளையும் கற்றுக்கொள்ளுங்கள்.",
      lessonContent: [
        "புகையிலை, புகைப்பிடித்தல் மற்றும் வெற்றிலை மென்றல் முக்கிய வாய் புற்றுநோய் அபாய காரணிகளாகும்.",
        "ஆறாத வாய் புண் பரிசோதிக்கப்பட வேண்டும்.",
        "காரணமில்லாத சிவப்பு அல்லது வெள்ளை தழும்புகள் தொழில்முறை மதிப்பீட்டை தேவைப்படுத்துகின்றன.",
        "விழுங்குவதில் சிரமம் அல்லது நீடித்த வாய்க் கட்டி புறக்கணிக்கப்படக்கூடாது.",
        "ஆரம்ப தொழில்முறை பரிசோதனை ஆரம்ப கண்டறிதலுக்கான வாய்ப்பை மேம்படுத்துகிறது.",
      ],
      questions: [
        {
          id: "oca-q1",
          question:
            "முக்கிய வாய் புற்றுநோய் அபாய பழக்கம் எது?",
          options: [
            "சாதாரண தண்ணீர் குடிப்பது",
            "புகையிலையுடன் வெற்றிலை மென்றல்",
            "ஃப்ளூரைடு பற்பசை பயன்படுத்துவது",
            "சமநிலையான உணவு சாப்பிடுவது",
          ],
          explanation:
            "குறிப்பாக புகையிலையுடன் வெற்றிலை மென்றல் அதிக வாய் புற்றுநோய் அபாயத்துடன் தொடர்புடையது.",
        },
        {
          id: "oca-q2",
          question:
            "எந்த அறிகுறிக்கு தொழில்முறை மதிப்பீடு தேவை?",
          options: [
            "ஆறாத வாய் புண்",
            "உடற்பயிற்சிக்குப் பிறகு தற்காலிக தாகம்",
            "பல் துலக்கி நனைதல்",
            "சாதாரண உமிழ்நீர் உற்பத்தி",
          ],
          explanation:
            "நீடித்து ஆறாத புண் தகுதியான பல் அல்லது மருத்துவ நிபுணரால் பரிசோதிக்கப்பட வேண்டும்.",
        },
        {
          id: "oca-q3",
          question:
            "வாய் புற்றுநோய்க்கான ஆரம்ப மதிப்பீடு ஏன் முக்கியம்?",
          options: [
            "ஆரம்ப கண்டறிதல் மற்றும் சிகிச்சைக்கு உதவலாம்",
            "எந்த பரிசோதனையும் தேவையில்லை என்று உறுதி செய்கிறது",
            "ஒவ்வொரு பல்லையும் மீண்டும் வளரச் செய்கிறது",
            "புகையிலை பயன்பாட்டை நிறுத்த தேவையில்லை",
          ],
          explanation:
            "ஆரம்ப மதிப்பீடு ஆரம்ப நோயறிதல் மற்றும் மேலாண்மைக்கு உதவலாம்.",
        },
      ],
    },
  },

  "dental-emergencies": {
    si: {
      title: "දන්ත හදිසි අවස්ථා",
      category: "හදිසි අවස්ථා",
      duration: "මිනිත්තු 8",
      description:
        "හදිසි දන්ත තත්ත්වයන්ට ආරක්ෂිතව ප්‍රතිචාර දක්වන ආකාරය ඉගෙන ගන්න.",
      lessonContent: [
        "හුස්ම ගැනීමට හෝ ගිලීමට අපහසුතාව සමඟ මුහුණේ ඉදිමීම හදිසි ප්‍රතිකාර අවශ්‍ය කරයි.",
        "පිටතට වැටුණු ස්ථිර දතකට වහාම වෘත්තීය අවධානය අවශ්‍ය වේ.",
        "පාලනය කළ නොහැකි බරපතල ලේ ගැලීම හදිසි ඇගයීමක් අවශ්‍ය කරයි.",
        "වේදනාව අඩු ලෙස පෙනුණත් දන්ත තුවාල ඇගයිය යුතුය.",
        "OralVista අධ්‍යාපනික මගපෙන්වීම ලබාදෙන අතර හදිසි සේවාවන් වෙනුවට භාවිතා කළ නොහැක.",
      ],
      questions: [
        {
          id: "de-q1",
          question:
            "වහාම වෘත්තීය ප්‍රතිකාර අවශ්‍ය සංයෝජනය කුමක්ද?",
          options: [
            "මුහුණේ ඉදිමීම සහ හුස්ම ගැනීමට අපහසු වීම",
            "ඇවිදීමෙන් පසු සුළු පිපාසය",
            "පිරිසිදු දත් බුරුසුවක්",
            "වේදනාවකින් තොර සාමාන්‍ය කෑම",
          ],
          explanation:
            "හුස්ම ගැනීමට අපහසුතාව සමඟ මුහුණේ ඉදිමීම බරපතල හදිසි තත්ත්වයක සලකුණක් විය හැක.",
        },
        {
          id: "de-q2",
          question:
            "ස්ථිර දතක් පිටතට වැටුණහොත් කළ යුත්තේ කුමක්ද?",
          options: [
            "සති කිහිපයක් බලා සිටීම",
            "වහාම වෘත්තීය දන්ත ප්‍රතිකාර ලබාගැනීම",
            "දත වහාම ඉවත දැමීම",
            "ලේ ගැලීම නතර වූ විට තුවාලය නොසලකා හැරීම",
          ],
          explanation:
            "පිටතට වැටුණු ස්ථිර දතකට වහාම වෘත්තීය දන්ත ප්‍රතිකාර අවශ්‍ය වේ.",
        },
        {
          id: "de-q3",
          question:
            "OralVista හදිසි වෛද්‍ය හෝ දන්ත සේවාවන් වෙනුවට භාවිතා කළ හැකිද?",
          options: [
            "ඔව්, සෑම අවස්ථාවකම",
            "සති අන්තවල පමණක්",
            "නැත",
            "ළමුන් සඳහා පමණක්",
          ],
          explanation:
            "OralVista අධ්‍යාපනික මගපෙන්වීම ලබාදෙන අතර හදිසි ප්‍රතිකාර වෙනුවට භාවිතා කළ නොහැක.",
        },
      ],
    },

    ta: {
      title: "பல் அவசரநிலைகள்",
      category: "அவசரம்",
      duration: "8 நிமிடங்கள்",
      description:
        "அவசரமான பல் நிலைகளுக்கு பாதுகாப்பாக எவ்வாறு பதிலளிப்பது என்பதை கற்றுக்கொள்ளுங்கள்.",
      lessonContent: [
        "மூச்சு விடுவதில் அல்லது விழுங்குவதில் சிரமத்துடன் முக வீக்கம் ஏற்பட்டால் அவசர சிகிச்சை தேவை.",
        "விழுந்த நிரந்தர பல்லுக்கு உடனடி தொழில்முறை கவனம் தேவை.",
        "கட்டுப்படுத்த முடியாத கடுமையான இரத்தப்போக்கு அவசர மதிப்பீட்டை தேவைப்படுத்துகிறது.",
        "வலி குறைவாக இருந்தாலும் பல் காயம் மதிப்பீடு செய்யப்பட வேண்டும்.",
        "OralVista கல்வி வழிகாட்டலை வழங்குகிறது; அது அவசர சேவைகளை மாற்றாது.",
      ],
      questions: [
        {
          id: "de-q1",
          question:
            "எந்த இணைப்பு உடனடி தொழில்முறை சிகிச்சையை தேவைப்படுத்துகிறது?",
          options: [
            "முக வீக்கம் மற்றும் மூச்சு விடுவதில் சிரமம்",
            "நடந்த பிறகு லேசான தாகம்",
            "சுத்தமான பல் துலக்கி",
            "வலி இல்லாத சாதாரண மெல்வது",
          ],
          explanation:
            "மூச்சு விடுவதில் சிரமத்துடன் முக வீக்கம் ஒரு தீவிர அவசரநிலையை குறிக்கலாம்.",
        },
        {
          id: "de-q2",
          question:
            "ஒரு நிரந்தர பல் விழுந்துவிட்டால் என்ன செய்ய வேண்டும்?",
          options: [
            "பல வாரங்கள் காத்திருக்கவும்",
            "உடனடி தொழில்முறை பல் சிகிச்சையை நாடவும்",
            "பல்லை உடனே தூக்கி எறியவும்",
            "இரத்தப்போக்கு நின்றால் காயத்தை புறக்கணிக்கவும்",
          ],
          explanation:
            "விழுந்த நிரந்தர பல்லுக்கு உடனடி தொழில்முறை பல் சிகிச்சை தேவை.",
        },
        {
          id: "de-q3",
          question:
            "OralVista அவசர மருத்துவ அல்லது பல் சேவைகளை மாற்ற முடியுமா?",
          options: [
            "ஆம், எல்லா சூழ்நிலைகளிலும்",
            "வார இறுதிகளில் மட்டும்",
            "இல்லை",
            "குழந்தைகளுக்கு மட்டும்",
          ],
          explanation:
            "OralVista கல்வி வழிகாட்டலை வழங்குகிறது; அது அவசர சிகிச்சையை மாற்ற முடியாது.",
        },
      ],
    },
  },
};


/* Attach the Sinhala and Tamil translations to each original lesson. */
tutorLessons.forEach((lesson) => {
  lesson.translations =
    tutorLessonTranslations[
      lesson.id
    ] || {};
});


module.exports = tutorLessons;
