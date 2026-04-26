import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'


router.group(() => {
  router.post('/', [controllers.Sessions, 'store'])
  router.delete('/:id', [controllers.Sessions, 'destroy'])
}).prefix('/sessions')