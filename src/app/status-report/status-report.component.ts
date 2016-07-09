import { Component, OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { StatusReportService } from "./status-report.service";
import { HttpService } from "../utilities/HttpService";
import { FileUploadService } from "../utilities/file-upload.service";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { WCButtonComponent } from "../utilities/wc-button/wc-button.component";
import { ShowError, ShowConfirm } from "../utilities/messageBox";
import { isAdministrator } from "../utilities/Jwt";
import { Subscription } from "rxjs/Subscription";

declare var Gauge: any;
declare var Chart: any;

export interface StatusReportTechnician {
    value: number;
    color: string;
    label: string;
}

export interface StatusReport {
    performance: StatusReportTechnician[];
    score: number;
    colorStart: string;
    colorStop: string;
    lineChartLabels: string[];
    lineChartData: number[];
    users: StatusReportUser[];
}

export interface StatusReportUser {
    id: number;
    name: string;
}

@Component({
    templateUrl: "./status-report.component.html",
    styleUrls: ["./styles.css"],
    providers: [StatusReportService, HttpService, FileUploadService],
    directives: [SpinnerComponent, WCButtonComponent]
})
export class StatusReportComponent implements OnInit {

    private isRequesting: boolean;
    private users: StatusReportUser[];
    private selectedSiteId: number;
    private hasData: boolean;
    private statusReportData: StatusReport;
    private isBuildingReport: boolean;

    constructor(private service: StatusReportService) {
    }

    ngOnInit(): void {
        this.loadReport();
    }

    loadReport(selectedSiteId?: number, complete?: Function): void {
        this.isRequesting = true;
        this.service.getStatusReport(selectedSiteId || this.selectedSiteId).subscribe((response: StatusReport) => {
            if (!this.users) {
                this.users = response.users;
            }
            this.buildChart(response);
        },
        (error: any) => {
            ShowError("Unable to get status report, please try again later.", error);
            this.isRequesting = false;
            this.tryCallback(complete);
        },
        () => {
            this.isRequesting = false;
            this.tryCallback(complete);
        });
    }

    buildChart(data: StatusReport): void {
        this.hasData = data.score > 0 && data.performance != null && data.colorStart != null && data.colorStop != null;
        if (!this.hasData) {
            this.statusReportData = null;
            return;
        }

        this.statusReportData = data;

        setTimeout(() => {
            var pieChartData = data.performance;
            var ctx = (<HTMLCanvasElement>document.getElementById("piechart")).getContext("2d");
            var myChart = new Chart(ctx).Pie(pieChartData, {
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%> (<%=segments[i].value%>)<%}%></li><%}%></ul>",
            });
            document.getElementById('js-legend').innerHTML = myChart.generateLegend();
            var opts = {
                lines: 12,
                angle: 0.15,
                lineWidth: 0.44,
                pointer: {
                    length: 0.9,
                    strokeWidth: 0.035,
                    color: '#000000'
                },
                limitMax: 'false',
                colorStart: data.colorStart,
                colorStop: data.colorStop,
                strokeColor: '#E0E0E0',
                generateGradient: true
            };
            var target = document.getElementById('overall-status');
            var gauge = new Gauge(target).setOptions(opts);
            gauge.maxValue = 100;
            gauge.animationSpeed = 32;
            gauge.set(data.score);

            var ctx = (<HTMLCanvasElement>document.getElementById("barchart")).getContext("2d");
            new Chart(ctx).Bar({
                labels: data.lineChartLabels,
                datasets: [{
                    label: "Jobs Completed",
                    fillColor: "#09355C",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: data.lineChartData
                }]
            }, { barShowStroke: false });
        }, 500);
    }

    tryCallback(callback?: Function): void {
        if (!callback) {
            return;
        }

        setTimeout(() => {
            callback();
        }, 4000);
    }

    buildReport(): void {
        ShowConfirm("Are you sure you want to generate the status report email data for each user?  This action is long running.", (result: boolean) => {
            if (result) {
                this.isBuildingReport = true;
                this.doBuildReport(0);
            }
        });
    }

    doBuildReport(position: number) {
        if (!this.users[position]) {
            this.isBuildingReport = false;
            return;
        }

        var siteId = this.users[position].id;
        this.loadReport(siteId, () => {
            if (!this.statusReportData) {
                this.doBuildReport(position += 1);
                return;
            }

            var canvases: string[] = ["overall-status", "piechart", "barchart"];
            var canvasData: File[] = [];
            canvases.forEach((canvasId: string) => {
                canvasData.push(this.blobToFile(this.convertCanvasToBlob(<HTMLCanvasElement>document.getElementById(canvasId)), canvasId + ".png"));
            });

            this.service.sendStatusReportData(siteId, canvasData, () => {
                this.doBuildReport(position += 1);
            });
        });
    }

    blobToFile(theBlob: Blob, fileName: string): File {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }

    convertCanvasToBlob(canvas: HTMLCanvasElement): Blob {
        return this.dataURItoBlob(canvas.toDataURL("image/png"));
    }

    dataURItoBlob(dataURI: string): Blob {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    canBuildReport(): boolean {
        return new Date().getDate() === 2;
    }
}
