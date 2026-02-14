import type {
  PowerBiEmbedTokenResponse,
  PowerBiReportResponse,
} from './power-bi.types';

export interface PowerBiRepository {
  authenticate(): Promise<string>;
  listReports(token: string): Promise<PowerBiReportResponse[]>;
  generateEmbedToken(
    accessToken: string,
    workspaceId: string,
    reportId: string,
  ): Promise<PowerBiEmbedTokenResponse>;
}
