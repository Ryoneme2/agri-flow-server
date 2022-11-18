import storageClient from '@config/connectBucket';
import dotenv from 'dotenv'
dotenv.config()

enum mimEnum {
  x = 'x'
}

const uploadToBucket = async (fileName: string, folder: 'avatar' | 'blog' | 'community' | 'discuss', file: Buffer | ArrayBufferLike | string, bucketName: 'image-bucket', mimtype: string) => {
  try {
    const storageUrl =
      `https://fphftuccochbjgwngnrc.supabase.co/storage/v1/object/public/${bucketName}/`;

    const response = await storageClient
      .from(bucketName)
      .upload(`${folder}/${fileName}.${mimtype.split('/')[1] || 'png'}`, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimtype
      });

    if (response.error) throw new Error(`${response.error.name} : ${response.error.message}`);

    return {
      error: false,
      path: `${storageUrl}${response.data.path}`
    }
  } catch (e) {
    console.error(e);

    return {
      error: true,
      path: ''
    }
  }
}

const helper = {
  avatar: async (fileName: string, file: Buffer | ArrayBufferLike | string, mimtype = 'image/png') => uploadToBucket(fileName, 'avatar', file, 'image-bucket', mimtype),
  blog: async (fileName: string, file: Buffer | ArrayBufferLike | string, mimtype = 'image/png') => uploadToBucket(fileName, 'blog', file, 'image-bucket', mimtype),
  discuss: async (fileName: string, file: Buffer | ArrayBufferLike | string, mimtype = 'image/png') => uploadToBucket(fileName, 'discuss', file, 'image-bucket', mimtype),
}

export default helper