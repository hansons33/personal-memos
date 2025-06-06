export enum CommonErrorCodes {
    Forbidden = 10003,
    NotFound = 10004,
    InternalError = 10005,
}

export const CommonErrorMessages: Record<number, string> = {
    [CommonErrorCodes.Forbidden]: "无权限访问",
    [CommonErrorCodes.NotFound]: "资源不存在",
    [CommonErrorCodes.InternalError]: "服务器内部错误",
}

export enum BusiErrorCodes {
    AlreadyExists = 10010,
    DatabaseError = 10011,
}
