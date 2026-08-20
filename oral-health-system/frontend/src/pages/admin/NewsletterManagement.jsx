import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  LoaderCircle,
  Mail,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import "./NewsletterManagement.css";

import {
  createNewsletter,
  deleteNewsletter,
  getAdminNewsletters,
  publishNewsletter,
  sendNewsletter,
  updateNewsletter,
} from "../../services/newsletterService.js";

const emptyForm = {
  title: "",
  subject: "",
  summary: "",
  content: "",
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const normalizeStatus = (status) =>
  String(status || "draft").toLowerCase();

export default function NewsletterManagement() {
  const [newsletters, setNewsletters] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    sent: 0,
    draft: 0,
    published: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingNewsletter, setEditingNewsletter] =
    useState(null);
  const [viewNewsletter, setViewNewsletter] =
    useState(null);
  const [
    deletingNewsletter,
    setDeletingNewsletter,
  ] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadNewsletters = async () => {
    try {
      setLoading(true);

      const response =
        await getAdminNewsletters();

      const items =
        response?.newsletters || [];

      setNewsletters(items);

      const fallbackStatistics = {
        total: items.length,
        sent: items.filter(
          (item) =>
            normalizeStatus(item.status) === "sent"
        ).length,
        draft: items.filter(
          (item) =>
            normalizeStatus(item.status) === "draft"
        ).length,
        published: items.filter(
          (item) =>
            normalizeStatus(item.status) ===
            "published"
        ).length,
      };

      setStatistics({
        total:
          response?.statistics?.total ??
          fallbackStatistics.total,
        sent:
          response?.statistics?.sent ??
          fallbackStatistics.sent,
        draft:
          response?.statistics?.draft ??
          fallbackStatistics.draft,
        published:
          response?.statistics?.published ??
          fallbackStatistics.published,
      });
    } catch (error) {
      console.error(
        "Unable to load newsletters:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to load newsletter campaigns.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsletters();
  }, []);

  const filteredNewsletters = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    return newsletters.filter(
      (newsletter) => {
        const matchesSearch =
          !query ||
          newsletter.title
            ?.toLowerCase()
            .includes(query) ||
          newsletter.subject
            ?.toLowerCase()
            .includes(query) ||
          newsletter.summary
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          normalizeStatus(
            newsletter.status
          ) === statusFilter;

        return matchesSearch && matchesStatus;
      }
    );
  }, [
    newsletters,
    searchTerm,
    statusFilter,
  ]);

  const openCreateModal = () => {
    setEditingNewsletter(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMessage({
      type: "",
      text: "",
    });
  };

  const openEditModal = (newsletter) => {
    setEditingNewsletter(newsletter);

    setForm({
      title: newsletter.title || "",
      subject: newsletter.subject || "",
      summary: newsletter.summary || "",
      content: newsletter.content || "",
    });

    setFormOpen(true);
    setMessage({
      type: "",
      text: "",
    });
  };

  const closeFormModal = () => {
    if (workingId) {
      return;
    }

    setFormOpen(false);
    setEditingNewsletter(null);
    setForm(emptyForm);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.content.trim()
    ) {
      setMessage({
        type: "error",
        text:
          "Title, subject and content are required.",
      });
      return;
    }

    try {
      setWorkingId(
        editingNewsletter?._id || "create"
      );

      const payload = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
      };

      const response = editingNewsletter
        ? await updateNewsletter(
            editingNewsletter._id,
            payload
          )
        : await createNewsletter(payload);

      setMessage({
        type: "success",
        text:
          response?.message ||
          (editingNewsletter
            ? "Newsletter updated successfully."
            : "Newsletter draft created successfully."),
      });

      setFormOpen(false);
      setEditingNewsletter(null);
      setForm(emptyForm);

      await loadNewsletters();
    } catch (error) {
      console.error(
        "Save newsletter error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to save the newsletter.",
      });
    } finally {
      setWorkingId("");
    }
  };

  const handlePublish = async (newsletter) => {
    const confirmed = window.confirm(
      `Publish "${newsletter.title}"? It will become visible to patients.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setWorkingId(newsletter._id);

      const response =
        await publishNewsletter(
          newsletter._id
        );

      setMessage({
        type: "success",
        text:
          response?.message ||
          "Newsletter published successfully.",
      });

      await loadNewsletters();
    } catch (error) {
      console.error(
        "Publish newsletter error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to publish the newsletter.",
      });
    } finally {
      setWorkingId("");
    }
  };

  const handleSend = async (newsletter) => {
    const confirmed = window.confirm(
      `Send "${newsletter.title}" to all subscribed patients?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setWorkingId(newsletter._id);

      const response =
        await sendNewsletter(
          newsletter._id
        );

      setMessage({
        type: "success",
        text:
          response?.message ||
          "Newsletter sent successfully.",
      });

      await loadNewsletters();
    } catch (error) {
      console.error(
        "Send newsletter error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to send the newsletter.",
      });
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (newsletter) => {
    if (!newsletter?._id) {
      const errorMessage =
        "The newsletter ID is missing.";

      setDeleteError(errorMessage);
      setMessage({
        type: "error",
        text: errorMessage,
      });
      return;
    }

    try {
      setDeleteError("");
      setWorkingId(newsletter._id);

      const response =
        await deleteNewsletter(
          newsletter._id
        );

      /*
       * Remove the deleted record immediately so the
       * interface updates without waiting for another
       * complete page request.
       */
      setNewsletters((previous) =>
        previous.filter(
          (item) =>
            item._id !== newsletter._id
        )
      );

      setStatistics((previous) => {
        const status = normalizeStatus(
          newsletter.status
        );

        return {
          total: Math.max(
            0,
            previous.total - 1
          ),
          sent:
            status === "sent"
              ? Math.max(
                  0,
                  previous.sent - 1
                )
              : previous.sent,
          draft:
            status === "draft"
              ? Math.max(
                  0,
                  previous.draft - 1
                )
              : previous.draft,
          published:
            status === "published"
              ? Math.max(
                  0,
                  previous.published - 1
                )
              : previous.published,
        };
      });

      if (
        viewNewsletter?._id ===
        newsletter._id
      ) {
        setViewNewsletter(null);
      }

      setDeletingNewsletter(null);

      setMessage({
        type: "success",
        text:
          response?.message ||
          "Newsletter deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete newsletter failed:",
        error
      );

      console.error(
        "Delete API response:",
        error.response?.data
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unable to delete the newsletter.";

      setDeleteError(errorMessage);

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setWorkingId("");
    }
  };

  const statisticCards = [
    {
      label: "Total newsletters",
      value: statistics.total,
      description: "All created campaigns",
      icon: Mail,
      tone: "blue",
    },
    {
      label: "Sent",
      value: statistics.sent,
      description: "Completed campaigns",
      icon: Send,
      tone: "green",
    },
    {
      label: "Drafts",
      value: statistics.draft,
      description: "Campaigns in preparation",
      icon: FileText,
      tone: "slate",
    },
    {
      label: "Published",
      value: statistics.published,
      description: "Visible to patients",
      icon: CalendarClock,
      tone: "gold",
    },
  ];

  return (
    <AdminLayout
      title="Newsletter Management"
      subtitle="Create, publish and deliver patient newsletters"
    >
      <div className="nm-page">
        <section className="nm-hero">
          <div className="nm-hero-glow nm-hero-glow-one" />
          <div className="nm-hero-glow nm-hero-glow-two" />

          <div className="nm-hero-content">
            <div className="nm-hero-copy">
              <span className="nm-badge">
                <Sparkles size={16} />
                OralVista communication centre
              </span>

              <h2>
                Create meaningful oral-health
                campaigns
              </h2>

              <p>
                Prepare educational newsletters,
                publish useful patient content and
                deliver campaigns securely to
                subscribed OralVista patients.
              </p>

              <div className="nm-hero-tags">
                <span>
                  <Mail size={15} />
                  Patient communication
                </span>
                <span>
                  <Clock3 size={15} />
                  MongoDB delivery records
                </span>
                <span>
                  <Users size={15} />
                  Subscriber-only delivery
                </span>
              </div>
            </div>

            <button
              type="button"
              className="nm-create-button"
              onClick={openCreateModal}
            >
              <Plus size={22} />
              Create newsletter
            </button>
          </div>
        </section>

        {message.text && (
          <div
            className={`nm-message ${
              message.type === "success"
                ? "nm-message-success"
                : "nm-message-error"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <section className="nm-stats-grid">
          {statisticCards.map(
            (statistic) => {
              const Icon = statistic.icon;

              return (
                <article
                  key={statistic.label}
                  className="nm-stat-card"
                >
                  <div
                    className={`nm-stat-icon nm-stat-${statistic.tone}`}
                  >
                    <Icon size={25} />
                  </div>

                  <div>
                    <span>
                      {statistic.label}
                    </span>
                    <strong>
                      {statistic.value}
                    </strong>
                    <p>
                      {statistic.description}
                    </p>
                  </div>
                </article>
              );
            }
          )}
        </section>

        <section className="nm-library">
          <header className="nm-library-header">
            <div>
              <span className="nm-section-label">
                Campaign library
              </span>
              <h3>
                Newsletter campaigns
              </h3>
              <p>
                Search, review and manage your
                newsletter content.
              </p>
            </div>

            <div className="nm-tools">
              <div className="nm-search">
                <Search size={19} />
                <input
                  type="search"
                  value={searchTerm}
                  placeholder="Search newsletters..."
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All statuses
                </option>
                <option value="draft">
                  Draft
                </option>
                <option value="published">
                  Published
                </option>
                <option value="sent">
                  Sent
                </option>
              </select>
            </div>
          </header>

          {loading ? (
            <div className="nm-empty">
              <LoaderCircle
                size={42}
                className="nm-spinner"
              />
              <h4>
                Loading newsletters
              </h4>
              <p>
                Retrieving campaigns from MongoDB.
              </p>
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="nm-empty">
              <div className="nm-empty-icon">
                <Mail size={42} />
              </div>
              <h4>
                {newsletters.length === 0
                  ? "No newsletters created yet"
                  : "No matching newsletters"}
              </h4>
              <p>
                {newsletters.length === 0
                  ? "Create your first newsletter draft to start the campaign workflow."
                  : "Try another search term or status filter."}
              </p>

              {newsletters.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                >
                  <Plus size={18} />
                  Create first newsletter
                </button>
              )}
            </div>
          ) : (
            <div className="nm-card-grid">
              {filteredNewsletters.map(
                (newsletter) => {
                  const status =
                    normalizeStatus(
                      newsletter.status
                    );

                  const isWorking =
                    workingId ===
                    newsletter._id;

                  return (
                    <article
                      key={newsletter._id}
                      className="nm-card"
                    >
                      <div className="nm-card-top">
                        <div className="nm-card-icon">
                          <Mail size={23} />
                        </div>

                        <span
                          className={`nm-status nm-status-${status}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="nm-card-content">
                        <h4>
                          {newsletter.title}
                        </h4>

                        <p className="nm-subject">
                          {newsletter.subject}
                        </p>

                        <p className="nm-summary">
                          {newsletter.summary ||
                            "No summary was provided for this newsletter."}
                        </p>
                      </div>

                      <div className="nm-card-meta">
                        <div>
                          <span>Created</span>
                          <strong>
                            {formatDateTime(
                              newsletter.createdAt
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Recipients</span>
                          <strong>
                            {newsletter.recipientCount ||
                              0}{" "}
                            patient(s)
                          </strong>
                        </div>
                      </div>

                      {newsletter.sentAt && (
                        <div className="nm-sent-box">
                          <Send size={15} />
                          <span>
                            Sent on{" "}
                            {formatDateTime(
                              newsletter.sentAt
                            )}
                          </span>
                        </div>
                      )}

                      <div className="nm-card-actions">
                        <button
                          type="button"
                          className="nm-action-light"
                          onClick={() =>
                            setViewNewsletter(
                              newsletter
                            )
                          }
                        >
                          <Eye size={16} />
                          View
                        </button>

                        {status !== "sent" && (
                          <button
                            type="button"
                            className="nm-action-light"
                            onClick={() =>
                              openEditModal(
                                newsletter
                              )
                            }
                            disabled={isWorking}
                          >
                            <Edit3 size={16} />
                            Edit
                          </button>
                        )}

                        {status === "draft" && (
                          <button
                            type="button"
                            className="nm-action-primary"
                            onClick={() =>
                              handlePublish(
                                newsletter
                              )
                            }
                            disabled={isWorking}
                          >
                            {isWorking ? (
                              <LoaderCircle
                                size={16}
                                className="nm-spinner"
                              />
                            ) : (
                              <CheckCircle2
                                size={16}
                              />
                            )}
                            Publish
                          </button>
                        )}

                        {status === "published" && (
                          <button
                            type="button"
                            className="nm-action-primary"
                            onClick={() =>
                              handleSend(
                                newsletter
                              )
                            }
                            disabled={isWorking}
                          >
                            {isWorking ? (
                              <LoaderCircle
                                size={16}
                                className="nm-spinner"
                              />
                            ) : (
                              <Send size={16} />
                            )}
                            Send
                          </button>
                        )}

                        <button
                          type="button"
                          className="nm-action-delete"
                          onClick={() => {
                            setDeleteError("");
                            setDeletingNewsletter(
                              newsletter
                            );
                          }}
                          disabled={isWorking}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          <footer className="nm-library-footer">
            <span>
              Showing{" "}
              {filteredNewsletters.length} of{" "}
              {newsletters.length} newsletters
            </span>
            <span>
              SendGrid email service:
              <strong> Connected</strong>
            </span>
          </footer>
        </section>
      </div>

      {formOpen && (
        <div
          className="nm-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeFormModal();
            }
          }}
        >
          <section
            className="nm-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="nm-modal-header">
              <div>
                <span>
                  {editingNewsletter
                    ? "Update campaign"
                    : "New campaign"}
                </span>
                <h3>
                  {editingNewsletter
                    ? "Edit newsletter"
                    : "Create newsletter"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={Boolean(workingId)}
              >
                <X size={21} />
              </button>
            </header>

            <form
              className="nm-modal-form"
              onSubmit={handleSave}
            >
              <label>
                <span>Title</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  maxLength={150}
                  required
                />
              </label>

              <label>
                <span>Email subject</span>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleFormChange}
                  maxLength={180}
                  required
                />
              </label>

              <label className="nm-full-field">
                <span>Summary</span>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleFormChange}
                  rows={3}
                  maxLength={300}
                />
              </label>

              <label className="nm-full-field">
                <span>Newsletter content</span>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  rows={10}
                  required
                />
              </label>

              <div className="nm-modal-actions">
                <button
                  type="button"
                  className="nm-cancel-button"
                  onClick={closeFormModal}
                  disabled={Boolean(workingId)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="nm-save-button"
                  disabled={Boolean(workingId)}
                >
                  {workingId ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="nm-spinner"
                      />
                      Saving...
                    </>
                  ) : editingNewsletter ? (
                    "Save changes"
                  ) : (
                    "Create draft"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {viewNewsletter && (
        <div
          className="nm-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setViewNewsletter(null);
            }
          }}
        >
          <section
            className="nm-modal nm-preview-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="nm-modal-header">
              <div>
                <span>
                  Newsletter preview
                </span>
                <h3>
                  {viewNewsletter.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewNewsletter(null)
                }
              >
                <X size={21} />
              </button>
            </header>

            <div className="nm-preview-content">
              <div className="nm-preview-icon">
                <Mail size={36} />
              </div>

              <span
                className={`nm-status nm-status-${normalizeStatus(
                  viewNewsletter.status
                )}`}
              >
                {normalizeStatus(
                  viewNewsletter.status
                )}
              </span>

              <div className="nm-preview-box">
                <span>Email subject</span>
                <strong>
                  {viewNewsletter.subject}
                </strong>
              </div>

              {viewNewsletter.summary && (
                <div className="nm-preview-box">
                  <span>Summary</span>
                  <strong>
                    {viewNewsletter.summary}
                  </strong>
                </div>
              )}

              <div className="nm-preview-body">
                <p>
                  {viewNewsletter.content}
                </p>
              </div>

              <button
                type="button"
                className="nm-preview-close"
                onClick={() =>
                  setViewNewsletter(null)
                }
              >
                Close preview
              </button>
            </div>
          </section>
        </div>
      )}

      {deletingNewsletter && (
        <div
          className="nm-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !workingId
            ) {
              setDeleteError("");
              setDeletingNewsletter(null);
            }
          }}
        >
          <section
            className="nm-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete newsletter"
          >
            <div className="nm-delete-icon">
              <Trash2 size={31} />
            </div>

            <h3>Delete newsletter?</h3>

            <p>
              You are about to delete{" "}
              <strong>
                {deletingNewsletter.title}
              </strong>
              . This action cannot be undone.
            </p>

            {normalizeStatus(
              deletingNewsletter.status
            ) === "sent" && (
              <div className="nm-delete-warning">
                <AlertCircle size={17} />

                <span>
                  This newsletter has already
                  been sent. Deleting it will
                  also remove its MongoDB
                  delivery record.
                </span>
              </div>
            )}

            {deleteError && (
              <div className="nm-delete-error">
                <AlertCircle size={17} />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="nm-delete-actions">
              <button
                type="button"
                className="nm-delete-cancel"
                onClick={() => {
                  setDeleteError("");
                  setDeletingNewsletter(null);
                }}
                disabled={Boolean(workingId)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="nm-delete-confirm"
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  await handleDelete(
                    deletingNewsletter
                  );
                }}
                disabled={Boolean(workingId)}
              >
                {workingId ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="nm-spinner"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete newsletter
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}