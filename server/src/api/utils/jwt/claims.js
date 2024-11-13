export class Claims {
  // Subject
  sub;

  user_role;

  user_id;

  // Issued At Time
  iat;

  // Not Before Time
  nbf;

  // Expiration Time
  exp;

  constructor(username, role, id) {
    this.sub = username;
    this.user_role = role;
    this.user_id = id;
    this.iat = Math.floor(Date.now() / 1000);
    this.nbf = Math.floor(Date.now() / 1000);
    // Expires after 1 Month
    this.exp = Math.floor(Date.now() / 1000) + 60 * 43_830;
  }
}
