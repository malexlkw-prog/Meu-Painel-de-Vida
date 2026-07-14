import { GalleryPhoto } from '../types';

const DB_NAME = 'lifehub_gallery_db';
const DB_VERSION = 1;
const STORE_PHOTOS = 'photos';
const STORE_ALBUMS = 'albums';

export function initGalleryDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ALBUMS)) {
        db.createObjectStore(STORE_ALBUMS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Get all photos
export async function getAllPhotos(): Promise<GalleryPhoto[]> {
  try {
    const db = await initGalleryDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_PHOTOS, 'readonly');
      const store = transaction.objectStore(STORE_PHOTOS);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error getting photos from IndexedDB:', err);
    return [];
  }
}

// Save a photo
export async function savePhoto(photo: GalleryPhoto): Promise<void> {
  const db = await initGalleryDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readwrite');
    const store = transaction.objectStore(STORE_PHOTOS);
    const request = store.put(photo);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Delete a photo permanently
export async function deletePhotoPermanently(id: string): Promise<void> {
  const db = await initGalleryDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readwrite');
    const store = transaction.objectStore(STORE_PHOTOS);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Albums helpers
export interface GalleryAlbum {
  id: string;
  name: string;
  isCustom?: boolean;
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  try {
    const db = await initGalleryDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ALBUMS, 'readonly');
      const store = transaction.objectStore(STORE_ALBUMS);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result || [];
        resolve(result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error getting albums from IndexedDB:', err);
    return [];
  }
}

export async function saveAlbum(album: GalleryAlbum): Promise<void> {
  const db = await initGalleryDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ALBUMS, 'readwrite');
    const store = transaction.objectStore(STORE_ALBUMS);
    const request = store.put(album);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteAlbum(id: string): Promise<void> {
  const db = await initGalleryDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ALBUMS, 'readwrite');
    const store = transaction.objectStore(STORE_ALBUMS);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
