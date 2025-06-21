// fileService.ts
import { db } from './db';
import type { FileEntry } from './db';

export const saveFile = async (fileData: Omit<FileEntry, 'id' | 'createdAt'>) => {
    try {
        const id = await db.files.put({
            ...fileData,
            createdAt: new Date().toISOString()
        });
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const getFile = async (fileId: number) => {
    try {
        const data = await db.files.where('id').equals(fileId).first();
        if (!data) {
            return { success: false, error: 'File not found' };
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const deleteFile = async (fileId: number) => {
    try {
        await db.files.where('id').equals(fileId).delete();
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const listFiles = async () => {
    try {
        const files = await db.files.toArray();
        return { success: true, files };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};
type FileListItem = {
    id: number;
    name: string;
};

export const listFilesByType = async (type: string) => {
    try {
        const files = await db.files
            .where('type')
            .equals(type)
            .toArray();

        const minimal: FileListItem[] = files
            .filter(({ id }) => id !== undefined)
            .map(({ id, name }) => ({ id: id as number, name }));


        return { success: true, files: minimal };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};


export const saveNewFile = async (fileName: string, fileType: string, content: string) => {
    try {
        const fileData: Omit<FileEntry, 'id' | 'createdAt'> = {
            name: fileName,
            type: fileType,
            content: content
        };
        const result = await saveFile(fileData);
        if (!result.success || !result.id) {
            return { success: false, error: result.error };
        }
        const file = await getFile(result.id);
        if (!file.success) {
            return { success: false, error: file.error };
        }
        return { success: true, file: file.data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export const updateFile = async (file: FileEntry ) => {
    try {
        const { id: fileId, name: fileName, type: fileType, content } = file;
        if (!fileId) {
            return await saveNewFile(fileName, fileType, content);
        }
        const existingFile = await getFile(fileId);
        if (!existingFile.success) {
            return { success: false, error: existingFile.error };
        }
        if (existingFile.data && existingFile.data.name !== fileName) {
            return await saveNewFile(fileName, fileType, content);
        } else {
            await db.files.update(fileId, {
                name: fileName,
                type: fileType,
                content: content
            });
            return { success: true , error: null };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};
