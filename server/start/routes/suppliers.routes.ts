import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.group(() => {

  router.post('/', [controllers.Suppliers, 'store']) 
  router.get('/', [controllers.Suppliers, 'show'])
  //router.get('/', [controllers.Suppliers, 'show'])
  router.delete('/:id', [controllers.Suppliers, 'destroy'])

}).prefix('/suppliers').middleware(middleware.auth())