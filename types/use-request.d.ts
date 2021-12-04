interface Cancel {
  message: string;
}

interface Canceler {
  (message?: string): void;
}

interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

declare type RequestFunction = (...args: any[]) => Promise<any>;
declare type TransformFunction<TData> = (res: any) => TData;
declare type UseRequestOptions<Data, RequestFunction> = {
    defaultData: Data;
    requestFunction: RequestFunction;
    payload?: any;
    transformFunction?: TransformFunction<Data>;
    axiosCancelTokenSource?: CancelTokenSource;
};
declare type UseRequestResults<Data, RequestFunction> = {
    data: Data | null;
    loading: boolean;
    error: any;
    refetch?: () => Promise<Data | null>;
    reset?: () => void;
};
declare enum UseRequestActionType {
    FETCH = "FETCH",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    RESET = "RESET"
}
declare type UseRequestAction<TData> = {
    type: UseRequestActionType.FETCH;
} | {
    type: UseRequestActionType.SUCCESS;
    data: TData | null;
} | {
    type: UseRequestActionType.ERROR;
    error: any;
} | {
    type: UseRequestActionType.RESET;
};
declare const useRequest: <TData, RequestFunc extends RequestFunction>(options: UseRequestOptions<TData, RequestFunc>) => UseRequestResults<TData, RequestFunc>;

declare const _default: {
    useRequest: <TData, RequestFunc extends RequestFunction>(options: UseRequestOptions<TData, RequestFunc>) => UseRequestResults<TData, RequestFunc>;
};

export { RequestFunction, TransformFunction, UseRequestAction, UseRequestOptions, UseRequestResults, _default as default, useRequest };
