export interface Headers {
  'Content-length': string;
  'content-type': string;
  'user-agent': string;
}

export interface Request {
  'abs_path': string;
  'absoluteUri': string;
  'HTTP-Version': string;
  'headers': Headers;
  'host': string;
  'message-body': string;
  'Method': string;
}

export interface Headers2 {
  'Content-length': string;
  'X-xss-protection': string;
  'X-content-type-options': string;
  'Transfer-encoding': string;
  'Expires': string;
  'Vary': string;
  'Server': string;
  '-content-encoding': string;
  'Pragma': string;
  'Cache-control': string;
  'Date': string;
  'X-frame-options': string;
  'Alt-svc': string;
  'Content-type': string;
}

export interface Response {
  'Reason-Phrase': string;
  'HTTP-Version': string;
  headers: Headers2;
  'message-body': string;
  'Status-Code': number;
  'is-binary': boolean;
}

export interface TOKEN_RESPONSE {
  success: boolean;
  access_token: string;
  Request: Request;
  expires_in: number;
  Response: Response;
  refresh_token: string;
}