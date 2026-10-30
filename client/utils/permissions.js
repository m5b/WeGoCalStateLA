// Who may change a post, reply, or event: the person who wrote it, or an admin.
// `user` is the signed-in user from useAuth() (guests have no userUuid), and
// `authorUuid` is the author's id as the server sent it. Anonymous content has
// no author, so only an admin can manage it. The server makes the same check
// again on every request, so hiding a button here is only about not showing
// people things they can't do.
export function canManage(user, authorUuid) {
  if (!user?.userUuid) return false;
  if (user.isAdmin) return true;
  return !!authorUuid && authorUuid === user.userUuid;
}