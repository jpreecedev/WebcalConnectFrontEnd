export class CsvHelper {

    public download<T>(data: Array<T>, page: number, itemSelector: Function): void {
        var pageData: Array<T> = data.slice((page - 1) * 10, ((page - 1) * 10) + 10);
        var csvContent: string = "";

        for (var index: number = 0; index < pageData.length; index++) {
            var element: T = pageData[index];
            var item: any = itemSelector(element);
            csvContent += item.join() + "\n";
        }

        var blob: Blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, "data.csv");
        } else {
            var link: any = document.createElement("a");
            if (link.download !== undefined) {
                var url: string = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "data.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

}
