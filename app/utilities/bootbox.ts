export interface bootbox {
    prompt(config: bootboxConfig): void;
    dialog(config: bootboxConfig): void;
    alert(title:string, callback?: Function): void;
}

export interface bootboxConfig {
    title: string;
    value?: string;
    callback?: Function;
    message?: string;
    buttons?: any;
}