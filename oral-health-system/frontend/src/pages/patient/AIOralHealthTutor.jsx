import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock3,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";
import api from "../../api/axios.js";

import {
  getStoredUser,
} from "../../api/authStorage.js";

const languageNameToCode = (language) => {
  const normalized =
    String(language || "English")
      .trim()
      .toLowerCase();

  if (normalized === "sinhala") return "si";
  if (normalized === "tamil") return "ta";
  return "en";
};

const tutorTranslations = {
  en: {
    pageTitle: "Oral and Dental Health Education & Quiz",
    breadcrumb: "Dashboard › Oral and Dental Health Education & Quiz",
    loadingLessons: "Loading tutor lessons...",
    unableLoad: "Unable to load the oral-health tutor.",
    chooseAnswer: "Please choose an answer before continuing.",
    answerAll: "Please answer every question before submitting the quiz.",
    unableSubmit: "Unable to submit the quiz.",
    learningCentre: "OralVista Learning Centre",
    heroTitle: "Learn, practise and improve",
    heroText: "Complete short oral-health lessons, answer one question at a time and save your results securely.",
    topics: "topics",
    oneAtATime: "One question at a time",
    mongodbProgress: "MongoDB progress",
    currentLesson: "Current lesson",
    selectLesson: "Select a lesson",
    questions: "questions",
    shortLesson: "Short lesson",
    learningLibrary: "Learning library",
    lessons: "Lessons",
    attempts: "attempts",
    attempt: "attempt",
    lesson: "lesson",
    keyPoints: "Key learning points",
    knowledgeQuiz: "Knowledge quiz",
    question: "Question",
    of: "of",
    correctAnswer: "Correct answer",
    previous: "Previous",
    nextQuestion: "Next question",
    calculating: "Calculating...",
    submitQuiz: "Submit quiz",
    reviewNext: "Review next",
    tryAgain: "Try again",
    yourPerformance: "Your performance",
    progress: "Progress",
    completed: "completed",
    lessonsPassed: "lessons successfully passed.",
    completedLabel: "Completed",
    attempted: "Attempted",
    quizAttempts: "Quiz attempts",
    latestScore: "Latest score",
    quizCompleted: "Quiz completed",
    wellDone: "Well done!",
    goodAttempt: "Good attempt",
    passedMessage: "You passed this lesson and your progress has been saved.",
    retryMessage: "Review the feedback and try again to pass this lesson.",
    correct: "correct",
    reviewAnswers: "Review answers",
    closeError: "Close error",
    closeResult: "Close result",
  },

  si: {
    pageTitle: "මුඛ හා දන්ත සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය",
    breadcrumb: "උපකරණ පුවරුව › මුඛ හා දන්ත සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය",
    loadingLessons: "අධ්‍යාපන පාඩම් පූරණය වෙමින්...",
    unableLoad: "මුඛ සෞඛ්‍ය අධ්‍යාපන මොඩියුලය පූරණය කළ නොහැක.",
    chooseAnswer: "ඉදිරියට යාමට පෙර පිළිතුරක් තෝරන්න.",
    answerAll: "ප්‍රශ්නාවලිය යැවීමට පෙර සියලු ප්‍රශ්නවලට පිළිතුරු දෙන්න.",
    unableSubmit: "ප්‍රශ්නාවලිය යැවීමට නොහැකි විය.",
    learningCentre: "OralVista ඉගෙනුම් මධ්‍යස්ථානය",
    heroTitle: "ඉගෙන ගන්න, පුහුණු වන්න සහ වැඩිදියුණු වන්න",
    heroText: "කෙටි මුඛ සෞඛ්‍ය පාඩම් සම්පූර්ණ කර, වරකට එක් ප්‍රශ්නයකට පිළිතුරු දී, ඔබගේ ප්‍රතිඵල ආරක්ෂිතව සුරකින්න.",
    topics: "මාතෘකා",
    oneAtATime: "වරකට එක් ප්‍රශ්නයක්",
    mongodbProgress: "MongoDB ප්‍රගතිය",
    currentLesson: "වත්මන් පාඩම",
    selectLesson: "පාඩමක් තෝරන්න",
    questions: "ප්‍රශ්න",
    shortLesson: "කෙටි පාඩම",
    learningLibrary: "ඉගෙනුම් පුස්තකාලය",
    lessons: "පාඩම්",
    attempts: "උත්සාහ",
    attempt: "උත්සාහය",
    lesson: "පාඩම",
    keyPoints: "ප්‍රධාන ඉගෙනුම් කරුණු",
    knowledgeQuiz: "දැනුම් ප්‍රශ්නාවලිය",
    question: "ප්‍රශ්නය",
    of: "න්",
    correctAnswer: "නිවැරදි පිළිතුර",
    previous: "පෙර",
    nextQuestion: "ඊළඟ ප්‍රශ්නය",
    calculating: "ගණනය කරමින්...",
    submitQuiz: "ප්‍රශ්නාවලිය යවන්න",
    reviewNext: "ඊළඟ පිළිතුර සමාලෝචනය කරන්න",
    tryAgain: "නැවත උත්සාහ කරන්න",
    yourPerformance: "ඔබගේ කාර්ය සාධනය",
    progress: "ප්‍රගතිය",
    completed: "සම්පූර්ණයි",
    lessonsPassed: "පාඩම් සාර්ථකව සමත් වී ඇත.",
    completedLabel: "සම්පූර්ණ කළ",
    attempted: "උත්සාහ කළ",
    quizAttempts: "ප්‍රශ්නාවලි උත්සාහ",
    latestScore: "නවතම ලකුණු",
    quizCompleted: "ප්‍රශ්නාවලිය සම්පූර්ණයි",
    wellDone: "හොඳ වැඩක්!",
    goodAttempt: "හොඳ උත්සාහයක්",
    passedMessage: "ඔබ මෙම පාඩම සමත් වී ඇත සහ ඔබගේ ප්‍රගතිය සුරකින ලදී.",
    retryMessage: "ප්‍රතිචාර සමාලෝචනය කර මෙම පාඩම සමත් වීමට නැවත උත්සාහ කරන්න.",
    correct: "නිවැරදි",
    reviewAnswers: "පිළිතුරු සමාලෝචනය කරන්න",
    closeError: "දෝෂය වසන්න",
    closeResult: "ප්‍රතිඵලය වසන්න",
  },

  ta: {
    pageTitle: "வாய் மற்றும் பல் சுகாதாரக் கல்வி மற்றும் வினாடி வினா",
    breadcrumb: "முகப்புப் பலகை › வாய் மற்றும் பல் சுகாதாரக் கல்வி மற்றும் வினாடி வினா",
    loadingLessons: "கல்விப் பாடங்கள் ஏற்றப்படுகின்றன...",
    unableLoad: "வாய்ச் சுகாதார கல்வி தொகுதியை ஏற்ற முடியவில்லை.",
    chooseAnswer: "தொடர்வதற்கு முன் ஒரு பதிலைத் தேர்ந்தெடுக்கவும்.",
    answerAll: "வினாடி வினாவை சமர்ப்பிப்பதற்கு முன் அனைத்து கேள்விகளுக்கும் பதிலளிக்கவும்.",
    unableSubmit: "வினாடி வினாவை சமர்ப்பிக்க முடியவில்லை.",
    learningCentre: "OralVista கற்றல் மையம்",
    heroTitle: "கற்றுக்கொள்ளுங்கள், பயிற்சி செய்யுங்கள், மேம்படுங்கள்",
    heroText: "குறுகிய வாய்ச் சுகாதாரப் பாடங்களை முடித்து, ஒரு நேரத்தில் ஒரு கேள்விக்கு பதிலளித்து, உங்கள் முடிவுகளை பாதுகாப்பாக சேமிக்கவும்.",
    topics: "தலைப்புகள்",
    oneAtATime: "ஒரு நேரத்தில் ஒரு கேள்வி",
    mongodbProgress: "MongoDB முன்னேற்றம்",
    currentLesson: "தற்போதைய பாடம்",
    selectLesson: "ஒரு பாடத்தைத் தேர்ந்தெடுக்கவும்",
    questions: "கேள்விகள்",
    shortLesson: "குறுகிய பாடம்",
    learningLibrary: "கற்றல் நூலகம்",
    lessons: "பாடங்கள்",
    attempts: "முயற்சிகள்",
    attempt: "முயற்சி",
    lesson: "பாடம்",
    keyPoints: "முக்கிய கற்றல் குறிப்புகள்",
    knowledgeQuiz: "அறிவு வினாடி வினா",
    question: "கேள்வி",
    of: "இல்",
    correctAnswer: "சரியான பதில்",
    previous: "முந்தையது",
    nextQuestion: "அடுத்த கேள்வி",
    calculating: "கணக்கிடப்படுகிறது...",
    submitQuiz: "வினாடி வினாவை சமர்ப்பிக்கவும்",
    reviewNext: "அடுத்ததை மதிப்பாய்வு செய்யவும்",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    yourPerformance: "உங்கள் செயல்திறன்",
    progress: "முன்னேற்றம்",
    completed: "முடிந்தது",
    lessonsPassed: "பாடங்கள் வெற்றிகரமாக தேர்ச்சி பெற்றன.",
    completedLabel: "முடிக்கப்பட்டது",
    attempted: "முயற்சிக்கப்பட்டது",
    quizAttempts: "வினாடி வினா முயற்சிகள்",
    latestScore: "சமீபத்திய மதிப்பெண்",
    quizCompleted: "வினாடி வினா முடிந்தது",
    wellDone: "நன்றாக செய்தீர்கள்!",
    goodAttempt: "நல்ல முயற்சி",
    passedMessage: "இந்த பாடத்தில் நீங்கள் தேர்ச்சி பெற்றீர்கள்; உங்கள் முன்னேற்றம் சேமிக்கப்பட்டது.",
    retryMessage: "கருத்துக்களை மதிப்பாய்வு செய்து இந்த பாடத்தில் தேர்ச்சி பெற மீண்டும் முயற்சிக்கவும்.",
    correct: "சரி",
    reviewAnswers: "பதில்களை மதிப்பாய்வு செய்யவும்",
    closeError: "பிழையை மூடவும்",
    closeResult: "முடிவை மூடவும்",
  },
};

/*
 * Dynamic lesson text comes from the backend.
 * If a lesson contains:
 *
 * translations: {
 *   si: { title, description, category, duration, lessonContent, questions },
 *   ta: { title, description, category, duration, lessonContent, questions }
 * }
 *
 * this frontend will automatically display it.
 * Otherwise it safely falls back to the original English lesson data.
 */
const localizeLesson = (lesson, languageCode) => {
  if (!lesson) return null;
  if (languageCode === "en") return lesson;

  const translated =
    lesson.translations?.[languageCode];

  if (!translated) return lesson;

  return {
    ...lesson,
    ...translated,
    questions:
      translated.questions ||
      lesson.questions ||
      [],
    lessonContent:
      translated.lessonContent ||
      lesson.lessonContent ||
      [],
  };
};

const DEFAULT_PROGRESS = {
  totalLessons: 8,
  completedLessons: 0,
  attemptedLessons: 0,
  totalQuizAttempts: 0,
  overallProgress: 0,
};

export default function AIOralVistaHealthTutor() {
  const [currentUser, setCurrentUser] =
    useState(getStoredUser());
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] =
    useState("");
  const [selectedAnswers, setSelectedAnswers] =
    useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [learningPointsOpen, setLearningPointsOpen] =
    useState(false);
  const [result, setResult] = useState(null);
  const [showResultModal, setShowResultModal] =
    useState(false);
  const [progress, setProgress] =
    useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const refreshCurrentUser = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener(
      "oralvista-user-updated",
      refreshCurrentUser
    );

    window.addEventListener(
      "storage",
      refreshCurrentUser
    );

    return () => {
      window.removeEventListener(
        "oralvista-user-updated",
        refreshCurrentUser
      );

      window.removeEventListener(
        "storage",
        refreshCurrentUser
      );
    };
  }, []);

  const languageCode =
    languageNameToCode(
      currentUser?.language
    );

  const t =
    tutorTranslations[languageCode] ||
    tutorTranslations.en;

  const selectedLesson = useMemo(
    () =>
      localizeLesson(
        lessons.find(
          (lesson) =>
            lesson.id === selectedLessonId
        ) || null,
        languageCode
      ),
    [
      lessons,
      selectedLessonId,
      languageCode,
    ]
  );

  const questions =
    selectedLesson?.questions || [];

  const currentQuestion =
    questions[currentQuestionIndex] || null;

  const currentQuestionCount =
    questions.length;

  const answeredCount = useMemo(
    () =>
      questions.filter((question) =>
        Number.isInteger(
          selectedAnswers[question.id]
        )
      ).length,
    [questions, selectedAnswers]
  );

  const localQuizProgress =
    currentQuestionCount > 0
      ? Math.round(
          (answeredCount /
            currentQuestionCount) *
            100
        )
      : 0;

  const currentFeedback =
    result?.feedback?.find(
      (item) =>
        item.questionId ===
        currentQuestion?.id
    ) || null;

  const localizedCorrectAnswerText =
    currentFeedback &&
    Number.isInteger(
      currentFeedback.correctAnswer
    )
      ? currentQuestion?.options?.[
          currentFeedback.correctAnswer
        ] ||
        currentFeedback.correctAnswerText
      : currentFeedback?.correctAnswerText;

  const localizedFeedbackExplanation =
    currentQuestion?.explanation ||
    currentFeedback?.explanation ||
    "";

  const currentSelectedAnswer =
    currentQuestion
      ? selectedAnswers[currentQuestion.id]
      : undefined;

  const currentQuestionAnswered =
    Number.isInteger(
      currentSelectedAnswer
    );

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex ===
    currentQuestionCount - 1;

  const loadTutor = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        lessonsResponse,
        progressResponse,
      ] = await Promise.all([
        api.get("/tutor/lessons"),
        api.get("/tutor/progress"),
      ]);

      const loadedLessons =
        lessonsResponse.data?.lessons ||
        [];

      setLessons(loadedLessons);

      setProgress(
        progressResponse.data?.summary ||
          {
            ...DEFAULT_PROGRESS,
            totalLessons:
              loadedLessons.length ||
              DEFAULT_PROGRESS.totalLessons,
          }
      );

      setSelectedLessonId(
        (current) =>
          current ||
          loadedLessons[0]?.id ||
          ""
      );
    } catch (requestError) {
      console.error(
        "Tutor loading failed:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          t.unableLoad
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutor();
  }, []);

  useEffect(() => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setLearningPointsOpen(false);
    setResult(null);
    setShowResultModal(false);
    setError("");
  }, [selectedLessonId]);

  const chooseAnswer = (
    questionId,
    optionIndex
  ) => {
    if (result) {
      return;
    }

    setSelectedAnswers(
      (current) => ({
        ...current,
        [questionId]: optionIndex,
      })
    );

    setError("");
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(
      (current) =>
        Math.max(current - 1, 0)
    );
    setError("");
  };

  const goToNextQuestion = () => {
    if (!currentQuestionAnswered) {
      setError(
        t.chooseAnswer
      );
      return;
    }

    setCurrentQuestionIndex(
      (current) =>
        Math.min(
          current + 1,
          currentQuestionCount - 1
        )
    );

    setError("");
  };

  const submitQuiz = async () => {
    if (!selectedLesson) {
      return;
    }

    if (
      answeredCount !==
      currentQuestionCount
    ) {
      const firstUnansweredIndex =
        questions.findIndex(
          (question) =>
            !Number.isInteger(
              selectedAnswers[
                question.id
              ]
            )
        );

      if (firstUnansweredIndex >= 0) {
        setCurrentQuestionIndex(
          firstUnansweredIndex
        );
      }

      setError(
        t.answerAll
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const answers =
        questions.map(
          (question) => ({
            questionId:
              question.id,
            selectedAnswer:
              selectedAnswers[
                question.id
              ],
          })
        );

      const response =
        await api.post(
          `/tutor/lessons/${selectedLesson.id}/submit`,
          { answers }
        );

      const submittedResult =
        response.data.result;

      setResult(submittedResult);
      setShowResultModal(true);

      const [
        progressResponse,
        lessonsResponse,
      ] = await Promise.all([
        api.get("/tutor/progress"),
        api.get("/tutor/lessons"),
      ]);

      setProgress(
        progressResponse.data?.summary ||
          DEFAULT_PROGRESS
      );

      setLessons(
        lessonsResponse.data?.lessons ||
          []
      );
    } catch (requestError) {
      console.error(
        "Quiz submission failed:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          t.unableSubmit
      );
    } finally {
      setSubmitting(false);
    }
  };

  const tryAgain = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setShowResultModal(false);
    setError("");
  };

  const continueAfterResult = () => {
    setShowResultModal(false);
    setCurrentQuestionIndex(0);
  };

  if (loading) {
    return (
      <PatientLayout
        title={t.pageTitle}
        breadcrumb={t.breadcrumb}
      >
        <div className="flex min-h-[650px] items-center justify-center rounded-[30px] border border-sky-100 bg-white">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-teal-600"
            />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              {t.loadingLessons}
            </p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout
      title={t.pageTitle}
      breadcrumb={t.breadcrumb}
    >
      <div className="min-h-screen rounded-[30px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-4 lg:p-5">
        {/* Compact hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-lg shadow-sky-100/60">
          <div className="grid items-stretch lg:grid-cols-[1.55fr_0.75fr]">
            <div className="px-6 py-7 lg:px-9">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-cyan-700">
                <GraduationCap size={16} />
                {t.learningCentre}
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 lg:text-4xl">
                {t.heroTitle}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {t.heroText}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
                  <BookOpen size={14} />
                  {progress.totalLessons} {t.topics}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
                  <Sparkles size={14} />
                  {t.oneAtATime}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
                  <Trophy size={14} />
                  {t.mongodbProgress}
                </span>
              </div>
            </div>

            <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 to-teal-500 p-6 text-white">
              <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border border-white/20" />

              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-lg">
                  <GraduationCap size={34} />
                </div>

                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                  {t.currentLesson}
                </p>

                <h3 className="mt-1 max-w-xs text-xl font-extrabold">
                  {selectedLesson?.title ||
                    t.selectLesson}
                </h3>

                <p className="mt-1 text-xs text-cyan-50">
                  {currentQuestionCount} {t.questions} ·{" "}
                  {selectedLesson?.duration ||
                    t.shortLesson}
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-700">
            <AlertCircle size={18} />
            <span className="flex-1">
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-red-100"
              aria-label={t.closeError}
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.72fr_1.5fr_0.78fr]">
          {/* Compact lesson library */}
          <aside className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-100 xl:max-h-[calc(100vh-190px)] xl:overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                  {t.learningLibrary}
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-800">
                  {t.lessons}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <BookOpen size={22} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {lessons.map((rawLesson) => {
                const lesson =
                  localizeLesson(
                    rawLesson,
                    languageCode
                  );

                const active =
                  lesson.id ===
                  selectedLessonId;

                const passed =
                  lesson.progress?.passed;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() =>
                      setSelectedLessonId(
                        lesson.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
                      active
                        ? "border-teal-300 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                        active
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {lesson.number}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-700">
                        {lesson.title}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {lesson.questions.length} {t.questions}
                        {lesson.progress?.attempts
                          ? ` · ${lesson.progress.attempts} ${
                              lesson.progress.attempts === 1
                                ? t.attempt
                                : t.attempts
                            }`
                          : ""}
                      </p>
                    </div>

                    {passed ? (
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-500"
                      />
                    ) : (
                      <ChevronRight
                        size={17}
                        className="shrink-0 text-slate-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Lesson and one-question quiz */}
          <main className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-100 lg:p-6">
            {selectedLesson && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                      {selectedLesson.category} {t.lesson}
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-slate-800">
                      {selectedLesson.title}
                    </h3>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                      {selectedLesson.description}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-500">
                    <Clock3 size={14} />
                    {selectedLesson.duration}
                  </span>
                </div>

                {/* Collapsible learning points */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50">
                  <button
                    type="button"
                    onClick={() =>
                      setLearningPointsOpen(
                        (current) =>
                          !current
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                      <BookOpen
                        size={18}
                        className="text-teal-600"
                      />
                      {t.keyPoints}
                    </span>

                    {learningPointsOpen ? (
                      <ChevronUp
                        size={18}
                        className="text-slate-500"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="text-slate-500"
                      />
                    )}
                  </button>

                  {learningPointsOpen && (
                    <div className="border-t border-sky-100 px-5 py-4">
                      <div className="space-y-2.5">
                        {selectedLesson.lessonContent.map(
                          (point) => (
                            <div
                              key={point}
                              className="flex gap-3 text-sm leading-6 text-slate-600"
                            >
                              <CheckCircle2
                                size={17}
                                className="mt-1 shrink-0 text-teal-500"
                              />
                              {point}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quiz header */}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700">
                      {t.knowledgeQuiz}
                    </p>

                    <h4 className="mt-1 text-lg font-black text-slate-800">
                      {t.question}{" "}
                      {currentQuestionIndex + 1}{" "}
                      {t.of}{" "}
                      {currentQuestionCount}
                    </h4>
                  </div>

                  <span className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-extrabold text-sky-700">
                    {answeredCount}/
                    {currentQuestionCount}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                    style={{
                      width: `${localQuizProgress}%`,
                    }}
                  />
                </div>

                {/* Current question */}
                {currentQuestion && (
                  <article className="mt-5 rounded-3xl border border-slate-200 p-5 lg:p-6">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 font-black text-teal-700">
                        {currentQuestionIndex + 1}
                      </div>

                      <h5 className="pt-1 text-base font-extrabold leading-7 text-slate-700">
                        {currentQuestion.question}
                      </h5>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {currentQuestion.options.map(
                        (
                          option,
                          optionIndex
                        ) => {
                          const selected =
                            currentSelectedAnswer ===
                            optionIndex;

                          const correctAfterSubmission =
                            currentFeedback &&
                            currentFeedback.correctAnswer ===
                              optionIndex;

                          const incorrectSelection =
                            currentFeedback &&
                            selected &&
                            !currentFeedback.isCorrect;

                          return (
                            <button
                              key={`${currentQuestion.id}-${optionIndex}`}
                              type="button"
                              disabled={Boolean(result)}
                              onClick={() =>
                                chooseAnswer(
                                  currentQuestion.id,
                                  optionIndex
                                )
                              }
                              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition ${
                                correctAfterSubmission
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                  : incorrectSelection
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : selected
                                      ? "border-teal-400 bg-teal-50 text-teal-800"
                                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
                              }`}
                            >
                              {correctAfterSubmission ? (
                                <CheckCircle2
                                  size={19}
                                />
                              ) : incorrectSelection ? (
                                <XCircle size={19} />
                              ) : selected ? (
                                <CheckCircle2
                                  size={19}
                                />
                              ) : (
                                <Circle size={19} />
                              )}

                              <span>
                                {option}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {currentFeedback && (
                      <div
                        className={`mt-4 rounded-2xl border px-4 py-4 text-sm leading-6 ${
                          currentFeedback.isCorrect
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        <strong className="block">
                          {currentFeedback.isCorrect
                            ? t.correctAnswer
                            : `${t.correctAnswer}: ${localizedCorrectAnswerText}`}
                        </strong>

                        {
                          localizedFeedbackExplanation
                        }
                      </div>
                    )}
                  </article>
                )}

                {/* Navigation */}
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousQuestion}
                    disabled={isFirstQuestion}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    {t.previous}
                  </button>

                  {!result &&
                    !isLastQuestion && (
                      <button
                        type="button"
                        onClick={goToNextQuestion}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-teal-100 transition hover:-translate-y-0.5"
                      >
                        {t.nextQuestion}
                        <ChevronRight
                          size={18}
                        />
                      </button>
                    )}

                  {!result &&
                    isLastQuestion && (
                      <button
                        type="button"
                        onClick={submitQuiz}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-teal-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <LoaderCircle
                              size={18}
                              className="animate-spin"
                            />
                            {t.calculating}
                          </>
                        ) : (
                          <>
                            <Award size={18} />
                            {t.submitQuiz}
                          </>
                        )}
                      </button>
                    )}

                  {result &&
                    !isLastQuestion && (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            (current) =>
                              Math.min(
                                current + 1,
                                currentQuestionCount -
                                  1
                              )
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-slate-700"
                      >
                        {t.reviewNext}
                        <ChevronRight
                          size={18}
                        />
                      </button>
                    )}

                  {result &&
                    isLastQuestion && (
                      <button
                        type="button"
                        onClick={tryAgain}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-300 bg-teal-50 px-6 py-3 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100"
                      >
                        <RefreshCw size={18} />
                        {t.tryAgain}
                      </button>
                    )}
                </div>
              </>
            )}
          </main>

          {/* Sticky progress panel */}
          <aside className="h-fit rounded-[26px] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-100 xl:sticky xl:top-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                  {t.yourPerformance}
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-800">
                  {t.progress}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Award size={23} />
              </div>
            </div>

            <div className="relative mx-auto mt-5 flex h-40 w-40 items-center justify-center rounded-full bg-slate-100">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#0f9f95 ${
                    progress.overallProgress *
                    3.6
                  }deg, #e8eef2 0deg)`,
                }}
              />

              <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <strong className="text-3xl font-black text-slate-800">
                  {progress.overallProgress}%
                </strong>

                <span className="mt-0.5 text-[10px] text-slate-400">
                  {t.completed}
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              {progress.completedLessons} {t.of}{" "}
              {progress.totalLessons}{" "}
              {t.lessonsPassed}
            </p>

            <div className="mt-5 grid gap-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {t.completedLabel}
                </span>

                <strong className="text-lg text-slate-800">
                  {progress.completedLessons}/
                  {progress.totalLessons}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {t.attempted}
                </span>

                <strong className="text-lg text-slate-800">
                  {progress.attemptedLessons}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {t.quizAttempts}
                </span>

                <strong className="text-lg text-slate-800">
                  {progress.totalQuizAttempts}
                </strong>
              </div>
            </div>

            {result && (
              <div
                className={`mt-4 rounded-2xl border p-4 text-center ${
                  result.passed
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <Trophy
                  size={28}
                  className={`mx-auto ${
                    result.passed
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                />

                <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.latestScore}
                </p>

                <strong className="mt-0.5 block text-3xl font-black text-slate-800">
                  {result.scorePercentage}%
                </strong>
              </div>
            )}
          </aside>
        </div>

        {/* Result modal */}
        {showResultModal &&
          result && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
              <div className="relative w-full max-w-md rounded-[30px] border border-white/60 bg-white p-7 text-center shadow-2xl">
                <button
                  type="button"
                  onClick={() =>
                    setShowResultModal(
                      false
                    )
                  }
                  className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={t.closeResult}
                >
                  <X size={19} />
                </button>

                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] ${
                    result.passed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <Trophy size={39} />
                </div>

                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">
                  {t.quizCompleted}
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-800">
                  {result.passed
                    ? t.wellDone
                    : t.goodAttempt}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {result.passed
                    ? t.passedMessage
                    : t.retryMessage}
                </p>

                <strong className="mt-5 block text-6xl font-black text-slate-800">
                  {result.scorePercentage}%
                </strong>

                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {result.correctAnswers} {t.of}{" "}
                  {result.totalQuestions} {t.correct}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={tryAgain}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-300 bg-teal-50 px-4 py-3 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100"
                  >
                    <RefreshCw size={17} />
                    {t.tryAgain}
                  </button>

                  <button
                    type="button"
                    onClick={
                      continueAfterResult
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-teal-100 transition hover:-translate-y-0.5"
                  >
                    {t.reviewAnswers}
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </PatientLayout>
  );
}