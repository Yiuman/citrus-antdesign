export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  // {
  //   path: '/crud',
  //   name: 'crudTest',
  //   component: '../components/RouteCRUDTable',
  //   uri: '/rest/users',
  // },
  {
    path: '/crud/:id',
    component: '../components/RouteCRUDTable',
  },
  {
    path: '/',
    redirect: '/crud',
  },
  {
    component: './404',
  },
];
