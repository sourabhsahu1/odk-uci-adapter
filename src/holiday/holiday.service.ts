import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { catchError, map, tap } from "rxjs/operators";
import { PrismaService } from "../PrismaService";

@Injectable()
export class HolidayService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
  }

  async registerSms(data: any, string): Promise<any> {
    let status = 404;
    console.log({ data });
    let resp = this.httpService.post(`${this.configService.get<string>("UCI_URL")}/message/send`, data).pipe(map((response: any) => {
      response.data;
      status = response.data.status;
    }), catchError(e => {
      throw new HttpException(e.response.data, e.response.status);
    })).subscribe();
    if (status === 200) {
      const res = await this.updateSubmissionStatus(string);
    }
    return resp;
  }

  async updateSubmissionStatus(string): Promise<any> {
    return this.prisma.submission.updateMany({
      where: { xml_string: string },
      data: { status: "sent" }
    });
  }
}