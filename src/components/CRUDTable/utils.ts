import type { ColumnsType } from 'antd/lib/table';

export type AlignType = 'left' | 'right' | 'center';
export const getColumnAlignType = (align: string | undefined): AlignType => {
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
export const toColumns = (columns: API.Column[] | undefined): ColumnsType<any> => {
  const columnTypes: ColumnsType<any> = [];
  if (columns) {
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
          align: getColumnAlignType(column.align),
          title: title,
          dataIndex: column.model,
          key: column.model,
          widgetName: record[column.model]?.widgetName,
          value: record[column.model],
        }),
      });
    });
  }

  return columnTypes;
};

/**
 * 扩展记录
 * @param records 记录数据
 * @param extensionData 扩展数据MAP
 * @param itemKey 数据主键
 */
export const extensionRecords = (
  records: any[],
  extensionData: Record<string, any>,
  itemKey: string,
): any[] => {
  return records.map((record) => {
    //扩展数据
    const extData = extensionData[record[itemKey]];
    // //有children字段则递归处理树形
    const children =
      record.children && record.children.length
        ? extensionRecords(record.children, extensionData, itemKey)
        : null;
    return { ...record, ...extData, key: record[itemKey], children: children };
  });
};

/**
 * 分页数据转ANT-TABLE表格数据
 * @param pageData 后台分页数据
 * @returns  ANTD-TABLE数据
 */
export const toDatas = (pageData: API.Page<any> | undefined) => {
  if (!pageData) {
    return [];
  }
  const itemKey: string = pageData.itemKey || 'id';
  const datas = pageData.records;
  if (pageData.extension) {
    return extensionRecords(datas, pageData.extension, itemKey);
  }

  return datas;
};
