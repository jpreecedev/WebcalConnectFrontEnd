export interface MessageBox {
    prompt(config: MessageBoxConfig): void;
    dialog(config: MessageBoxConfig): void;
    confirm(title: string, callback?: Function): void;
    alert(title: string, callback?: Function): void;
}

export interface MessageBoxConfig {
    title: string;
    value?: string;
    callback?: Function;
    message?: string;
    buttons?: any;
}

export function ShowMessage(title: string, callback?: Function) {
    var messageBox: MessageBox = (<any>window).bootbox;
    messageBox.alert(title, callback);
}

export function ShowError(message: string, error: any, callback?: Function) {
    var messageBox: MessageBox = (<any>window).bootbox;

    if (error && error.json) {
        var msg = error.json().message;
        if (msg) {
            message += "<br/><br/>" + error.json().message;
        }
    }

    messageBox.alert(message, callback);
}

export function ShowConfirm(title: string, callback?: Function) {
    var messageBox: MessageBox = (<any>window).bootbox;
    messageBox.confirm(title, callback);
}

export function ShowDialog(config: MessageBoxConfig) {
    var messageBox: MessageBox = (<any>window).bootbox;
    messageBox.dialog(config);
}