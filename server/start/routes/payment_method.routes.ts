import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.group(() => {

  router.post('/', [controllers.Payments, 'store']) // criar forma de pagamento
  router.get('/', [controllers.Payments, 'show']) // pegar lista de formas de pagamento
  router.delete('/:id', [controllers.Payments, 'destroy']) // deletar forma de pagamento

}).prefix('/payments_method').middleware(middleware.auth())