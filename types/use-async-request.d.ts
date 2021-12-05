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
declare type UseAsyncRequestOptions<Data, RequestFunction> = {
    defaultData: Data;
    requestFunction: RequestFunction;
    payload?: any;
    auto?: boolean;
    transformFunction?: TransformFunction<Data>;
    axiosCancelTokenSource?: CancelTokenSource;
};
declare type UseAsyncRequestData<Data> = {
    data: Data | null;
    loading: boolean;
    error: any;
};
interface UseAsyncRequestResults<Data, RequestFunction> extends UseAsyncRequestData<Data> {
    refetch: () => void;
    request: () => Promise<Data | null>;
    reset: () => void;
}
declare enum UseAsyncRequestActionType {
    FETCH = "FETCH",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    RESET = "RESET"
}
declare type UseAsyncRequestAction<TData> = {
    type: UseAsyncRequestActionType.FETCH;
} | {
    type: UseAsyncRequestActionType.SUCCESS;
    data: TData | null;
} | {
    type: UseAsyncRequestActionType.ERROR;
    error: any;
} | {
    type: UseAsyncRequestActionType.RESET;
};
declare const useAsyncRequest: <TData, RequestFunc extends RequestFunction>(options: UseAsyncRequestOptions<TData, RequestFunc>) => UseAsyncRequestResults<TData, RequestFunc>;

declare const _default: {
    useAsyncRequest: <TData, RequestFunc extends RequestFunction>(options: UseAsyncRequestOptions<TData, RequestFunc>) => UseAsyncRequestResults<TData, RequestFunc>;
};

export { RequestFunction, TransformFunction, UseAsyncRequestAction, UseAsyncRequestOptions, UseAsyncRequestResults, _default as default, useAsyncRequest };
