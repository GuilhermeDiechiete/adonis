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
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
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
    pattern: '/payments_method',
    tokens: [{"old":"/payments_method","type":0,"val":"payments_method","end":""}],
    types: placeholder as Registry['payments.store']['types'],
  },
  'payments.show': {
    methods: ["GET","HEAD"],
    pattern: '/payments_method',
    tokens: [{"old":"/payments_method","type":0,"val":"payments_method","end":""}],
    types: placeholder as Registry['payments.show']['types'],
  },
  'payments.destroy': {
    methods: ["DELETE"],
    pattern: '/payments_method/:id',
    tokens: [{"old":"/payments_method/:id","type":0,"val":"payments_method","end":""},{"old":"/payments_method/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payments.destroy']['types'],
  },
  'transactions.store': {
    methods: ["POST"],
    pattern: '/inputs',
    tokens: [{"old":"/inputs","type":0,"val":"inputs","end":""}],
    types: placeholder as Registry['transactions.store']['types'],
  },
  'transactions.show': {
    methods: ["GET","HEAD"],
    pattern: '/inputs',
    tokens: [{"old":"/inputs","type":0,"val":"inputs","end":""}],
    types: placeholder as Registry['transactions.show']['types'],
  },
  'transactions.update': {
    methods: ["PATCH"],
    pattern: '/inputs/:id',
    tokens: [{"old":"/inputs/:id","type":0,"val":"inputs","end":""},{"old":"/inputs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.update']['types'],
  },
  'transactions.destroy': {
    methods: ["DELETE"],
    pattern: '/inputs/:id',
    tokens: [{"old":"/inputs/:id","type":0,"val":"inputs","end":""},{"old":"/inputs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.destroy']['types'],
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
