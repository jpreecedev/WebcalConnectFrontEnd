export class CsvHelper {

    public download<T>(data: Array<T>, page: number, itemSelector: Function): void {
        let pageData: Array<T> = data.slice((page - 1) * 10, ((page - 1) * 10) + 10);
        let csvContent = '';

        for (let index = 0; index < pageData.length; index++) {
            let element: T = pageData[index];
            let item: any = itemSelector(element);
            csvContent += item.join() + '\n';
        }

        let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, 'data.csv');
        } else {
            let link: any = document.createElement('a');
            if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

}
