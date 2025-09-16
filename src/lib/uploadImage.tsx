import { storage } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function uploadBase64Image(
  base64: string,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64, "data_url");
  return await getDownloadURL(storageRef);
}
