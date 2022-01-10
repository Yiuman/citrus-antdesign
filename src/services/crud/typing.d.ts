declare namespace API {
  type Page<ENTITY> = {
    //主键名称
    itemKey: string;
    //扩展数据
    recordExtend: Record<string, Record<string, any>>;
    //视图
    view: any;
    //分页记录
    record: ENTITY[];
    //总数
    total: number;
    //分数数
    size: number;
    //当前页
    current: number;
  };
  type CRUD<ENTITY, KEY> = {
    //根据主键获取数据记录
    get: (key: KEY) => Promise<ENTITY>;
    //保存数据/更新数据
    save: (data: ENTITY) => Promise<KEY>;
    //根据主键删除记录
    delete: (key: KEY) => Promise<void>;
    //主键数组批量删除
    batchDelete: (keys: KEY[]) => Promise<void>;
    //列表查询
    list: (queryParams: any) => Promise<ENTITY[]>;
    //分页查询
    page: (queryParams: any) => Promise<Page<ENTITY>>;
    //导出
    exp: (queryParams: any) => Promise<Blob>;
    //导入
    imp: (File: File) => Promise<void>;
  };
}
