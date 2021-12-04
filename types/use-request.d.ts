declare type RequestFunction = (...args: any[]) => Promise<any>;
declare type UseRequestOptions<Data, RequestFunction> = {
    value: Data;
    requestFunction: RequestFunction;
};
declare type UseRequestResults<Data, RequestFunction> = {
    data: Data | null;
    loading: boolean;
    error: any;
    refetch?: () => Promise<Data>;
};
declare const useRequest: <TData, RequestFunc extends RequestFunction>(options: UseRequestOptions<TData, RequestFunc>) => UseRequestResults<TData, RequestFunc>;

declare const _default: {
    useRequest: <TData, RequestFunc extends RequestFunction>(options: UseRequestOptions<TData, RequestFunc>) => UseRequestResults<TData, RequestFunc>;
};

export { _default as default, useRequest };
