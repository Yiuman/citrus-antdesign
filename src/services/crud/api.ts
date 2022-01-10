import { request } from 'umi';
function createCRUD<ENTITY, KEY>(restUrl: string): API.CRUD<ENTITY, KEY> {
  return {
    get: (key: KEY) => {
      return request<ENTITY>(`${restUrl}/${key}`, { method: 'GET' });
    },
    save: (data: ENTITY) => {
      return request<KEY>(restUrl, { method: 'POST', data });
    },
    delete: (key: KEY) => {
      return request<void>(`${restUrl}/${key}`, { method: 'DELETE' });
    },
    batchDelete: (keys: KEY[]) => {
      return request<void>(`${restUrl}/batch_delete`, { method: 'POST', data: keys });
    },
    list: (queryParams: any) => {
      return request<ENTITY[]>(`${restUrl}/list`, { method: 'GET', queryParams });
    },
    page: (queryParams: any) => {
      return request<API.Page<ENTITY>>(`${restUrl}`, { method: 'GET', queryParams });
    },
    exp: (queryParams: any) => {
      return request<Blob>(`${restUrl}/exp`, { method: 'GET', queryParams });
    },
    imp: (file: File) => {
      return request<void>(`${restUrl}/imp`, { method: 'POST', file });
    },
  };
}
export default createCRUD;
