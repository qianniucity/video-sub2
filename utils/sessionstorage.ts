type StorageContent = { [key: string]: any };

export default class SessonStorage {
    name: string;

    constructor() {
        this.name = 'subplayer_settings';
    }

    get(key?: string): any {
        if (typeof window === 'undefined') return null; // 仅在客户端使用

        const storage: StorageContent = JSON.parse(window.sessionStorage.getItem(this.name) || '{}');
        return key ? storage[key] : storage;
    }

    set(key: string, value: any): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用

        const storage: StorageContent = { ...this.get(), [key]: value };
        window.sessionStorage.setItem(this.name, JSON.stringify(storage));
    }

    del(key: string): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用

        const storage: StorageContent = this.get();
        delete storage[key];
        window.sessionStorage.setItem(this.name, JSON.stringify(storage));
    }

    clean(): void {
        if (typeof window === 'undefined') return; // 仅在客户端使用
        window.sessionStorage.removeItem(this.name);
    }
}