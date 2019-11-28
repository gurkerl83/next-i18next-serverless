import { OutgoingHttpHeaders, ServerResponse } from 'http';

// export default (res, redirectLocation) => {
//   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
//   res.header('Expires', '-1')
//   res.header('Pragma', 'no-cache')
//   res.redirect(302, redirectLocation)
// }

export default (res: ServerResponse, redirectLocation: string) => {
  redirect(res, redirectLocation, true);
};

/**
 * Composes and sends an HTTP response
 */
export function sendResponse(
  res: ServerResponse,
  statusCode: number,
  body: string,
  headers: OutgoingHttpHeaders
) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

/**
 * Sends a redirect response
 */
export function redirect(res: ServerResponse, location: string, permanent = false) {
  sendResponse(res, permanent ? 301 : 302, null, { Location: location });
}
