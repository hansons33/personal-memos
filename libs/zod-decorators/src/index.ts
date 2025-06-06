import { createParamDecorator } from "./decorators/params"

export const Body = () => createParamDecorator("body")
export const Query = () => createParamDecorator("query")
export const Param = () => createParamDecorator("params")

export * from "./registerControllers"
export * from "./decorators/auth"
export * from "./decorators/params"
export * from "./decorators/routes"
export * from "./decorators/validateDto"
export * from "./decorators/zodProp"
