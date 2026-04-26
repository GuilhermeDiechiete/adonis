import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.group(() => {

  router.post('/', [controllers.Transactions, 'store']) // criar transações (input/output)
  // router.get('/', [controllers.Transactions, 'index'])
  router.get('/', [controllers.Transactions, 'show']) // buscar transações por filtro (inputs and outputs)
  router.delete('/:id', [controllers.Transactions, 'destroy']) // deletar transação 

}).prefix('/transactions').middleware(middleware.auth())