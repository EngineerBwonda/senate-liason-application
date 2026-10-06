"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, LoaderCircle, Upload, X } from "lucide-react";
import { createClient } from "../supabase/client";
import styles from "./styles.module.css";

const STORAGE_BUCKET = "outgoing_correspondence";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

interface Props {
  onClose: () => void;
  onUploaded: (id: number) => void | Promise<void>;
}

export default function OutgoingCorrespondenceUpload({
  onClose,
  onUploaded,
}: Props) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError("");

      if (!title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!description.trim()) {
        setError("Description is required.");
        return;
      }

      if (!file) {
        setError("Please choose a file to upload.");
        return;
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setError("Upload a PDF, Word document, or JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Files must be 20 MB or smaller.");
        return;
      }

      setSubmitting(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message ?? "You must be signed in to upload.");
        setSubmitting(false);
        return;
      }

      const safeFileName = file.name
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9._-]+/g, "-");

      const objectPath = `${user.id}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(objectPath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("outgoing_correspondence")
        .insert({
          title: title.trim(),
          description: description.trim(),
          file_url: objectPath,
          user_id: user.id,
          email: user.email ?? "",
        })
        .select("id")
        .maybeSingle();

      if (insertError || !inserted) {
        await supabase.storage.from(STORAGE_BUCKET).remove([objectPath]);

        setError(
          insertError?.message ??
            "Could not save the outgoing correspondence record.",
        );

        setSubmitting(false);
        return;
      }

      await onUploaded(inserted.id);
      setSubmitting(false);
      onClose();
    },
    [description, file, onClose, onUploaded, supabase, title],
  );

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <section
        className={styles.uploadModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="outgoing-correspondence-upload-heading"
      >
        <header className={styles.modalHeader}>
          <h2 id="outgoing-correspondence-upload-heading">
            Upload outgoing correspondence
          </h2>

          <button
            className={styles.modalCloseButton}
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close upload dialog"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <label>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={submitting}
              required
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={submitting}
              rows={4}
              required
            />
          </label>

          <label className={styles.fileDrop}>
            <FileText size={20} aria-hidden="true" />

            <span>{file ? file.name : "Choose a file (PDF, DOCX, image)"}</span>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              disabled={submitting}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {error && (
            <p className={styles.inlineError} role="alert">
              {error}
            </p>
          )}

          <button
            className={styles.uploadButton}
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <LoaderCircle className={styles.spinner} size={16} />
            ) : (
              <Upload size={16} aria-hidden="true" />
            )}
            Upload
          </button>
        </form>
      </section>
    </div>
  );
}
