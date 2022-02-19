import { request } from 'umi';
import qs from 'qs';

export default function createCRUD<ENTITY, KEY>(restUrl: string): API.CRUD<ENTITY, KEY> {
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
      return request<API.Page<ENTITY>>(
        `${restUrl}?${qs.stringify(queryParams, { arrayFormat: 'repeat' })}`,
        { method: 'GET' },
      );
    },
    tableView: (queryParams: any) => {
      return request<API.TableView<ENTITY>>(
        `${restUrl}/view?${qs.stringify(queryParams, { arrayFormat: 'repeat' })}`,
        { method: 'GET' },
      );
    },
    exp: (queryParams: any) => {
      return request<Blob>(`${restUrl}/exp`, { method: 'GET', queryParams });
    },
    imp: (file: File) => {
      return request<void>(`${restUrl}/imp`, { method: 'POST', file });
    },
  };
}
