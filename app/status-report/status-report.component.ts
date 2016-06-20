import { Component, OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { StatusReportService } from "./status-report.service";
import { HttpService } from "../utilities/HttpService";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { WCButtonComponent } from "../utilities/wc-button/wc-button.component";
import { ShowError } from "../utilities/messageBox";
import { isAdministrator } from "../utilities/Jwt";

declare var Gauge: any;

export interface StatusReportTechnician {
    value: number,
    color: string,
    label: string
}

export interface StatusReport {
    performance: StatusReportTechnician[],
    score: number,
    colorStart: string,
    colorStop: string,
    lineChartLabels: string[],
    lineChartData: number[],
    users: StatusReportUser[]
}

export interface StatusReportUser {
    id: number;
    name: string;
}

@Component({
    templateUrl: "app/status-report/status-report.component.html",
    styleUrls: ["app/status-report/styles.css"],
    providers: [StatusReportService, HttpService],
    directives: [SpinnerComponent, WCButtonComponent]
})
export class StatusReportComponent implements OnInit {

    private isRequesting: boolean;
    private users: StatusReportUser[];
    private selectedSiteId: number;
    private hasData: boolean;
    private statusReportData: StatusReport;

    constructor(private service: StatusReportService) {
    }

    ngOnInit(): void {
        this.loadReport();
    }

    loadReport(): void {
        this.isRequesting = true;
        this.service.getStatusReport(this.selectedSiteId).subscribe((response: StatusReport) => {
            if (!this.users) {
                this.users = response.users;
            }
            this.buildChart(response);
        },
        (error: any) => {
            ShowError("Unable to get status report, please try again later.", error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    buildChart(data: StatusReport) {
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
            new Chart(ctx).Bar(<LinearChartData>{
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
    
    asDate(input: string): Date {
        return new Date(input);
    }
}
