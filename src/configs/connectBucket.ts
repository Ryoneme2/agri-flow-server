import dotenv from 'dotenv';
import { StorageClient as SupabaseStorageClient } from '@supabase/storage-js'
dotenv.config();

const STORAGE_URL = 'https://fphftuccochbjgwngnrc.supabase.co/storage/v1';
const SERVICE_KEY = process.env.SERVICE_KEY;

if (!SERVICE_KEY) throw new Error("SERVICE_KEY NOT FOUND")

const storageClient = new SupabaseStorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

export default storageClient;