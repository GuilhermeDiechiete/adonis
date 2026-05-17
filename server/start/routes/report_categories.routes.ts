import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.group(() => {

  router.get('/', [controllers.reports.CategoriesReports, 'getReports']) 


}).prefix('/reportcategories').middleware(middleware.auth())