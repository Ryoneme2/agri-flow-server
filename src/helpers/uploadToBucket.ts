import storageClient from '@config/connectBucket';

const uploadToBucket = async (fileName: string, folder: 'avatar' | 'blog' | 'community' | 'discuss', file: Buffer, bucketName: 'image-bucket') => {
  try {
    const storageUrl =
      `https://fphftuccochbjgwngnrc.supabase.co/storage/v1/object/public/${bucketName}/`;

    const response = await storageClient
      .from(bucketName)
      .upload(`${folder}/${fileName}.png`, file, {
        cacheControl: '3600',
        upsert: false,
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
  avatar: async (fileName: string, file: Buffer) => uploadToBucket(fileName, 'avatar', file, 'image-bucket')
}

export default helper