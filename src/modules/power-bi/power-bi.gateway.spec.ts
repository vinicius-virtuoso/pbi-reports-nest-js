import { HttpService } from '@nestjs/axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { of, throwError } from 'rxjs';
import { PowerBiGateway } from './power-bi.gateway';

describe('PowerBiGateway', () => {
  let gateway: PowerBiGateway;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;

    gateway = new PowerBiGateway(httpService);
  });

  describe('authenticate', () => {
    it('deve retornar token quando a autenticação for bem-sucedida', async () => {
      const axiosResponse: AxiosResponse = {
        data: { access_token: 'mock-token' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };
      httpService.post.mockReturnValue(of(axiosResponse));

      const token = await gateway.authenticate();

      expect(token).toBe('mock-token');
      expect(httpService.post).toHaveBeenCalled();
    });

    it('deve lançar erro se a chamada HTTP falhar', async () => {
      httpService.post.mockReturnValue(
        throwError(() => new Error('Erro HTTP')),
      );

      await expect(gateway.authenticate()).rejects.toThrow('Erro HTTP');
    });
  });

  describe('listReports', () => {
    it('deve retornar a lista de relatórios formatada', async () => {
      const axiosResponse: AxiosResponse = {
        data: {
          value: [
            {
              id: '1',
              name: 'Relatório 1',
              webUrl: 'webUrl1',
              embedUrl: 'embedUrl1',
              datasetId: 'dataset1',
              workspaceId: 'workspace1',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      httpService.get.mockReturnValue(of(axiosResponse));

      const reports = await gateway.listReports('token');

      expect(reports).toEqual([
        {
          externalId: '1',
          name: 'Relatório 1',
          webUrl: 'webUrl1',
          embedUrl: 'embedUrl1',
          datasetId: 'dataset1',
          workspaceId: 'workspace1',
        },
      ]);

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: `Bearer token` },
        }),
      );
    });

    it('deve lançar erro se a chamada HTTP falhar', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Erro HTTP')));

      await expect(gateway.listReports('token')).rejects.toThrow('Erro HTTP');
    });
  });

  describe('generateEmbedToken', () => {
    it('deve retornar embed token corretamente', async () => {
      const axiosResponse: AxiosResponse = {
        data: { token: 'embed-token', expiration: '2026-01-01T00:00:00Z' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };
      httpService.post.mockReturnValue(of(axiosResponse));

      const embed = await gateway.generateEmbedToken('token', 'report-1');

      expect(embed).toEqual({
        token: 'embed-token',
        expiration: '2026-01-01T00:00:00Z',
      });
      expect(httpService.post).toHaveBeenCalledWith(
        expect.any(String),
        { accessLevel: 'View' },
        expect.objectContaining({
          headers: { Authorization: `Bearer token` },
        }),
      );
    });

    it('deve lançar erro se a chamada HTTP falhar', async () => {
      httpService.post.mockReturnValue(
        throwError(() => new Error('Erro HTTP')),
      );

      await expect(
        gateway.generateEmbedToken('token', 'report-1'),
      ).rejects.toThrow('Erro HTTP');
    });
  });
});
