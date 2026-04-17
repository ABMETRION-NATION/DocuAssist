import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'docuassist.documents.v1';

export interface SavedDocument {
  id: string;
  typeId: string;
  title: string;
  data: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const genId = () => `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export async function listDocuments(): Promise<SavedDocument[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SavedDocument[];
    return arr.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export async function getDocument(id: string): Promise<SavedDocument | null> {
  const all = await listDocuments();
  return all.find((d) => d.id === id) || null;
}

export async function saveDocument(doc: Omit<SavedDocument, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<SavedDocument> {
  const all = await listDocuments();
  const now = new Date().toISOString();
  let record: SavedDocument;
  if (doc.id) {
    const existing = all.find((d) => d.id === doc.id);
    record = {
      id: doc.id,
      typeId: doc.typeId,
      title: doc.title,
      data: doc.data,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    const next = [record, ...all.filter((d) => d.id !== doc.id)];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } else {
    record = {
      id: genId(),
      typeId: doc.typeId,
      title: doc.title,
      data: doc.data,
      createdAt: now,
      updatedAt: now,
    };
    const next = [record, ...all];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return record;
}

export async function deleteDocument(id: string): Promise<void> {
  const all = await listDocuments();
  const next = all.filter((d) => d.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function clearAllDocuments(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
