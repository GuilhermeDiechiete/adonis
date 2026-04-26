/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  users: {
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  sessions: {
    store: typeof routes['sessions.store']
    destroy: typeof routes['sessions.destroy']
  }
  categories: {
    store: typeof routes['categories.store']
    index: typeof routes['categories.index']
    destroy: typeof routes['categories.destroy']
  }
  payments: {
    store: typeof routes['payments.store']
    show: typeof routes['payments.show']
    destroy: typeof routes['payments.destroy']
  }
  transactions: {
    store: typeof routes['transactions.store']
    show: typeof routes['transactions.show']
    update: typeof routes['transactions.update']
    destroy: typeof routes['transactions.destroy']
  }
}
