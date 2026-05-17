import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'users.store': { paramsTuple?: []; params?: {} }
    'users.get': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sessions.store': { paramsTuple?: []; params?: {} }
    'sessions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.store': { paramsTuple?: []; params?: {} }
    'payments.show': { paramsTuple?: []; params?: {} }
    'payments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'transactions.total': { paramsTuple?: []; params?: {} }
    'transactions.categories': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple?: []; params?: {} }
    'transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'futures': ParamValue} }
    'suppliers.store': { paramsTuple?: []; params?: {} }
    'suppliers.show': { paramsTuple?: []; params?: {} }
    'suppliers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories_reports.get_reports': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'users.store': { paramsTuple?: []; params?: {} }
    'sessions.store': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'payments.store': { paramsTuple?: []; params?: {} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'suppliers.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'users.get': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'payments.show': { paramsTuple?: []; params?: {} }
    'transactions.total': { paramsTuple?: []; params?: {} }
    'transactions.categories': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple?: []; params?: {} }
    'suppliers.show': { paramsTuple?: []; params?: {} }
    'categories_reports.get_reports': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'users.get': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'payments.show': { paramsTuple?: []; params?: {} }
    'transactions.total': { paramsTuple?: []; params?: {} }
    'transactions.categories': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple?: []; params?: {} }
    'suppliers.show': { paramsTuple?: []; params?: {} }
    'categories_reports.get_reports': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sessions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'futures': ParamValue} }
    'suppliers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}