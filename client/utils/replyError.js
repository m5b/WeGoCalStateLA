// What to tell someone when posting a reply fails. A picture that is too large explains itself;
// anything else gets a plain "try again".
export function replyErrorMessage(error) {
  return /too large/i.test(error?.message ?? "")
    ? error.message
    : "Couldn't post your reply. Please try again.";
}