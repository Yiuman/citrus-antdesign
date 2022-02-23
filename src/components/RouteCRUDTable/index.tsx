import React, { useEffect, useRef, useState } from 'react';
import CRUDTable from '@/components/CRUDTable';
import type { IRouteProps } from 'umi';
import type { CRUDProp } from '@/components/CRUDTable/typing';
import { useModel } from 'umi';

const RouteCRUDTable: React.FC<IRouteProps> = (props) => {
  const { initialState } = useModel('@@initialState');

  const matchMenu = useRef(
    initialState?.currentUser?.menus?.find((item) => item.resourceId === props.match.params.id),
  );
  const [crudProps, setCrudProps] = useState<CRUDProp>({
    uri: matchMenu.current?.path || '',
    type: matchMenu.current?.component === 'components/CrudTree' ? 'tree' : 'page',
  });

  useEffect(() => {
    matchMenu.current = initialState?.currentUser?.menus?.find(
      (item) => item.resourceId === props.match.params.id,
    );
    if (matchMenu) {
      setCrudProps(() => ({
        uri: matchMenu.current?.path || '',
        type: matchMenu.current?.component === 'components/CrudTree' ? 'tree' : 'page',
      }));
    }
  }, [initialState?.currentUser?.menus, props.match.params.id]);

  return <CRUDTable uri={crudProps.uri} type={crudProps.type} />;
};

export default RouteCRUDTable;
