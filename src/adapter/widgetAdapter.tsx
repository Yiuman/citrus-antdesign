import { Button, Dropdown, Menu, message } from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

export type WidgetRender = (props: API.Widget) => JSX.Element | Promise<JSX.Element>;

window.edit = (model) => {
  alert(model);
};

window.save = (model) => {
  alert(model);
};

export const renderForm = (formView: API.FormView<any>): JSX.Element => {
  const editsFieldGroups: API.EditField[][] = [];
  for (let i = 0, len = formView.editFields.length; i < len; i += 2) {
    editsFieldGroups.push(formView.editFields.slice(i, i + 2));
  }
  const FormWidgets = editsFieldGroups.map((singleFieldGroups, index) => (
    <ProForm.Group key={`field-group-${index}`}>
      {singleFieldGroups.map((editField) =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        WidgetAdapter[editField.widget?.widgetName]?.(editField.widget),
      )}
    </ProForm.Group>
  ));
  return (
    <ModalForm
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {formView.title}
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values.name);
        formView?.buttons?.[0]?.model();
        message.success('提交成功');
        return true;
      }}
    >
      {FormWidgets}
    </ModalForm>
  );
};

const WidgetAdapter: Record<string, WidgetRender> = {
  button: (props) => {
    return (
      <Button {...props} onClick={() => eval(props.model)}>
        {props.text}
      </Button>
    );
  },
  'button-group': (props) => {
    const overlayMenu = (
      <Menu>
        {props.model.map((item: API.Widget) => (
          <Menu.Item key={item.key} onClick={() => eval(`window.${item.model}`)}>
            {item.text}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown.Button key={props.key || 'button-n'} size="small" type="text" overlay={overlayMenu}>
        {props.text}
      </Dropdown.Button>
    );
  },
  input: (props) => <ProFormText key={props.key || 'input-n'} {...props.properties} />,
};

export default WidgetAdapter;
