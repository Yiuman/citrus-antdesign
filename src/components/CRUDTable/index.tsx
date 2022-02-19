import React, { useEffect, useState } from 'react';
import { CRUDProp } from './typing';
import createCRUD from '@/services/crud';
import { Table } from 'antd';
import useRequest from '@ahooksjs/use-request';
import { ColumnsType } from 'antd/lib/table';

import WidgetAdapter from '@/adapter';
import { sortBy } from 'lodash';
type AlignType = 'left' | 'right' | 'center';
const getColumnAlignType = (align: string | undefined): AlignType => {
  if (!align) {
    return 'center';
  }
  switch (align) {
    case 'start':
      return 'left';
    case 'end':
      return 'right';
    default:
      return align as AlignType;
  }
};

/**
 * 后台数据转ANTD-TABLE列
 * @param columns  后台表头
 * @returns ANTD-TABLE列
 */
const toColumns = (columns: API.Column[] | undefined): ColumnsType<any> => {
  const columnTypes: ColumnsType<any> = [];
  columns &&
    columns.forEach((column) => {
      const title = column.text === 'EDIT-COLUMN' ? '操作' : column.text;
      columnTypes.push({
        title: title,
        dataIndex: column.model,
        align: getColumnAlignType(column.align),
        key: column.model,
        sorter: column.sortable,
        //设置单元格属性
        onCell: (record: any) => ({
          record,
          title: title,
          dataIndex: column.model,
          key: column.model,
          widgetName: record[column.model].widgetName,
          value: record[column.model],
        }),
      });
    });
  return columnTypes;
};

/**
 * 分页数据转ANT-TABLE表格数据
 * @param pageData 后台分页数据
 * @returns  ANTD-TABLE数据
 */
const toDatas = (pageData: API.Page<any> | undefined) => {
  if (!pageData) {
    return [];
  }
  const itemKey: string = pageData.itemKey || 'id';
  const datas = pageData.records;
  if (pageData.extension) {
    return datas.map((record) => {
      //扩展数据
      const extData = pageData.extension[record[itemKey]];
      return { ...record, ...extData, key: record[itemKey] };
    });
  }

  return datas;
};

/**
 * 渲染单元格参数定义
 */
interface RenderCellProps extends React.HTMLAttributes<HTMLElement> {
  key: string;
  dataIndex: string;
  title: any;
  record: any;
  value: any;
  index: number;
  children: React.ReactNode;
  widgetName: string | undefined;
}

const RenderCell: React.FC<RenderCellProps> = (props: RenderCellProps) => {
  if (props.widgetName) {
    const widgetRender = WidgetAdapter[props.widgetName];
    let jsxElement = props.value.toString();
    if (widgetRender) {
      jsxElement = widgetRender(props.value as API.Widget);
    }

    return (
      <td>
        <div style={{ color: 'red' }}>{jsxElement}</div>
      </td>
    );
  }
  return <td>{props.children}</td>;
};
const CRUDTable: React.FC<CRUDProp> = (props) => {
  const crudService = createCRUD(props.uri || props?.route?.uri);
  const [pageQuery, setPageQuery] = useState<API.PageQuery & Record<string, any>>({
    current: 1,
    size: 10,
    sortBy: undefined,
    sortDesc: undefined,
  });
  function pageQueryService() {
    return crudService.tableView(pageQuery);
  }
  const { data, loading, run } = useRequest<API.TableView<any>>(pageQueryService);
  useEffect(() => {
    run();
  }, [pageQuery]);

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
          setPageQuery({
            ...pageQuery,
            current: pagination.current || 1,
            sortBy: sorter.field,
            sortDesc: sorter.order ? Boolean('dscend' === sorter.order) : undefined,
          });
          console.warn(pagination, filters, sorter);
        }}
      />
    </div>
  );
};

export default CRUDTable;
