# vite lazy import 
## limit

HMR 依赖vite 静态分析 `import(..)`, 为了分析出import 要watch的文件,vite　有几个限制(https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations)

    // Not allowed
    import(`./foo/${bar}`);
    // allowed
    import(`./foo/${bar}.js`);
    // not allowed
    import(`./${foo}.js`);// 太宽泛了
    // allowed
    import(`./module-${foo}.js`);

如果忽略分析的话,可以:

    const Page: React.LazyExoticComponent<React.ComponentType<any>> = React.lazy(() => import(/* @vite-ignore */filePath));
