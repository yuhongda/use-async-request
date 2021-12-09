import * as React from 'react';
import React__default, { ReactNode } from 'react';

declare type TransformFunction<TData> = (res: any) => TData;
declare type RequestFunction<TData> = {
    func: (...args: any[]) => Promise<any>;
    payload?: any;
    transform?: TransformFunction<TData>;
};
declare type UseAsyncRequestOptions<Data> = {
    defaultData?: (Data | null)[] | null;
    requestFunctions: RequestFunction<Data>[];
    auto?: boolean;
};
declare type UseAsyncRequestData<Data> = {
    data: (Data | null)[] | null;
    loading: boolean;
    error: any;
};
interface UseAsyncRequestResults<Data> extends UseAsyncRequestData<Data> {
    refetch: () => void;
    request: () => Promise<(Data | null)[] | null>;
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
    data: TData[] | null;
} | {
    type: UseAsyncRequestActionType.ERROR;
    error: any;
} | {
    type: UseAsyncRequestActionType.RESET;
};
declare const useAsyncRequest: <TData>(options: UseAsyncRequestOptions<TData>) => UseAsyncRequestResults<TData>;

interface AsyncRequestProps<TData> {
    defaultData?: any;
    requestFunctions: RequestFunction<TData>[];
    loading?: ReactNode;
    success: React__default.FC<{
        data: TData[];
        refetch: () => void;
    }>;
    error?: React__default.FC<{
        error: any;
        refetch: () => void;
    }>;
    children?: ReactNode;
}
declare const AsyncRequest: React__default.FC<AsyncRequestProps<any>>;

declare const _default: {
    useAsyncRequest: <TData>(options: UseAsyncRequestOptions<TData>) => UseAsyncRequestResults<TData>;
    AsyncRequest: React.FC<AsyncRequestProps<any>>;
};

export { AsyncRequest, AsyncRequestProps, RequestFunction, TransformFunction, UseAsyncRequestAction, UseAsyncRequestOptions, UseAsyncRequestResults, _default as default, useAsyncRequest };
