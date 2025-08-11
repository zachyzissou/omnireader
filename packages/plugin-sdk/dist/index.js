// Plugin registry
export class PluginRegistry {
    plugins = new Map();
    register(plugin) {
        this.plugins.set(plugin.id, plugin);
    }
    get(id) {
        return this.plugins.get(id);
    }
    getByKind(kind) {
        return Array.from(this.plugins.values()).filter(p => p.kind === kind);
    }
    list() {
        return Array.from(this.plugins.values());
    }
}
//# sourceMappingURL=index.js.map