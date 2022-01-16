import React, { useCallback, useEffect, useState } from 'react';
import { CRUDProp } from './typing';
import createCRUD from '@/services/crud';
import { Table } from 'antd';
import useRequest from '@ahooksjs/use-request';
import { ColumnsType } from 'antd/lib/table';

const toColumns = (headers: API.Header[]): ColumnsType<any> => {
  const columns: ColumnsType<any> = [];
  headers &&
    headers.forEach((header) => {
      columns.push({
        title: header.text,
        dataIndex: header.value,
        key: header.value,
      });
    });
  return columns;
};

const toDatas = (pageData: API.Page<any> | undefined) => {
  if (!pageData) {
    return [];
  }
  const itemKey: string = pageData.itemKey || 'id';
  const datas = pageData.records;
  if (pageData.recordExtend) {
    return datas.map((record) => {
      return { ...record, ...pageData.recordExtend[record[itemKey]] };
    });
  }

  return datas;
};

const CRUDTable: React.FC<CRUDProp> = (props) => {
  const crudService = createCRUD(props.uri || props?.route?.uri);
  const [pageQuery, setPageQuery] = useState<API.PageQuery & Record<string, any>>({
    current: 1,
    size: 10,
  });
  function pageQueryService() {
    return crudService.page(pageQuery);
  }
  const { data, loading, run } = useRequest<API.Page<any>>(pageQueryService);
  useEffect(() => {
    run();
  }, [pageQuery]);

  return (
    <div>
      <Table
        loading={loading}
        columns={toColumns(data?.view?.headers)}
        dataSource={toDatas(data)}
        pagination={{
          pageSize: pageQuery.size,
          current: pageQuery.current,
          total: data?.total,
          onChange: (current) => {
            setPageQuery({ ...pageQuery, current: current });
          },
        }}
      />
    </div>
  );
};

export default CRUDTable;
