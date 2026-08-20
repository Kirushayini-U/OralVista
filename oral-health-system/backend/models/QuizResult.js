const mongoose = require("mongoose");

const answerSchema =
  new mongoose.Schema(
    {
      questionId: {
        type: String,
        required: true,
      },

      selectedAnswer: {
        type: Number,
        required: true,
      },

      correctAnswer: {
        type: Number,
        required: true,
      },

      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

const quizResultSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      lessonId: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      lessonTitle: {
        type: String,
        required: true,
        trim: true,
      },

      answers: {
        type: [answerSchema],
        default: [],
      },

      correctAnswers: {
        type: Number,
        required: true,
        min: 0,
      },

      totalQuestions: {
        type: Number,
        required: true,
        min: 1,
      },

      scorePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      passed: {
        type: Boolean,
        required: true,
      },

      attemptNumber: {
        type: Number,
        required: true,
        min: 1,
      },

      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

quizResultSchema.index({
  user: 1,
  lessonId: 1,
  completedAt: -1,
});

module.exports = mongoose.model(
  "QuizResult",
  quizResultSchema
);