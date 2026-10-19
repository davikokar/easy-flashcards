/**
 * `file://` uris are percent-encoded, but the filesystem API expects a raw path,
 * so names containing spaces or accents must be decoded first.
 */
export function fileUriToPath(uri: string): string {
  const path = uri.replace(/^file:\/\//, '');
  return path.replace(/(?:%[0-9a-fA-F]{2})+/g, escaped => decodeURIComponent(escaped));
}
