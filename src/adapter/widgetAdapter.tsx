import { Button, Input, Dropdown, Menu } from 'antd';

export type WidgetRender = (props: API.Widget) => JSX.Element;

const WidgetAdapter: Record<string, WidgetRender> = {
  button: (props) => (
    <Button {...props} onClick={() => eval(props.model)}>
      {props.text}
    </Button>
  ),
  'button-group': (props) => {
    const overlayMenu = (
      <Menu>
        {props.model.map((item: API.Widget) => (
          <Menu.Item key={item.key}>{item.text}</Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown.Button key={props.key || 'button-n'} size="small" type="text" overlay={overlayMenu}>
        {props.text}
      </Dropdown.Button>
    );
  },
  input: (props) => <Input key={props.key || 'input-n'} {...props.properties} />,
};
export default WidgetAdapter;
