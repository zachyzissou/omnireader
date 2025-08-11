export interface OmniPlugin {
  id: string;
  kind: 'source' | 'enricher' | 'action';
  meta: PluginMetadata;
  
  setup(config: Record<string, any>): Promise<void>;
  
  // Source plugins
  discover?(): Promise<SourceCandidate[]>;
  fetch?(since?: Date): Promise<NormalizedItem[]>;
  
  // Enricher plugins  
  enrich?(item: NormalizedItem): Promise<Partial<Annotation>>;
  
  // Action plugins
  action?(input: any): Promise<any>;
}

export interface PluginMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  permissions: string[];
  configSchema?: Record<string, any>;
}

export interface NormalizedItem {
  title: string;
  author?: string;
  url?: string;
  publishedAt: Date;
  content?: string;
  media?: MediaMetadata;
  tags?: string[];
  raw: Record<string, any>;
}

export interface MediaMetadata {
  type: 'audio' | 'video' | 'image';
  url: string;
  duration?: number;
  size?: number;
  mimeType?: string;
}

export interface SourceCandidate {
  name: string;
  url: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface Annotation {
  kind: 'SUMMARY' | 'TAGS' | 'TOPICS' | 'HIGHLIGHTS' | 'NOTE';
  text?: string;
  data?: Record<string, any>;
  createdBy?: string;
}

// Plugin registry
export class PluginRegistry {
  private plugins = new Map<string, OmniPlugin>();

  register(plugin: OmniPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  get(id: string): OmniPlugin | undefined {
    return this.plugins.get(id);
  }

  getByKind(kind: OmniPlugin['kind']): OmniPlugin[] {
    return Array.from(this.plugins.values()).filter(p => p.kind === kind);
  }

  list(): OmniPlugin[] {
    return Array.from(this.plugins.values());
  }
}