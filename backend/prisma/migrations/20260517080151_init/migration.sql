/*
  Warnings:

  - Added the required column `editedById` to the `NoteVersion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NoteVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "editedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NoteVersion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NoteVersion_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NoteVersion" ("content", "createdAt", "id", "noteId", "title") SELECT "content", "createdAt", "id", "noteId", "title" FROM "NoteVersion";
DROP TABLE "NoteVersion";
ALTER TABLE "new_NoteVersion" RENAME TO "NoteVersion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
