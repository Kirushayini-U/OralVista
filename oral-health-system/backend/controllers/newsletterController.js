const mongoose = require("mongoose");

const Newsletter = require(
  "../models/Newsletter"
);

const User = require("../models/User");

const {
  sendNewsletterBatch,
} = require(
  "../services/sendGridService"
);

/* =====================================================
   HELPER FUNCTIONS
===================================================== */

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const getValidationMessage = (error) => {
  if (
    error?.name === "ValidationError"
  ) {
    return (
      Object.values(
        error.errors || {}
      )[0]?.message ||
      "Newsletter validation failed."
    );
  }

  return null;
};

/* =====================================================
   ADMIN: CREATE NEWSLETTER
===================================================== */

const createNewsletter = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      subject,
      summary = "",
      content,
    } = req.body;

    if (
      !title?.trim() ||
      !subject?.trim() ||
      !content?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subject and content are required.",
      });
    }

    const newsletter =
      await Newsletter.create({
        title: title.trim(),
        subject: subject.trim(),
        summary: summary.trim(),
        content: content.trim(),
        status: "draft",
        createdBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Newsletter draft created.",
      newsletter,
    });
  } catch (error) {
    const validationMessage =
      getValidationMessage(error);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return next(error);
  }
};

/* =====================================================
   ADMIN: GET ALL NEWSLETTERS
===================================================== */

const getAdminNewsletters = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      search = "",
    } = req.query;

    const filter = {};

    if (
      status &&
      [
        "draft",
        "published",
        "sent",
      ].includes(status)
    ) {
      filter.status = status;
    }

    if (search.trim()) {
      const searchText =
        search.trim();

      filter.$or = [
        {
          title: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          summary: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    const [
      newsletters,
      total,
      draft,
      published,
      sent,
    ] = await Promise.all([
      Newsletter.find(filter)
        .sort({
          createdAt: -1,
        })
        .lean(),

      Newsletter.countDocuments(),

      Newsletter.countDocuments({
        status: "draft",
      }),

      Newsletter.countDocuments({
        status: "published",
      }),

      Newsletter.countDocuments({
        status: "sent",
      }),
    ]);

    return res.status(200).json({
      success: true,
      newsletters,
      statistics: {
        total,
        draft,
        published,
        sent,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/* =====================================================
   ADMIN: GET ONE NEWSLETTER
===================================================== */

const getNewsletterById = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The newsletter ID is invalid.",
      });
    }

    const newsletter =
      await Newsletter.findById(
        req.params.id
      );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message:
          "Newsletter was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      newsletter,
    });
  } catch (error) {
    return next(error);
  }
};

/* =====================================================
   ADMIN: UPDATE NEWSLETTER
===================================================== */

const updateNewsletter = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The newsletter ID is invalid.",
      });
    }

    const {
      title,
      subject,
      summary,
      content,
    } = req.body;

    const newsletter =
      await Newsletter.findById(
        req.params.id
      );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message:
          "Newsletter was not found.",
      });
    }

    if (
      newsletter.status === "sent"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A sent newsletter cannot be edited.",
      });
    }

    if (
      title !== undefined
    ) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Newsletter title cannot be empty.",
        });
      }

      newsletter.title =
        title.trim();
    }

    if (
      subject !== undefined
    ) {
      if (!subject.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Email subject cannot be empty.",
        });
      }

      newsletter.subject =
        subject.trim();
    }

    if (
      summary !== undefined
    ) {
      newsletter.summary =
        summary.trim();
    }

    if (
      content !== undefined
    ) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Newsletter content cannot be empty.",
        });
      }

      newsletter.content =
        content.trim();
    }

    await newsletter.save();

    return res.status(200).json({
      success: true,
      message:
        "Newsletter updated successfully.",
      newsletter,
    });
  } catch (error) {
    const validationMessage =
      getValidationMessage(error);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return next(error);
  }
};

/* =====================================================
   ADMIN: DELETE NEWSLETTER
===================================================== */

const deleteNewsletter = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The newsletter ID is invalid.",
      });
    }

    const newsletter =
      await Newsletter.findById(
        req.params.id
      );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message:
          "Newsletter was not found.",
      });
    }

    await newsletter.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Newsletter deleted successfully.",
      deletedNewsletterId:
        newsletter._id,
    });
  } catch (error) {
    return next(error);
  }
};

/* =====================================================
   ADMIN: PUBLISH NEWSLETTER
===================================================== */

const publishNewsletter = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The newsletter ID is invalid.",
      });
    }

    const newsletter =
      await Newsletter.findById(
        req.params.id
      );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message:
          "Newsletter was not found.",
      });
    }

    if (
      newsletter.status === "sent"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This newsletter has already been sent.",
      });
    }

    newsletter.status =
      "published";

    newsletter.publishedAt =
      new Date();

    await newsletter.save();

    return res.status(200).json({
      success: true,
      message:
        "Newsletter published and visible to patients.",
      newsletter,
    });
  } catch (error) {
    return next(error);
  }
};

/* =====================================================
   ADMIN: SEND TO SUBSCRIBED PATIENTS
===================================================== */

const sendNewsletter = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The newsletter ID is invalid.",
      });
    }

    const newsletter =
      await Newsletter.findById(
        req.params.id
      );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message:
          "Newsletter was not found.",
      });
    }

    if (
      newsletter.status === "sent"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This newsletter has already been sent.",
      });
    }

    if (
      newsletter.status !==
      "published"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Publish the newsletter before sending it.",
      });
    }

    const recipients =
      await User.find({
        role: "patient",
        isActive: {
          $ne: false,
        },
        newsletterSubscribed: true,
      })
        .select(
          "email fullName"
        )
        .lean();

    if (
      recipients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "There are no subscribed patients.",
      });
    }

    const result =
      await sendNewsletterBatch({
        recipients,
        newsletter: {
          title:
            newsletter.title,
          subject:
            newsletter.subject,
          summary:
            newsletter.summary,
          content:
            newsletter.content,
        },
      });

    newsletter.status = "sent";
    newsletter.sentAt =
      new Date();

    newsletter.recipientCount =
      Number(result.sentCount) || 0;

    newsletter.failedRecipientCount =
      Number(result.failedCount) || 0;

    await newsletter.save();

    return res.status(200).json({
      success: true,
      message: `Newsletter sent to ${newsletter.recipientCount} subscribed patient(s).`,
      newsletter,
    });
  } catch (error) {
    return next(error);
  }
};

/* =====================================================
   PATIENT: GET PUBLISHED NEWSLETTERS
===================================================== */

const getPublishedNewsletters =
  async (req, res, next) => {
    try {
      const newsletters =
        await Newsletter.find({
          status: {
            $in: [
              "published",
              "sent",
            ],
          },
        })
          .select(
            "title subject summary content status publishedAt sentAt createdAt"
          )
          .sort({
            publishedAt: -1,
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        newsletters,
      });
    } catch (error) {
      return next(error);
    }
  };

/* =====================================================
   PATIENT: GET SUBSCRIPTION STATUS
===================================================== */

const getSubscriptionStatus =
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select(
          "email newsletterSubscribed"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User account was not found.",
        });
      }

      return res.status(200).json({
        success: true,
        subscription: {
          email: user.email,
          subscribed:
            Boolean(
              user.newsletterSubscribed
            ),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

/* =====================================================
   PATIENT: UPDATE SUBSCRIPTION STATUS
===================================================== */

const updateSubscriptionStatus =
  async (req, res, next) => {
    try {
      if (
        typeof req.body.subscribed !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The subscribed value must be true or false.",
        });
      }

      const subscribed =
        req.body.subscribed;

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            newsletterSubscribed:
              subscribed,
          },
          {
            new: true,
            runValidators: true,
          }
        ).select(
          "email newsletterSubscribed"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User account was not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: subscribed
          ? "Newsletter subscription activated."
          : "Newsletter subscription cancelled.",
        subscription: {
          email: user.email,
          subscribed:
            Boolean(
              user.newsletterSubscribed
            ),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

/* =====================================================
   EXPORT CONTROLLERS
===================================================== */

module.exports = {
  createNewsletter,
  getAdminNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
  publishNewsletter,
  sendNewsletter,
  getPublishedNewsletters,
  getSubscriptionStatus,
  updateSubscriptionStatus,
};