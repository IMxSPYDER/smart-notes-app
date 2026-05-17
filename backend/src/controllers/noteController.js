import prisma from "../lib/prisma.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        ownerId: req.user.userId
      }
    });

    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {

    const ownedNotes =
      await prisma.note.findMany({
        where: {
          ownerId: req.user.userId
        },
        orderBy: {
          updatedAt: "desc"
        }
      });

    const sharedNotes =
      await prisma.sharedNote.findMany({
        where: {
          userId: req.user.userId
        },
        include: {
          note: true
        }
      });

    const formattedOwned = ownedNotes.map(
  (note) => ({
    ...note,
    access: "owner"
  })
);

const formattedShared =
  sharedNotes.map((s) => ({
    ...s.note,
    access: s.permission
  }));

const notes = [
  ...formattedOwned,
  ...formattedShared
];

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: {
        id
      }
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    const shared = await prisma.sharedNote.findFirst({
      where: {
        noteId: id,
        userId: req.user.userId
      }
    });

    if (
      note.ownerId !== req.user.userId &&
      !shared
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    res.json(note);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content } = req.body;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    const sharedAccess =
  await prisma.sharedNote.findFirst({
    where: {
      noteId: id,
      userId: req.user.userId,
      permission: "editor"
    }
  });

if (
  note.ownerId !== req.user.userId &&
  !sharedAccess
) {
  return res.status(403).json({
    message: "Unauthorized"
  });
}

    await prisma.noteVersion.create({
  data: {
    noteId: note.id,
    title: note.title,
    content: note.content,
    editedById: req.user.userId
  }
});

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content
      }
    });

    res.json(updatedNote);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    if (note.ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.status(204).send();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const shareNote = async (req, res) => {
  try {
    const { id } = req.params;

    const { share_with_email, permission } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: share_with_email
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existing = await prisma.sharedNote.findFirst({
      where: {
        noteId: id,
        userId: user.id
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Already shared"
      });
    }

    await prisma.sharedNote.create({
      data: {
        noteId: id,
        userId: user.id,
        permission: permission || "viewer"
      }
    });

    res.json({
      message: "Note shared successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;

    const ownedNotes = await prisma.note.findMany({
      where: {
        ownerId: req.user.userId,
        OR: [
          {
            title: {
              contains: q
            }
          },
          {
            content: {
              contains: q
            }
          }
        ]
      }
    });

    const sharedNotes =
      await prisma.sharedNote.findMany({
        where: {
          userId: req.user.userId,
          note: {
            OR: [
              {
                title: {
                  contains: q
                }
              },
              {
                content: {
                  contains: q
                }
              }
            ]
          }
        },
        include: {
          note: true
        }
      });

    const notes = [
      ...ownedNotes,
      ...sharedNotes.map((s) => s.note)
    ];

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSharedUsers = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    if (
      note.ownerId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const sharedUsers =
      await prisma.sharedNote.findMany({
        where: {
          noteId: id
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });

    res.json(sharedUsers);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updatePermission = async (
  req,
  res
) => {
  try {

    const { id, shareId } = req.params;

    const { permission } = req.body;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (
      note.ownerId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const updated =
      await prisma.sharedNote.update({
        where: {
          id: shareId
        },
        data: {
          permission
        }
      });

    res.json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const removeSharedUser = async (
  req,
  res
) => {
  try {

    const { id, shareId } = req.params;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (
      note.ownerId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await prisma.sharedNote.delete({
      where: {
        id: shareId
      }
    });

    res.json({
      message: "Access removed"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getNoteHistory = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    // OWNER ONLY

    if (
      note.ownerId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const history =
      await prisma.noteVersion.findMany({
        where: {
          noteId: id
        },

        include: {
          editedBy: {
            select: {
              email: true
            }
          }
        },

        orderBy: {
          createdAt: "desc"
        }
      });

    res.json(history);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const restoreVersion = async (
  req,
  res
) => {
  try {

    const { id, versionId } =
      req.params;

    // FIND NOTE

    const note =
      await prisma.note.findUnique({
        where: { id }
      });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    // OWNER ONLY

    if (
      note.ownerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // FIND VERSION

    const version =
      await prisma.noteVersion.findUnique({
        where: {
          id: versionId
        }
      });

    if (!version) {
      return res.status(404).json({
        message: "Version not found"
      });
    }

    // SAVE CURRENT STATE
    // BEFORE RESTORING

    await prisma.noteVersion.create({
      data: {
        noteId: note.id,
        title: note.title,
        content: note.content,
        editedById:
          req.user.userId
      }
    });

    // RESTORE OLD VERSION

    const updatedNote =
      await prisma.note.update({
        where: {
          id
        },
        data: {
          title: version.title,
          content: version.content
        }
      });

    res.json(updatedNote);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};