export interface Bootbox {
    prompt(config: BootboxConfig): void;
    dialog(config: BootboxConfig): void;
    alert(title: string, callback?: Function): void;
}

export interface BootboxConfig {
    title: string;
    value?: string;
    callback?: Function;
    message?: string;
    buttons?: any;
}
