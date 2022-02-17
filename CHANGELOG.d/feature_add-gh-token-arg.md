* Add CLI arg for GH token to authenticate API requests

  Unauthenticated requests get rate limited pretty quickly.
  When using this program frequently, one will hit that limit
  and receive a Forbidden 403 response.
  By authenticating requests, this limit becomes less of a concern.