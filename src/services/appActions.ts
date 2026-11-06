import { Linking, Share } from 'react-native';
import {
  PLAY_STORE_MARKET_URL,
  PLAY_STORE_WEB_URL,
  supportMailtoUrl,
} from '../utils/appLinks';

/** Resolves false when nothing on the device can open the URL. */
export async function openUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function shareText(message: string): Promise<void> {
  try {
    await Share.share({ message });
  } catch {
    // The user dismissing the sheet or a missing share target is not an error worth showing.
  }
}

export async function openStoreListing(): Promise<boolean> {
  return (await openUrl(PLAY_STORE_MARKET_URL)) || openUrl(PLAY_STORE_WEB_URL);
}

export function openSupportEmail(): Promise<boolean> {
  return openUrl(supportMailtoUrl());
}
