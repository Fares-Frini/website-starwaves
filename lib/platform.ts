import { PLATFORM_URL } from "./config";

/**
 * Links into the platform.
 *
 * This site never knows whether the visitor is signed in, and does not try to:
 * the buttons are the same for everybody. The platform decides what happens
 * next. Its sign-in page sends somebody who already has a session straight to
 * their space, and sends everybody else through the form and back.
 */
export const platform = {
  signIn: (locale: string) => `${PLATFORM_URL}/${locale}/signin`,
  signUp: (locale: string) => `${PLATFORM_URL}/${locale}/signup`,
  /**
   * Registering for an event. Signed out, the platform asks for sign-in first
   * and brings the person back here; signed in, it opens the form.
   */
  register: (locale: string, slug: string) =>
    `${PLATFORM_URL}/${locale}/user/events/${encodeURIComponent(slug)}/register`,
  /**
   * The same event inside the platform, where a signed-in visitor sees what
   * the public page holds back. Signed out, the platform asks for sign-in and
   * brings them back.
   */
  event: (locale: string, slug: string) =>
    `${PLATFORM_URL}/${locale}/user/events/${encodeURIComponent(slug)}`,
  /** A person's own registration page, for the "verify a pass" style links. */
  verify: (locale: string) => `${PLATFORM_URL}/${locale}/verify`,
};
