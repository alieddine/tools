// db.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface FileEntry {
  id?: number;
  name: string;
  type: string;
  content: string;
  createdAt: string;
}

class FileDatabase extends Dexie {
  files!: Table<FileEntry, number>;

  constructor() {
    super('FileDatabase');
    this.version(1).stores({
      files: '++id, fileId, name, type, createdAt',
    });
  }
}

export const db = new FileDatabase();
