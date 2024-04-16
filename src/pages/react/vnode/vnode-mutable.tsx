import React from "react";

function Com({ onChange, title }: { onChange?: (v: any) => void, title?: string; }) {
  return <div className="flex flex-col m-8">
    title:{title}
    <input onChange={(e) => onChange?.(e.target.value)} defaultValue={"1"} />
  </div>;
}

export default () => {
  // return <div>sssss</div>;
  const child = <Com />;
  const props = {
    ...(child as React.ReactElement).props,
    title: 'new title',
    onChange: (v: any) => console.log(v),
  };
  const vnode = React.cloneElement(
    child as React.ReactElement,
    props,
  );
  return vnode;
};