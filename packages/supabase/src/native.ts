import { createMMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from "aes-js";

import "react-native-get-random-values";

import { supabaseEnvNative } from "../env.native";

const env = supabaseEnvNative();

const storage = createMMKV();

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in MMKV.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1),
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey),
    );
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }
  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
  async getItem(key: string) {
    const encrypted = storage.getString(key);
    if (!encrypted) {
      return null;
    }
    return await this._decrypt(key, encrypted);
  }
  async removeItem(key: string) {
    storage.remove(key);
    await SecureStore.deleteItemAsync(key);
  }
  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);
    storage.set(key, encrypted);
  }
}

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
