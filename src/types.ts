export type Emoji = {
  shortcode: string;
  url: string;
  static_url: string;
  visible_in_picker: boolean;
  category?: string;
};

export type Field = {
  name: string;
  value: string;
  verified_at?: string;
};

export type Source = {
  note: string;
  fields: Field[];
  privacy?: 'public' | 'unlisted' | 'private' | 'direct' | null;
  sensitive?: boolean | null;
  language?: string | null;
  follow_requests_count?: number | null;
};

export type Account = {
  id: string;
  username: string;
  acct: string;
  url: string;
  display_name: string;
  note: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  locked: boolean;
  emojis: Emoji[];
  discoverable: boolean;
  created_at: string;
  last_status_at: string;
  statuses_count: number;
  followers_count: number;
  following_count: number;
  moved?: Account;
  fields?: Field[];
  bot?: boolean;
  source?: Source;
  suspended?: boolean;
  mute_expires_at?: string;
};

export type Attachment = {
  id: string;
  type: 'unknown' | 'image' | 'gifv' | 'video' | 'audio';
  url: string;
  preview_url: string;
  remote_url?: string;
  meta?: string;
  description?: string;
  blurhash?: string;
};

export type Application = {
  name: string;
  website?: string;
  vapid_key?: string;
  client_id: string;
  client_secret: string;
};

export type Mention = {
  id: string;
  username: string;
  acct: string;
  url: string;
};

export type MastodonHistory = {
  day: string;
  uses: string;
  accounts: string;
};

export type Tag = {
  name: string;
  url: string;
  history?: MastodonHistory[];
};

export type Poll = {
  id: string;
  expires_at: string;
  expired: boolean;
  multiple: boolean;
  votes_count: number;
  voters_count: number | null;
  voted: boolean | null;
  own_votes: number[] | null;
  options: string[];
  emojis: Emoji[];
};

export type Card = {
  url: string;
  title: string;
  description: string;
  type: 'link' | 'photo' | 'video' | 'rich';
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  html?: string;
  width?: number;
  height?: number;
  image?: string;
  embed_url?: string;
  blurhash?: string;
};

export type Status = {
  id: string;
  uri: string;
  created_at: string;
  account: Account;
  content: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive: boolean;
  spoiler_text: string;
  media_attachments: Attachment[];
  application: Application;
  mentions: Mention[];
  tags: Tag[];
  emojis: Emoji[];
  reblogs_count: number;
  favourites_count: number;
  replies_count: number;
  url?: string | null;
  in_reply_to_id?: string | null;
  in_reply_to_account_id?: string | null;
  reblog?: Status | null;
  poll?: Poll | null;
  card?: Card | null;
  language?: string | null;
  text?: string | null;
  // Authorized attributes
  favourited?: boolean;
  reblogged?: boolean;
  muted?: boolean;
  bookmarked?: boolean;
  pinned?: boolean;
};

export type StatusContext = {
  ancestors: Status[];
  descendants: Status[];
};

export type Instance = {
  uri: string;
  title: string;
  description: string;
  short_description: string;
  email: string;
  version: string;
  languages: string[];
  registrations: boolean;
  approval_required: boolean;
  invites_enabled: boolean;
  urils: {
    streaming_api: string;
  };
  stats: {
    user_count: number;
    status_count: number;
    domain_count: number;
  };
  thumbnail?: string | null;
  contact_account?: Account | null;
};

export type Notification = {
  id: string;
  type:
    | 'follow'
    | 'follow_request'
    | 'mention'
    | 'reblog'
    | 'favourite'
    | 'poll'
    | 'status';
  created_at: string;
  account: Account;
  status: Status;
};

export type Relationship = {
  id: string;
  following: boolean;
  requested: boolean;
  endorsed: boolean;
  followed_by: boolean;
  muting: boolean;
  muting_notifications: boolean;
  showing_reblogs: boolean;
  notifying: boolean;
  blocking: boolean;
  domain_blocking: boolean;
  blocked_by: boolean;
  note: string;
};

export type Conversation = {
  id: string;
  accounts: string;
  unread: boolean;
  last_status?: Status;
};
