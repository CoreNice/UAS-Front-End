import { supabase } from '../client';

const IMAGE_BUCKET = 'pout-pictures';
export async function uploadImage(file: File, bucket = IMAGE_BUCKET): Promise<string> {
  const filePath = `public/${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true, 
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function getSignedUrl(path: string, bucket = IMAGE_BUCKET, expiresIn = 60) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}
