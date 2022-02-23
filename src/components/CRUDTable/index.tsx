import type { CRUDProp } from './typing';
import type { SorterResult } from 'antd/lib/table/interface';

import React, { useEffect, useRef, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import createCRUD from '@/services/crud';
import { Table } from 'antd';
import useRequest from '@ahooksjs/use-request';
import WidgetAdapter from '@/adapter';

import type { AlignType } from '@/components/CRUDTable/utils';
import { toColumns, toDatas } from '@/components/CRUDTable/utils';

/**
 * 渲染单元格参数定义
 */
interface RenderCellProps extends React.HTMLAttributes<HTMLElement> {
  key: string;
  dataIndex: string;
  title: any;
  align: AlignType | undefined;
  record: any;
  value: any;
  index: number;
  children: React.ReactNode;
  widgetName: string | undefined;
}

/**
 * 渲染小个子
 * @param props onCell参数
 * @constructor FC
 */
const RenderCell: React.FC<RenderCellProps> = (props: RenderCellProps) => {
  if (props.widgetName) {
    const widgetRender = WidgetAdapter[props.widgetName];
    let jsxElement = props.value.toString();
    if (widgetRender) {
      jsxElement = widgetRender(props.value as API.Widget);
    }

    return (
      <td align={props.align}>
        <div style={{ color: 'red' }}>{jsxElement}</div>
      </td>
    );
  }
  return <td align={props.align}>{props.children}</td>;
};

const CRUDTable: React.FC<CRUDProp> = (props) => {
  //分页参数
  const [pageQuery, setPageQuery] = useState<API.PageQuery & Record<string, any>>({
    current: 1,
    size: 10,
    sortBy: undefined,
    sortDesc: undefined,
    action: props.type,
  });

  //CRUD后台服务类
  const crudService = useRef<API.CRUD<string, any>>(createCRUD(props.uri));
  const { data, loading, run } = useRequest<API.TableView<any>>(
    () => crudService.current.view(pageQuery),
    { manual: true, debounceInterval: 100 },
  );

  useEffect(() => {
    crudService.current = createCRUD(props.uri);
    run();
  }, [props.uri, run]);

  useEffect(() => {
    setPageQuery((oldQuery) => ({ ...oldQuery, action: props.type }));
  }, [props.type]);

  useDeepCompareEffect(() => {
    run();
    console.warn('pageQuery');
  }, [pageQuery, run]);

  const pageRecord = data?.data;
  return (
    <div>
      <Table
        loading={loading}
        components={{
          body: {
            cell: RenderCell,
          },
        }}
        columns={toColumns(data?.columns)}
        dataSource={toDatas(pageRecord)}
        pagination={{
          pageSize: pageQuery.size,
          current: pageQuery.current,
          total: pageRecord?.total,
        }}
        onChange={(pagination, filters, sorter) => {
          const sorterResult = sorter as SorterResult<any>;
          setPageQuery({
            ...pageQuery,
            current: pagination.current || 1,
            sortBy: sorterResult.column ? sorterResult?.columnKey?.toString() : undefined,
            sortDesc: sorterResult.order ? Boolean(sorterResult.order === 'descend') : undefined,
          });
        }}
      />
    </div>
  );
};

export default CRUDTable;
