/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.get': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.get']['types'],
  },
  'users.update': {
    methods: ["PUT"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'sessions.store': {
    methods: ["POST"],
    pattern: '/sessions',
    tokens: [{"old":"/sessions","type":0,"val":"sessions","end":""}],
    types: placeholder as Registry['sessions.store']['types'],
  },
  'sessions.destroy': {
    methods: ["DELETE"],
    pattern: '/sessions/:id',
    tokens: [{"old":"/sessions/:id","type":0,"val":"sessions","end":""},{"old":"/sessions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sessions.destroy']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'payments.store': {
    methods: ["POST"],
    pattern: '/payments',
    tokens: [{"old":"/payments","type":0,"val":"payments","end":""}],
    types: placeholder as Registry['payments.store']['types'],
  },
  'payments.show': {
    methods: ["GET","HEAD"],
    pattern: '/payments',
    tokens: [{"old":"/payments","type":0,"val":"payments","end":""}],
    types: placeholder as Registry['payments.show']['types'],
  },
  'payments.destroy': {
    methods: ["DELETE"],
    pattern: '/payments/:id',
    tokens: [{"old":"/payments/:id","type":0,"val":"payments","end":""},{"old":"/payments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payments.destroy']['types'],
  },
  'transactions.store': {
    methods: ["POST"],
    pattern: '/transactions',
    tokens: [{"old":"/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.store']['types'],
  },
  'transactions.total': {
    methods: ["GET","HEAD"],
    pattern: '/transactions/total',
    tokens: [{"old":"/transactions/total","type":0,"val":"transactions","end":""},{"old":"/transactions/total","type":0,"val":"total","end":""}],
    types: placeholder as Registry['transactions.total']['types'],
  },
  'transactions.categories': {
    methods: ["GET","HEAD"],
    pattern: '/transactions/categories',
    tokens: [{"old":"/transactions/categories","type":0,"val":"transactions","end":""},{"old":"/transactions/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['transactions.categories']['types'],
  },
  'transactions.show': {
    methods: ["GET","HEAD"],
    pattern: '/transactions',
    tokens: [{"old":"/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.show']['types'],
  },
  'transactions.update': {
    methods: ["PATCH"],
    pattern: '/transactions/:id',
    tokens: [{"old":"/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.update']['types'],
  },
  'transactions.destroy': {
    methods: ["DELETE"],
    pattern: '/transactions/:id/:futures',
    tokens: [{"old":"/transactions/:id/:futures","type":0,"val":"transactions","end":""},{"old":"/transactions/:id/:futures","type":1,"val":"id","end":""},{"old":"/transactions/:id/:futures","type":1,"val":"futures","end":""}],
    types: placeholder as Registry['transactions.destroy']['types'],
  },
  'suppliers.store': {
    methods: ["POST"],
    pattern: '/suppliers',
    tokens: [{"old":"/suppliers","type":0,"val":"suppliers","end":""}],
    types: placeholder as Registry['suppliers.store']['types'],
  },
  'suppliers.show': {
    methods: ["GET","HEAD"],
    pattern: '/suppliers',
    tokens: [{"old":"/suppliers","type":0,"val":"suppliers","end":""}],
    types: placeholder as Registry['suppliers.show']['types'],
  },
  'suppliers.destroy': {
    methods: ["DELETE"],
    pattern: '/suppliers/:id',
    tokens: [{"old":"/suppliers/:id","type":0,"val":"suppliers","end":""},{"old":"/suppliers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['suppliers.destroy']['types'],
  },
  'categories_reports.get_reports': {
    methods: ["GET","HEAD"],
    pattern: '/reportcategories',
    tokens: [{"old":"/reportcategories","type":0,"val":"reportcategories","end":""}],
    types: placeholder as Registry['categories_reports.get_reports']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
