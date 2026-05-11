import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.group(() => {

  router.post('/', [controllers.Transactions, 'store']) // criar transações (input/output)
  router.get('/total', [controllers.Transactions, 'total']) // buscar transações por filtro (inputs and outputs)
  router.get('/categories', [controllers.Transactions, 'categories']) // buscar transações por filtro (inputs and outputs)
  router.get('/', [controllers.Transactions, 'show']) // buscar transações por filtro (inputs and outputs)
  router.patch('/:id', [controllers.Transactions, 'update'])
  router.delete('/:id/:futures', [controllers.Transactions, 'destroy']) // deletar transação 

}).prefix('/transactions').middleware(middleware.auth())