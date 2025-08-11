export interface OmniPlugin {
    id: string;
    kind: 'source' | 'enricher' | 'action';
    meta: PluginMetadata;
    setup(config: Record<string, any>): Promise<void>;
    discover?(): Promise<SourceCandidate[]>;
    fetch?(since?: Date): Promise<NormalizedItem[]>;
    enrich?(item: NormalizedItem): Promise<Partial<Annotation>>;
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
export declare class PluginRegistry {
    private plugins;
    register(plugin: OmniPlugin): void;
    get(id: string): OmniPlugin | undefined;
    getByKind(kind: OmniPlugin['kind']): OmniPlugin[];
    list(): OmniPlugin[];
}
//# sourceMappingURL=index.d.ts.map