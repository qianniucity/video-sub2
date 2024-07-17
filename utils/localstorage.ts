type StorageContent = { [key: string]: any };

export default class Storage {
    name: string;

    constructor() {
        this.name = 'subplayer_settings';
    }

    get(key?: string): any {
        if (typeof window === 'undefined') return null; // 仅在客户端使用

        const storage: StorageContent = JSON.parse(window.localStorage.getItem(this.name) || '{}');
        return key ? storage[key] : storage;
    }

    set(key: string, value: any): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用

        const storage: StorageContent = { ...this.get(), [key]: value };
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    del(key: string): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用

        const storage: StorageContent = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    clean(): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用

        window.localStorage.removeItem(this.name);
    }
}