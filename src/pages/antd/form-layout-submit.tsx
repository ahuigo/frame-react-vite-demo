import { ProForm, ProFormText, ProFormSelect, FooterToolbar } from '@ant-design/pro-components';
import { Button } from 'antd';

export default () => {
  const [form] = ProForm.useForm();
  const testFormValue = () => {
    console.log(form.getFieldsValue());
  }
  return <ProForm
    // layout="inline"
    form={form}
    layout="horizontal"
    labelCol={{ span: 6 }} /** label 对齐, labelStyle 设置最小斯宾宽度，且　layout要用inline */ 
    submitter={{
      render: ({ submit }, dom) => <div>
        <Button onClick={submit} type="primary">创建</Button>
        <Button onClick={testFormValue} type="primary">Test</Button>
        <FooterToolbar>
          <Button onClick={submit} type="primary">创建(footer)</Button>
          {dom}
        </FooterToolbar>
      </div>,
    }}
    onFinish={(values) => Promise.resolve()}
  >
    <ProFormSelect
      name="heatmap_type"
      label="Heatmap Type"
      options={[
        { value: 'frame', label: 'Frame' },
      ]}
    />
    <ProFormText
      name="a"
      label="A"
    />
  </ProForm>;
};