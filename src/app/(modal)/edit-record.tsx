"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Save, X } from "lucide-react";
import { createClient } from "../supabase/client";
import styles from "./styles.module.css";

type EditableTable =
  | "incoming_correspondence"
  | "outgoing_correspondence"
  | "minutes"
  | "memo"
  | "monthly_report"
  | "quarterly_reports"
  | "annual_report";

interface EditableRecord {
  id: number;
  title: string;
  description: string;
}

interface Props {
  table: EditableTable;
  record: EditableRecord;
  recordType: string;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

export default function EditRecord({
  table,
  record,
  recordType,
  onClose,
  onUpdated,
}: Props) {
  const supabase = createClient();
  const [title, setTitle] = useState(record.title);
  const [description, setDescription] = useState(record.description);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const nextTitle = title.trim();
    const nextDescription = description.trim();

    if (!nextTitle || !nextDescription) {
      setErrorMessage("Title and description are required.");
      return;
    }

    setSaving(true);

    try {
      const { data: updated, error } = await supabase
        .from(table)
        .update({ title: nextTitle, description: nextDescription })
        .eq("id", record.id)
        .select("id")
        .maybeSingle();

      if (error || !updated) {
        setErrorMessage(
          error?.message ?? "You are not allowed to update this record.",
        );
        return;
      }

      await onUpdated();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update this record. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        className={styles.uploadModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-record-heading"
      >
        <header className={styles.modalHeader}>
          <div>
            <h2 id="edit-record-heading">Update {recordType}</h2>
            <p>Update the title and description for “{record.title}”.</p>
          </div>

          <button
            className={styles.modalCloseButton}
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close update dialog"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.editForm}>
          <label className={styles.editField}>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={saving}
              required
            />
          </label>

          <label className={styles.editField}>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving}
              rows={4}
              required
            />
          </label>

          {errorMessage && (
            <p className={styles.inlineError} role="alert">
              {errorMessage}
            </p>
          )}

          <div className={styles.modalActions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className={styles.uploadButton}
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle className={styles.spinner} size={16} />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
