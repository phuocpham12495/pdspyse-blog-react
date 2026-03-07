import { supabase } from '../lib/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UploadResult {
    url: string;
    path: string;
}

function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
        return 'Image size exceeds 5MB limit.';
    }
    return null;
}

export async function uploadThumbnail(file: File): Promise<UploadResult> {
    const error = validateFile(file);
    if (error) throw new Error(error);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('article-thumbnails')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('article-thumbnails')
        .getPublicUrl(filePath);

    return { url: data.publicUrl, path: filePath };
}

export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    const error = validateFile(file);
    if (error) throw new Error(error);

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return { url: data.publicUrl, path: filePath };
}

export { validateFile };
