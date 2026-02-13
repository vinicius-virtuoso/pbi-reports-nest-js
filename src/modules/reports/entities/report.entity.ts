type CreateReport = {
  name: string;
  webUrl: string;
  embedUrl: string;
};

type ReportView = {
  id: string | null;
  name: string;
  webUrl: string;
  embedUrl: string;
};

export class Report {
  constructor(
    public id: string | null,
    public name: string,
    public webUrl: string,
    public embedUrl: string,
  ) {}

  static create(data: CreateReport): Report {
    return new Report(null, data.name, data.webUrl, data.embedUrl);
  }

  static fromPersistence(data: {
    id: string;
    name: string;
    webUrl: string;
    embedUrl: string;
  }): Report {
    return new Report(data.id, data.name, data.webUrl, data.embedUrl);
  }

  toView(): ReportView {
    return {
      id: this.id,
      name: this.name,
      webUrl: this.webUrl,
      embedUrl: this.embedUrl,
    };
  }
}
