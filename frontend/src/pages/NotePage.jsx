import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import debounce from "lodash/debounce";

import API from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RichTextEditor from "../components/RichTextEditor";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const socket = io("http://localhost:5000");

const NotePage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [note, setNote] = useState({
    title: "",
    content: "",
    ownerId: null
  });

  const [shareEmail, setShareEmail] =
    useState("");

  const [permission, setPermission] =
    useState("viewer");

  const [sharedUsers, setSharedUsers] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [savingStatus, setSavingStatus] =
    useState("All changes saved");

  const [toastMessages, setToastMessages] =
    useState([]);

  const [confirmRestore, setConfirmRestore] =
    useState(null);

  const [confirmRemove, setConfirmRemove] =
    useState(false);

  const [pendingRemove, setPendingRemove] =
    useState(null);

  // =========================
  // USER
  // =========================

  const currentUserId =
    localStorage.getItem("userId");

  const isOwner =
    note.ownerId === currentUserId;

  // =========================
  // TOAST
  // =========================

  const addToast = (
    title,
    message,
    variant = "success"
  ) => {

    const toastId =
      `${Date.now()}-${Math.random()}`;

    setToastMessages((prev) => [
      ...prev,
      {
        id: toastId,
        title,
        message,
        variant
      }
    ]);

    setTimeout(() => {

      setToastMessages((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== toastId
        )
      );

    }, 3000);
  };

  // =========================
  // FETCH NOTE
  // =========================

  const fetchNote = async () => {

    try {

      const res = await API.get(
        `/notes/${id}`
      );

      setNote(res.data);

    } catch (error) {

      addToast(
        "Error",
        "Failed to load note",
        "error"
      );
    }
  };

  // =========================
  // FETCH SHARED USERS
  // =========================

  const fetchSharedUsers = async () => {

    try {

      const res = await API.get(
        `/notes/${id}/shares`
      );

      setSharedUsers(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // FETCH HISTORY
  // =========================

  const fetchHistory = async () => {

    try {

      const res = await API.get(
        `/notes/${id}/history`
      );

      setHistory(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // SAVE NOTE
  // =========================

  const saveNote = async () => {

    try {

      if (id === "new") {

        const res = await API.post(
          "/notes",
          note
        );

        navigate(
          `/note/${res.data.id}`
        );

        return;
      }

      await API.put(
        `/notes/${id}`,
        note
      );

      socket.emit("edit-note", {
        noteId: id,
        ...note
      });

      setSavingStatus("Saved");

      addToast(
        "Saved",
        "Note updated successfully"
      );

      if (isOwner) {
        fetchHistory();
      }

    } catch (error) {

      setSavingStatus(
        "Save failed"
      );

      addToast(
        "Error",
        "Unable to save note",
        "error"
      );
    }
  };

  // =========================
  // AUTO SAVE
  // =========================

  const autoSave = debounce(
    async (updatedNote) => {

      try {

        await API.put(
          `/notes/${id}`,
          updatedNote
        );

        socket.emit(
          "edit-note",
          {
            noteId: id,
            ...updatedNote
          }
        );

        setSavingStatus(
          "Saved"
        );

        if (isOwner) {
          fetchHistory();
        }

      } catch (error) {

        setSavingStatus(
          "Save failed"
        );
      }

    },
    1000
  );

  // =========================
  // HANDLE EDITOR
  // =========================

  const handleEditorChange = (
    value
  ) => {

    const updatedNote = {
      ...note,
      content: value
    };

    setNote(updatedNote);

    if (id === "new") return;

    setSavingStatus("Saving...");

    autoSave(updatedNote);
  };

  // =========================
  // DELETE NOTE
  // =========================

  const deleteNote = async () => {

    const confirmDelete =
      window.confirm(
        "Delete this note?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/notes/${id}`
      );

      navigate("/dashboard");

    } catch (error) {

      addToast(
        "Error",
        "Delete failed",
        "error"
      );
    }
  };

  // =========================
  // SHARE NOTE
  // =========================

  const shareNote = async () => {

    try {

      await API.post(
        `/notes/${id}/share`,
        {
          share_with_email:
            shareEmail,
          permission
        }
      );

      setShareEmail("");

      fetchSharedUsers();

      addToast(
        "Success",
        "Note shared"
      );

    } catch (error) {

      addToast(
        "Error",
        error.response?.data?.message ||
        "Share failed",
        "error"
      );
    }
  };

  // =========================
  // UPDATE PERMISSION
  // =========================

  const updatePermission = async (
    shareId,
    newPermission
  ) => {

    try {

      await API.put(
        `/notes/${id}/shares/${shareId}`,
        {
          permission:
            newPermission
        }
      );

      fetchSharedUsers();

      addToast(
        "Updated",
        "Permission updated"
      );

    } catch (error) {

      addToast(
        "Error",
        "Update failed",
        "error"
      );
    }
  };

  // =========================
  // REMOVE USER
  // =========================

  const removeUser = async (
    shareId
  ) => {

    try {

      await API.delete(
        `/notes/${id}/shares/${shareId}`
      );

      fetchSharedUsers();

      addToast(
        "Removed",
        "Collaborator removed"
      );

    } catch (error) {

      addToast(
        "Error",
        "Remove failed",
        "error"
      );
    }
  };

  // =========================
  // RESTORE VERSION
  // =========================

  const restoreVersion = async (
    versionId
  ) => {

    try {

      await API.post(
        `/notes/${id}/restore/${versionId}`
      );

      fetchNote();

      fetchHistory();

      setConfirmRestore(null);

      addToast(
        "Restored",
        "Version restored"
      );

    } catch (error) {

      addToast(
        "Error",
        "Restore failed",
        "error"
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    if (id !== "new") {

      fetchNote();

      socket.emit(
        "join-note",
        id
      );

      socket.on(
        "receive-note",
        (data) => {

          setNote((prev) => ({
            ...prev,
            title: data.title,
            content: data.content
          }));
        }
      );
    }

    return () => {
      socket.off(
        "receive-note"
      );
    };

  }, [id]);

  // =========================
  // OWNER ONLY DATA
  // =========================

  useEffect(() => {

    if (
      isOwner &&
      id !== "new"
    ) {

      fetchSharedUsers();

      fetchHistory();
    }

  }, [isOwner, id]);

  // =========================
  // JSX
  // =========================

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="mx-auto flex max-w-7xl gap-6 p-6">

        <Sidebar />

        <main className="flex-1">

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

              <div>

                <h1 className="text-3xl font-bold">

                  {
                    note.title ||
                    "Untitled Note"
                  }

                </h1>

                <p className="text-gray-400 mt-1">

                  {savingStatus}

                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="bg-slate-800 px-4 py-2 rounded-xl cursor-pointer text-sm text-slate-200 hover:bg-slate-700"
              >
                Back
              </button>

            </div>

            {/* TITLE */}

            <input
              type="text"
              value={note.title}
              placeholder="Title"
              onChange={(e) =>
                setNote({
                  ...note,
                  title:
                    e.target.value
                })
              }
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-2xl font-bold outline-none mb-6"
            />

            {/* EDITOR */}

            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4">

              <RichTextEditor
                content={note.content}
                onChange={
                  handleEditorChange
                }
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-4 mt-6">

              <button
                onClick={saveNote}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-2xl cursor-pointer"
              >
                Save
              </button>

              {id !== "new" &&
                isOwner && (

                <button
                  onClick={
                    deleteNote
                  }
                  className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-2xl cursor-pointer"
                >
                  Delete
                </button>

              )}

            </div>

            {/* SHARE SECTION */}

            {id !== "new" &&
              isOwner && (

              <div className="mt-10 bg-slate-950 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-2xl font-bold mb-5">

                  Share Note

                </h2>

                <div className="flex gap-4">

                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) =>
                      setShareEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter email"
                    className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 outline-none"
                  />

                  <select
                    value={permission}
                    onChange={(e) =>
                      setPermission(
                        e.target.value
                      )
                    }
                    className="bg-slate-900 border border-slate-800 px-4 rounded-2xl cursor-pointer"
                  >
                    <option value="viewer">
                      Viewer
                    </option>

                    <option value="editor">
                      Editor
                    </option>

                  </select>

                  <button
                    onClick={shareNote}
                    className="bg-emerald-500 hover:bg-emerald-400 px-6 rounded-2xl text-black font-semibold cursor-pointer"
                  >
                    Share
                  </button>

                </div>

                {/* USERS */}

                <div className="mt-6 space-y-4">

                  {sharedUsers.map(
                    (share) => (

                    <div
                      key={share.id}
                      className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center"
                    >

                      <div>

                        <div className="font-semibold">

                          {
                            share.user.email
                          }

                        </div>

                        <div className="text-sm text-gray-400">

                          {
                            share.permission
                          }

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <select
                          value={
                            share.permission
                          }
                          onChange={(e) =>
                            updatePermission(
                              share.id,
                              e.target.value
                            )
                          }
                          className="bg-slate-800 px-3 rounded-xl cursor-pointer"
                        >
                          <option value="viewer">
                            Viewer
                          </option>

                          <option value="editor">
                            Editor
                          </option>

                        </select>

                        <button
                          onClick={() => {
                            setPendingRemove(
                              share
                            );

                            setConfirmRemove(
                              true
                            );
                          }}
                          className="bg-red-500 px-4 rounded-xl cursor-pointer hover:bg-red-400 text-sm text-white"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* VERSION HISTORY */}

            {id !== "new" &&
              isOwner && (

              <div className="mt-10 bg-slate-950 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-2xl font-bold mb-6">

                  Version History

                </h2>

                {history.length === 0 ? (

                  <div className="text-gray-400">

                    No versions yet

                  </div>

                ) : (

                  <div className="space-y-4">

                    {history.map(
                      (version) => (

                      <div
                        key={version.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4"
                      >

                        <div className="flex justify-between items-start">

                          <div>

                            <div className="font-bold">

                              {
                                version.title
                              }

                            </div>

                            <div className="text-sm text-gray-400 mt-1">

                              Edited by{" "}

                              {
                                version.editedBy
                                  ?.email
                              }

                            </div>

                            <div className="text-xs text-gray-500 mt-1">

                              {new Date(
                                version.createdAt
                              ).toLocaleString()}

                            </div>

                          </div>

                          <button
                            onClick={() =>
                              setConfirmRestore(
                                version
                              )
                            }
                            className="bg-cyan-500 px-4 py-2 rounded-xl text-black font-semibold cursor-pointer hover:bg-cyan-400 text-sm"
                          >
                            Restore
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

          </div>

        </main>

      </div>

      {/* TOAST */}

      <Toast
        toasts={toastMessages}
        onDismiss={(id) =>
          setToastMessages((prev) =>
            prev.filter(
              (toast) =>
                toast.id !== id
            )
          )
        }
      />

      {/* REMOVE MODAL */}

      <ConfirmModal
        open={
          confirmRemove
        }

        title="Remove collaborator"

        description={`Remove ${pendingRemove?.user?.email}?`}

        confirmLabel="Remove"

        cancelLabel="Cancel"

        onConfirm={() => {

          if (pendingRemove) {

            removeUser(
              pendingRemove.id
            );
          }

          setConfirmRemove(
            false
          );
        }}

        onCancel={() =>
          setConfirmRemove(
            false
          )
        }
      />

      {/* RESTORE MODAL */}

      <ConfirmModal
        open={Boolean(
          confirmRestore
        )}

        title="Restore version"

        description="Restore this version?"

        confirmLabel="Restore"

        cancelLabel="Cancel"

        onConfirm={() => {

          restoreVersion(
            confirmRestore.id
          );
        }}

        onCancel={() =>
          setConfirmRestore(
            null
          )
        }
      />

    </div>
  );
};

export default NotePage;