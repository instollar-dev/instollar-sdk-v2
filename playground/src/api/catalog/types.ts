export type EndpointRow = {
  method: string;
  path: string;
  fn: string;
  response: string;
  shipped?: boolean;
};

export type EndpointSection = {
  title: string;
  endpoints: EndpointRow[];
};

export type EndpointDomain = {
  id: string;
  title: string;
  summary: string;
  endpointCount: number;
  service: 'BASE' | 'ADMIN' | 'COMPANY' | 'INSTALLER' | 'mixed';
  sdkExport: string;
  sections: EndpointSection[];
};
