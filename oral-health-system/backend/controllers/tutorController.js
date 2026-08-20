const QuizResult = require(
  "../models/QuizResult"
);

const tutorLessons = require(
  "../data/tutorLessons"
);

const getUserId = (req) =>
  req.user?._id || req.user?.id;

const createLessonForPatient = (
  lesson
) => ({
  id: lesson.id,
  number: lesson.number,
  title: lesson.title,
  category: lesson.category,
  duration: lesson.duration,
  description: lesson.description,
  lessonContent:
    lesson.lessonContent,

  // Multilingual lesson content for the frontend.
  // If translations are not available yet, an empty object is returned.
  translations:
    lesson.translations || {},

  // Do not send correctAnswer to the frontend.
  // Quiz scoring continues to use the original lesson.questions
  // inside this controller.
  questions: lesson.questions.map(
    (question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
    })
  ),
});

/*
 * GET /api/tutor/lessons
 */
exports.getLessons = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const completedResults =
      await QuizResult.aggregate([
        {
          $match: {
            user:
              new (
                require("mongoose")
              ).Types.ObjectId(userId),
          },
        },
        {
          $sort: {
            scorePercentage: -1,
            completedAt: -1,
          },
        },
        {
          $group: {
            _id: "$lessonId",
            bestScore: {
              $first:
                "$scorePercentage",
            },
            passed: {
              $max: "$passed",
            },
            attempts: {
              $sum: 1,
            },
          },
        },
      ]);

    const progressMap =
      completedResults.reduce(
        (result, item) => {
          result[item._id] = {
            bestScore:
              item.bestScore,
            passed: Boolean(
              item.passed
            ),
            attempts:
              item.attempts,
          };

          return result;
        },
        {}
      );

    const lessons = tutorLessons.map(
      (lesson) => ({
        ...createLessonForPatient(
          lesson
        ),

        progress:
          progressMap[lesson.id] || {
            bestScore: 0,
            passed: false,
            attempts: 0,
          },
      })
    );

    return res.status(200).json({
      success: true,
      totalLessons: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error(
      "Get tutor lessons error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load tutor lessons.",
    });
  }
};

/*
 * GET /api/tutor/lessons/:lessonId
 */
exports.getLesson = async (
  req,
  res
) => {
  try {
    const lesson =
      tutorLessons.find(
        (item) =>
          item.id ===
          req.params.lessonId
      );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message:
          "Tutor lesson was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      lesson:
        createLessonForPatient(
          lesson
        ),
    });
  } catch (error) {
    console.error(
      "Get tutor lesson error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load the lesson.",
    });
  }
};

/*
 * POST /api/tutor/lessons/:lessonId/submit
 */
exports.submitQuiz = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const lesson =
      tutorLessons.find(
        (item) =>
          item.id ===
          req.params.lessonId
      );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message:
          "Tutor lesson was not found.",
      });
    }

    const submittedAnswers =
      req.body?.answers;

    if (
      !Array.isArray(
        submittedAnswers
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quiz answers must be provided.",
      });
    }

    const answerMap =
      submittedAnswers.reduce(
        (result, answer) => {
          result[answer.questionId] =
            Number(
              answer.selectedAnswer
            );

          return result;
        },
        {}
      );

    const feedback =
      lesson.questions.map(
        (question) => {
          const selectedAnswer =
            answerMap[question.id];

          const answered =
            Number.isInteger(
              selectedAnswer
            );

          const isCorrect =
            answered &&
            selectedAnswer ===
              question.correctAnswer;

          return {
            questionId:
              question.id,

            question:
              question.question,

            selectedAnswer:
              answered
                ? selectedAnswer
                : null,

            selectedAnswerText:
              answered
                ? question.options[
                    selectedAnswer
                  ] || ""
                : "Not answered",

            correctAnswer:
              question.correctAnswer,

            correctAnswerText:
              question.options[
                question
                  .correctAnswer
              ],

            isCorrect,

            explanation:
              question.explanation,
          };
        }
      );

    const correctAnswers =
      feedback.filter(
        (item) => item.isCorrect
      ).length;

    const totalQuestions =
      lesson.questions.length;

    const scorePercentage =
      Math.round(
        (correctAnswers /
          totalQuestions) *
          100
      );

    const passed =
      scorePercentage >= 60;

    const previousAttempts =
      await QuizResult.countDocuments({
        user: userId,
        lessonId: lesson.id,
      });

    const savedResult =
      await QuizResult.create({
        user: userId,
        lessonId: lesson.id,
        lessonTitle: lesson.title,

        answers: feedback.map(
          (item) => ({
            questionId:
              item.questionId,

            selectedAnswer:
              item.selectedAnswer ??
              -1,

            correctAnswer:
              item.correctAnswer,

            isCorrect:
              item.isCorrect,
          })
        ),

        correctAnswers,
        totalQuestions,
        scorePercentage,
        passed,
        attemptNumber:
          previousAttempts + 1,
        completedAt:
          new Date(),
      });

    return res.status(201).json({
      success: true,
      message: passed
        ? "Quiz completed successfully."
        : "Quiz completed. Review the feedback and try again.",

      result: {
        _id: savedResult._id,
        lessonId: lesson.id,
        lessonTitle:
          lesson.title,
        correctAnswers,
        totalQuestions,
        scorePercentage,
        passed,
        attemptNumber:
          savedResult.attemptNumber,
        completedAt:
          savedResult.completedAt,
        feedback,
      },
    });
  } catch (error) {
    console.error(
      "Submit tutor quiz error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit the quiz.",
    });
  }
};

/*
 * GET /api/tutor/progress
 */
exports.getMyProgress = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const results =
      await QuizResult.find({
        user: userId,
      })
        .sort({
          completedAt: -1,
        })
        .lean();

    const progressByLesson = {};

    results.forEach((result) => {
      if (
        !progressByLesson[
          result.lessonId
        ]
      ) {
        progressByLesson[
          result.lessonId
        ] = {
          lessonId:
            result.lessonId,
          lessonTitle:
            result.lessonTitle,
          attempts: 0,
          bestScore: 0,
          passed: false,
          latestCompletedAt:
            result.completedAt,
        };
      }

      const item =
        progressByLesson[
          result.lessonId
        ];

      item.attempts += 1;

      item.bestScore = Math.max(
        item.bestScore,
        result.scorePercentage
      );

      item.passed =
        item.passed ||
        result.passed;
    });

    const lessonProgress =
      Object.values(
        progressByLesson
      );

    const completedLessons =
      lessonProgress.filter(
        (item) => item.passed
      ).length;

    const totalLessons =
      tutorLessons.length;

    const overallProgress =
      totalLessons > 0
        ? Math.round(
            (completedLessons /
              totalLessons) *
              100
          )
        : 0;

    return res.status(200).json({
      success: true,

      summary: {
        totalLessons,
        attemptedLessons:
          lessonProgress.length,
        completedLessons,
        totalQuizAttempts:
          results.length,
        overallProgress,
      },

      lessons: lessonProgress,

      recentResults: results
        .slice(0, 5)
        .map((result) => ({
          _id: result._id,
          lessonId:
            result.lessonId,
          lessonTitle:
            result.lessonTitle,
          scorePercentage:
            result.scorePercentage,
          passed: result.passed,
          attemptNumber:
            result.attemptNumber,
          completedAt:
            result.completedAt,
        })),
    });
  } catch (error) {
    console.error(
      "Get tutor progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load tutor progress.",
    });
  }
};

/*
 * GET /api/tutor/dashboard-summary
 */
exports.getDashboardSummary =
  async (req, res) => {
    try {
      const userId =
        getUserId(req);

      const passedLessons =
        await QuizResult.distinct(
          "lessonId",
          {
            user: userId,
            passed: true,
          }
        );

      const totalAttempts =
        await QuizResult.countDocuments(
          {
            user: userId,
          }
        );

      return res.status(200).json({
        success: true,

        summary: {
          quizzesCompleted:
            passedLessons.length,

          totalQuizAttempts:
            totalAttempts,

          totalLessons:
            tutorLessons.length,
        },
      });
    } catch (error) {
      console.error(
        "Tutor dashboard summary error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load tutor dashboard statistics.",
      });
    }
  };