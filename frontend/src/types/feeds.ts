export interface FeedListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
}

export interface FeedItemMap {
  music: FeedListItem[];
  news: FeedListItem[];
  podcasts: FeedListItem[];
  videos: FeedListItem[];
}
