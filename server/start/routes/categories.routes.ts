import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.group(() => {

  router.post('/', [controllers.Categories, 'store']) 
  router.get('/', [controllers.Categories, 'index'])
  router.delete('/:id', [controllers.Categories, 'destroy'])

}).prefix('/categories').middleware(middleware.auth())